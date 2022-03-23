import * as THREE from 'three';

const rand = (min: number, max: number) => {
	return Math.random() * (max - min) + min
}

export const AMOUNT = 10

export const datas = {
	positions: [...Array(AMOUNT)].map(() => new THREE.Vector3(rand(-5, 5), rand(-5, 5), 0)),
	rotations: [...Array(AMOUNT)].map(() => new THREE.Vector3(0, 0, 0))
}
