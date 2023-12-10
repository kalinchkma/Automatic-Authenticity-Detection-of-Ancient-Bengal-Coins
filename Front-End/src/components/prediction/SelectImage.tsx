/** @format */
'use client';
import React, { useRef, useState } from 'react';

import { RiDeleteBin5Line } from 'react-icons/ri';
import { MdOutlineChangeCircle } from 'react-icons/md';

export default function SelectImage({
	setSelectedImage,
	selectedImage,
	fileSelect,
}: {
	setSelectedImage: (s: string | null) => void;
	selectedImage: string | null;
	fileSelect: () => void;
}) {
	return (
		<div className='flex w-full'>
			<div className='w-full relative'>
				<img
					alt=''
					src={selectedImage ? selectedImage : '/default-placeholder.png'}
					className='w-[200px] h-[200px] md:w-[300px] md:h-[300px] mx-auto cursor-pointer border-2'
				/>
				<div className='absolute top-0 left-0 h-[100%] w-[100%] flex items-end justify-center'>
					<button
						type='button'
						className='inline-block px-5 py-3 bg-white text-xl font-bold hover:bg-gray-300 shadow-lg'
						onClick={(e) => fileSelect()}
						title='Change Image'>
						<MdOutlineChangeCircle />
					</button>
					<button
						type='button'
						className='inline-block px-5 py-3 bg-white text-xl font-bold hover:bg-gray-300 shadow-lg'
						title='Delete Image'
						onClick={(e) => setSelectedImage(null)}>
						<RiDeleteBin5Line />
					</button>
				</div>
			</div>
		</div>
	);
}
