import React, { useEffect, useRef, VFC } from 'react';
import { css, keyframes } from '@emotion/css';

export const Loading: VFC = () => {
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		setTimeout(() => {
			ref.current!.classList.add('disable')
			ref.current!.ontransitionend = () => {
				ref.current!.style.zIndex = '-10'
			}
		}, 1000)
	}, [])

	return (
		<div ref={ref} className={styles.container}>
			<div className={styles.rectangle} />
			<div className={styles.text}>Loading</div>
		</div>
	)
}

const animation = {
	rotate: keyframes`
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  `
}

const styles = {
	container: css`
		position: absolute;
		top: 0px;
		left: 0px;
		width: 100vw;
		height: 100vh;
		background-color: #000;
		display: flex;
		justify-content: center;
		align-items: center;
		transition: all 0.5s;

		&.disable {
			opacity: 0;
		}
	`,
	rectangle: css`
		position: absolute;
		width: 150px;
		height: 150px;
		border: 5px solid #fff;
		animation: ${animation.rotate} 2s linear infinite;
	`,
	text: css`
		position: absolute;
		color: #fff;
		font-size: 1.5rem;
	`
}
