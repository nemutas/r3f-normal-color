import { VFC } from 'react';
import { Stats } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { BloomPass } from './postprocessing/BloomPass';
import { Effects } from './postprocessing/Effects';
import { FXAAPass } from './postprocessing/FXAAPass';
import { ScreenPlane } from './ScreenPlane';
import { Simulator } from './Simulator';

export const TCanvas: VFC = () => {
	return (
		<Canvas
			camera={{
				position: [0, 0, 15],
				fov: 50,
				aspect: window.innerWidth / window.innerHeight,
				near: 0.1,
				far: 2000
			}}
			dpr={window.devicePixelRatio}>
			{/* simulator */}
			<Simulator />
			{/* objects */}
			<ScreenPlane />
			{/* effects */}
			<Effects sRGBCorrection={false}>
				<FXAAPass />
				<BloomPass />
			</Effects>
			{/* helper */}
			<Stats />
		</Canvas>
	)
}
