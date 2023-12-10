/** @format */

'use client';
import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function Notfound() {
	const router = useRouter();
	return (
		<div className='w-full h-[100vh] flex flex-col items-center justify-center'>
			<h1 className='text-xl'>
				<span className='text-red-500 text-3xl'>404</span> <br />
				Page Not Found
			</h1>
			<button
				className='inline-block px-8 py-2 mt-3 text-white font-bold rounded-3xl bg-red-600 text-2xl'
				onClick={() => router.back()}>
				Back
			</button>
		</div>
	);
}
