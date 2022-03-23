import React, { useEffect, VFC } from 'react';
import * as THREE from 'three';
import {
	Debug, Physics, Triplet, useBox, usePlane, useSphere, VectorApi
} from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import { AMOUNT, datas } from '../../modules/store';

export const Simulator: VFC = () => {
	return (
		<Physics gravity={[0, 0, 0]} iterations={10} broadphase="SAP">
			{/* debug mode */}
			{/* <Debug color="#fff" scale={1.05}>
				<Collisions />
				{[...Array(AMOUNT)].map((_, i) => (
					<PhysicalBox key={i} storePos={datas.positions[i]} storeRot={datas.rotations[i]} />
				))}
			</Debug> */}

			{/* product mode */}
			<Collisions />
			{[...Array(AMOUNT)].map((_, i) => (
				<PhysicalBox key={i} storePos={datas.positions[i]} storeRot={datas.rotations[i]} />
			))}
		</Physics>
	)
}

// ========================================================
const Collisions: VFC = () => {
	// back
	usePlane(() => ({ position: [0, 0, 0], rotation: [0, 0, 0] }))
	// front
	usePlane(() => ({ position: [0, 0, 8], rotation: [0, -Math.PI, 0] }))
	// // bottom
	// usePlane(() => ({ position: [0, -4, 0], rotation: [-Math.PI / 2, 0, 0] }))
	// // top
	// usePlane(() => ({ position: [0, 4, 0], rotation: [Math.PI / 2, 0, 0] }))

	const [, api] = useSphere(() => ({ type: 'Kinematic', args: [4] }))

	useFrame(({ mouse, viewport }) => {
		const x = (mouse.x * viewport.width) / 2
		const y = (mouse.y * viewport.height) / 2
		api.position.set(x, y, 1.5)
	})

	return null
}

// ========================================================
const PhysicalBox: VFC<{ storePos: THREE.Vector3; storeRot: THREE.Vector3 }> = ({ storePos, storeRot }) => {
	const scale = 2.0
	const boxSize: Triplet = [1.0 * scale, 1.0 * scale, 1.0 * scale]
	const [ref, api] = useBox(() => ({
		mass: 1,
		angularDamping: 0.8,
		linearDamping: 0.95,
		args: boxSize,
		position: storePos.toArray()
	}))

	useEffect(() => {
		const vec = new THREE.Vector3()
		const unsubscribe = (api.position as VectorApi).subscribe(p => {
			storePos.set(p[0], p[1], p[2])

			return api.applyForce(
				vec
					.set(p[0], p[1], p[2])
					.normalize()
					.multiplyScalar(-scale * 30)
					.toArray(),
				[0, 0, 0]
			)
		})
		const unsubRotation = api.rotation.subscribe(r => {
			storeRot.lerp(new THREE.Vector3(...r), 0.005)
		})

		return () => {
			unsubscribe()
			unsubRotation()
		}
	}, [api, scale, storePos, storeRot])

	return null
}
