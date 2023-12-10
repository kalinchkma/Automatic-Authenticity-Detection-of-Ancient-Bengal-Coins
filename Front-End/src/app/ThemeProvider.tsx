/** @format */
'use client';

import React, { useEffect, useState } from 'react';
import { Lato } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/utils';

import { useAtom } from 'jotai';
import { authToken } from '@/store/store';
import Header from '@/components/common/Header';
import PageLoading from '@/components/common/PageLoading';

const lato = Lato({
	weight: ['400', '700', '900'],
	style: ['italic', 'normal'],
	subsets: ['latin'],
	display: 'swap',
});

// list of page
const headerInclude = ['/signup', '/login'];

export default function ThemeProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();

	return (
		<html lang='en' className={cn(false && 'dark')}>
			<body
				suppressHydrationWarning={true}
				className={cn(lato.className, 'dark:text-gray-100 text-gray-900')}>
				<>
					{!headerInclude.includes(pathname) && <Header />}
					
					<div className='w-[100%] h-auto bg-white dark:bg-black'>
						{children}
					</div>
				</>
			</body>
		</html>
	);
}
