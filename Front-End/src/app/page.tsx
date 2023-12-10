/** @format */
/**
 * Name: Default Page
 * Description: This page is public pag, who don't have an account
 */

'use client';

import PageLoading from '@/components/common/PageLoading';
import Guest from '@/components/pages/Guest';
import { authToken } from '@/store/store';
import { useAtom } from 'jotai';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

export default function GuestPage() {
	const [auth, _] = useAtom(authToken);
	const [loading, setLoading] = useState<boolean>(true);

	const pathname = usePathname();

	useEffect(() => {
		setTimeout(() => {
			setLoading(false);
		}, 800);
	}, []);

	return loading ? (
		<PageLoading />
	) : (
		<main>
			<Guest />
		</main>
	);
}
