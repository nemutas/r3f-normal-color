import React, { VFC } from 'react';
import * as THREE from 'three';
import { Plane } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { combinations, fresnel, rotate, sdf } from '../../modules/glsl';
import { AMOUNT, datas } from '../../modules/store';

export const ScreenPlane: VFC = () => {
	const { viewport } = useThree()

	const shader: THREE.Shader = {
		uniforms: {
			u_time: { value: 0 },
			u_aspect: { value: viewport.width / viewport.height },
			u_positions: { value: datas.positions },
			u_rotations: { value: datas.rotations }
		},
		vertexShader: vertexShader,
		fragmentShader: fragmentShader
	}

	useFrame(() => {
		;[...Array(AMOUNT)].forEach((_, i) => {
			shader.uniforms.u_positions.value[i].set(datas.positions[i].x, datas.positions[i].y, datas.positions[i].z)
			shader.uniforms.u_rotations.value[i].set(datas.rotations[i].x, datas.rotations[i].y, datas.rotations[i].z)
		})
	})

	return (
		<Plane args={[1, 1]} scale={[viewport.width, viewport.height, 1]}>
			<shaderMaterial args={[shader]} />
		</Plane>
	)
}

const vertexShader = `
varying vec2 v_uv;

void main() {
  v_uv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`

const fragmentShader = `
uniform float u_time;
uniform float u_aspect;
uniform vec3 u_positions[10];
uniform vec3 u_rotations[10];
uniform sampler2D u_matcap;
varying vec2 v_uv;

const int MaxCount = 10;
const float PI = 3.14159265358979;

${sdf}
${combinations}
${rotate}
${fresnel}

float sdf(vec3 p) {
  vec3 correct = 0.1 * vec3(u_aspect, 1.0, 1.0);
	float angle = PI / 3.0;

	vec3 tp = p + -u_positions[0] * correct;
	vec3 rp = rotate(tp, -normalize(u_rotations[0]), angle);
  float final = sdBox(rp, vec3(0.15)) - 0.03;

  for(int i = 1; i < MaxCount; i++) {
		tp = p + -u_positions[i] * correct;
    rp = rotate(tp, -normalize(u_rotations[i]), angle);
		float box = sdBox(rp, vec3(0.15)) - 0.03;
    final = opSmoothUnion(final, box, 0.4);
  }

  return final;
}

vec3 calcNormal(in vec3 p) {
  const float h = 0.0001;
  const vec2 k = vec2(1, -1) * h;
  return normalize( k.xyy * sdf( p + k.xyy ) + 
                    k.yyx * sdf( p + k.yyx ) + 
                    k.yxy * sdf( p + k.yxy ) + 
                    k.xxx * sdf( p + k.xxx ) );
}

void main() {
  vec2 centeredUV = (v_uv - 0.5) * vec2(u_aspect, 1.0);
  vec3 ray = normalize(vec3(centeredUV, -1.0));
  
  vec3 camPos = vec3(0.0, 0.0, 2.3);

  vec3 rayPos = camPos;
  float totalDist = 0.0;
  float tMax = 5.0;

  for(int i = 0; i < 256; i++) {
    float dist = sdf(rayPos);

    if (dist < 0.0001 || tMax < totalDist) break;

    totalDist += dist;
    rayPos = camPos + totalDist * ray;
  }

  vec3 color = vec3(0.0);

  if(totalDist < tMax) {
    vec3 normal = calcNormal(rayPos);

		color = vec3(0.0, 0.0, 0.05);
    
    float _fresnel = fresnel(ray, normal);
    color += (normal + 0.5) * _fresnel;
  }

  gl_FragColor = vec4(color, 1.0);
}
`
