import React, { useRef, VFC } from 'react';
import * as THREE from 'three';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { extend, useFrame } from '@react-three/fiber';
import { GUIController } from '../../../modules/gui';

extend({ UnrealBloomPass })

const datas = {
	enabled: true,
	exposure: 0.8,
	strength: 1,
	radius: 0.8,
	threshold: 0.1
}

export const BloomPass: VFC = () => {
	const passRef = useRef<UnrealBloomPass>(null)

	const gui = GUIController.instance.setFolder('Bloom').open(false)
	gui.addCheckBox(datas, 'enabled')
	gui.addNumericSlider(datas, 'exposure', 0.1, 2, 0.01)
	gui.addNumericSlider(datas, 'strength', 0, 10, 0.1)
	gui.addNumericSlider(datas, 'radius', 0, 2, 0.01)
	gui.addNumericSlider(datas, 'threshold', 0, 1, 0.01)

	const update = (gl: THREE.WebGLRenderer) => {
		passRef.current!.enabled = datas.enabled
		gl.toneMappingExposure = datas.enabled ? Math.pow(datas.exposure, 4.0) : 1

		if (datas.enabled) {
			passRef.current!.strength = datas.strength
			passRef.current!.radius = datas.radius
			passRef.current!.threshold = datas.threshold
		}
	}

	useFrame(({ gl }) => {
		update(gl)
	})

	return <unrealBloomPass ref={passRef} attachArray="passes" />
}
