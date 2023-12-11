/** @format */

'use client';
import React, { useEffect } from 'react';
import { authToken } from '@/store/store';
import { redirect } from 'next/navigation';
import { useAtom } from 'jotai';
import Link from 'next/link';

export default function Guest() {
	const [auth, _] = useAtom(authToken);
	// useEffect(() => {
	// 	if (auth.token !== '') {
	// 		redirect('/profile');
	// 	}
	// }, [auth]);
	return (
		<section className='w-full'>
			<div className='container mx-auto h-screen flex flex-col px-2 items-center justify-center'>
				<h1 className='text-6xl font-black mb-4'>
					Welcome to <span className='text-teal-500'>Numismatic AI</span>
				</h1>
				<p className='font-normal'>
					Numismatic AI provide authenticity of ancient Bengal coins
				</p>
				<p className='font-bold'>Signup for Try</p>
			</div>
		</section>
	);
}
