/** @format */

'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';

import { cn } from '@/utils/utils';
import { CiLight } from 'react-icons/ci';
import { MdDarkMode } from 'react-icons/md';
import { redirect } from 'next/navigation';

import { useAtom } from 'jotai';

import { authToken } from '@/store/store';

import { usePathname } from 'next/navigation';
import { RiLogoutBoxRLine } from 'react-icons/ri';

const NaviagationLink = ({
	link,
	active,
	children,
	className,
}: {
	link: string;
	children: React.ReactNode;
	active?: boolean;
	className?: string;
}) => (
	<Link
		href={link}
		className={cn(
			'ml-4 font-bold text-sm',
			active && 'text-emerald-600',
			className,
		)}>
		{children}
	</Link>
);

export default function Header() {
	const [token, setToken] = useAtom(authToken);
	const pathname = usePathname();

	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		setInterval(() => {
			setLoading(false);
		}, 800);
	});

	// logput handler
	const logoutHandler = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) => {
		setToken({ token: '' });
		redirect('/');
	};

	return !loading ? (
		<header className='w-full py-4 bg-zinc-50 dark:bg-zinc-900 fixed z-[9999]'>
			<div className='container mx-auto md:px-10 xl:px-10 sm:px-10 px-8'>
				{token.token !== '' ? (
					<>
						<nav className='w-full flex flex-row justify-between items-center'>
							<Link href={'/'} className='font-black italic uppercase'>
								Numismatic AI
							</Link>
							<ul className='flex flex-row items-center'>
								<li>
									<NaviagationLink
										link='/prediction'
										active={pathname === '/prediction'}>
										Prediction
									</NaviagationLink>
								</li>

								<li>
									<NaviagationLink
										link='/profile'
										active={pathname === '/profile'}
										className='inline-block'>
										Profile
									</NaviagationLink>
								</li>

								<li>
									<button
										className='inline-block ml-4 font-bold text-lg'
										onClick={logoutHandler}>
										<RiLogoutBoxRLine title='logout' />
									</button>
								</li>
								{/* <li>
									<button
										onClick={() => {}}
										className='flex items-center ml-4 font-black text-lg dark:text-white text-slate-900'>
										{true ? <CiLight /> : <MdDarkMode />}
									</button>
								</li> */}
							</ul>
						</nav>
					</>
				) : (
					<>
						<nav className='w-full flex flex-row justify-between items-center'>
							<Link href={'/'} className='font-black italic uppercase'>
								Numismatic AI
							</Link>

							<ul className='flex flex-row items-center'>
								<li>
									<NaviagationLink link='/login'>Login</NaviagationLink>
								</li>
								<li>
									<NaviagationLink link='/signup'>Signup</NaviagationLink>
								</li>
								{/* <li>
									<button
										onClick={() => {
											setToken({
												token: 'kjahsdkjhasl,mjiqgwlkndh jahsjkhdgkjashd',
											});
										}}
										className='flex items-center ml-4 font-black text-lg dark:text-white text-slate-900'>
										{true ? <CiLight /> : <MdDarkMode />}
									</button>
								</li> */}
							</ul>
						</nav>
					</>
				)}
			</div>
		</header>
	) : (
		''
	);
}
