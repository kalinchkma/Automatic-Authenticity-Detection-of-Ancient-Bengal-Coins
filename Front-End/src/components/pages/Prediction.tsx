/** @format */
'use client';

import React, { useEffect, useRef, useState } from 'react';
import SelectImage from '../prediction/SelectImage';
import PredictionButtons from '../prediction/PredictionButtons';

export default function Prediction() {
	const imageInput = useRef<HTMLInputElement>(null);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);

	// file select handler
	const onFileUpload = () => {
		imageInput.current?.click();
	};

	// handle file select
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				const image = event.target?.result as string;

				setSelectedImage(image);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<section className='pt-20 w-full h-[100vh] bg-gray-100'>
			{selectedImage === null ? (
				<div className='w-full h-full flex flex-col items-center justify-center'>
					<h1 className='text-3xl text-stone-700 font-black mb-4'>
						Upload an Image to make the prediction
					</h1>
					<button
						className='bg-blue-600 px-8 py-3 text-2xl font-bold text-white rounded-3xl'
						onClick={() => onFileUpload()}>
						Upload Image
					</button>
				</div>
			) : (
				<div className='container mx-auto grid grid-cols-8'>
					<div className='col-span-8  p-2'>
						<SelectImage
							selectedImage={selectedImage}
							fileSelect={onFileUpload}
							setSelectedImage={setSelectedImage}
						/>
					</div>
					<div className='col-span-8 p-2'>
						<div className='max-w-[200px] md:max-w-[400px] mx-auto'>
							<PredictionButtons selectedImage={selectedImage} inputRef={imageInput} />
						</div>
					</div>
				</div>
			)}
			<input
				type='file'
				ref={imageInput}
				onChange={handleFileChange}
				className='hidden'
			/>
		</section>
	);
}
