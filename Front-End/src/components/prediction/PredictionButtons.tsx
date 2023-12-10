/** @format */

'use client';

import React, { useState } from 'react';

export default function PredictionButtons({
	selectedImage,
	inputRef,
}: {
	selectedImage: string;
	inputRef: React.RefObject<HTMLInputElement>;
}) {
	const [predictionResult, setPredictionResult] = useState<string>('');

	const predictionHandler = async () => {
		try {
			const file = inputRef.current?.files?.[0] as File;
			const formData = new FormData();
			formData.append('file', file);

			const res = await fetch('/api/predict', {
				method: 'POST',
				body: formData,
			});
			const responseObject = await res.json();
			if (responseObject.status === 200) {
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
			{predictionResult !== '' && (
				<div className='w-full text-gray-900  p-3 rounded-md font-bold text-center'>
					{predictionResult}
				</div>
			)}
			<div className='flex w-full items-center justify-center mt-2 '>
				<button
					className='px-4 py-2 bg-gray-300 font-bold text-gray-700 rounded-md hover:bg-gray-400'
					onClick={() => predictionHandler()}>
					Prediction
				</button>
			</div>
		</div>
	);
}
