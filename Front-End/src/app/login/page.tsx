/** @format */
/**
 * Name: Login page
 * Description: This page use for user login
 */
'use client';

import React, { useEffect, useState } from 'react';
import { authToken } from '@/store/store';
import { useAtom } from 'jotai';

import Login from '@/components/pages/Login';
import PageLoading from '@/components/common/PageLoading';
import { redirect } from 'next/navigation';
import Notfound from '@/components/common/NotFound';

export default function LoginPage() {
	const [auth, _] = useAtom(authToken);
	const [loading, setLoading] = useState<boolean>(true);
	const [unAuth, setUnAuth] = useState<boolean>(false);

	useEffect(() => {
		if (auth.token !== '') {
			setUnAuth(true);
		}
		if (auth.token === '') {
			setUnAuth(false);
		}
	}, [auth]);

	useEffect(() => {
		setTimeout(() => {
			setLoading(false);
		}, 500);
	}, []);

	return loading ? (
		<PageLoading />
	) : (
		<main>{unAuth ? <Notfound /> : <Login />}</main>
	);
}
