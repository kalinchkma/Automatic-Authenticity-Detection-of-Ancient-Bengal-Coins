/** @format */
/**
 * Name: Profile page
 * Description: This page use for show login user information page
 */
'use client';
import React, { useEffect, useState } from 'react';

import Profile from '@/components/pages/Profile';
import { useAtom } from 'jotai';
import { authToken } from '@/store/store';
import { redirect } from 'next/navigation';
import PageLoading from '@/components/common/PageLoading';
import Notfound from '@/components/common/NotFound';

export default function ProfilePage() {
	const [auth, _] = useAtom(authToken);
	const [loading, setLoading] = useState<boolean>(true);
	const [unAuth, setUnAuth] = useState<boolean>(false);

	useEffect(() => {
		if (auth.token === '') {
			setUnAuth(true);
		}
		if (auth.token !== '') {
			setUnAuth(false);
		}
	}, [auth]);

	useEffect(() => {
		setTimeout(() => {
			setLoading(false);
		}, 800);
	}, []);

	return loading ? (
		<PageLoading />
	) : (
		<main>{unAuth ? <Notfound /> : <Profile />}</main>
	);
}
