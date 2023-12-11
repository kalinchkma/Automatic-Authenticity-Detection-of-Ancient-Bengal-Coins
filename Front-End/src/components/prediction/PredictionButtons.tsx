/** @format */

'use client';

import { cn } from '@/utils/utils';
import React, { useState } from 'react';

enum PredState {
	default = 'default',
	submitted = 'submitted',
	recived = 'recived',
}

export default function PredictionButtons({
	selectedImage,
	inputRef,
}: {
	selectedImage: string;
	inputRef: React.RefObject<HTMLInputElement>;
}) {
	const [predictionResult, setPredictionResult] = useState<string>('');
	const [predState, setPredState] = useState<PredState>(PredState.default);

	const predictionHandler = async () => {
		try {
			setPredState(PredState.submitted);
			const file = inputRef.current?.files?.[0] as File;
			const formData = new FormData();
			formData.append('file', file);

			const res = await fetch('/api/predict', {
				method: 'POST',
				body: formData,
			});
			const responseObject = await res.json();
			if (responseObject.status === 200) {
				setPredState(PredState.recived);

				if (responseObject.msg.result === '0.0') {
					setPredictionResult('Fake');
				}
				if (responseObject.msg.result === '1.0') {
					setPredictionResult('Real');
				}
			}
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className='w-full'>
			{/* make prediction button box */}
			{predictionResult !== '' && predState === PredState.recived && (
				<>
					<div className='w-full text-gray-900  p-3 rounded-md font-bold text-center'>
						{predictionResult}
					</div>
				</>
			)}

			{predState === PredState.submitted && (
				<div className='w-full text-gray-900  p-3 rounded-md font-bold text-center'>
					<div className='h-[50px] w-[50px] animate-spin rounded-full mx-auto'>
						<img src='/spin.png' />
					</div>
				</div>
			)}
			<div className='flex w-full items-center justify-center mt-2 '>
				<button
					className={cn(
						'px-4 py-2 bg-gray-300 text-gray-800  font-bold  rounded-md hover:bg-gray-400',
						predictionResult === 'Fake'
							? 'bg-red-500 text-gray-200'
							: 'bg-green-600 text-gray-200',
					)}
					onClick={() => predictionHandler()}>
					Prediction
				</button>
			</div>
		</div>
	);
}
