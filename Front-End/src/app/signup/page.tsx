/** @format */
/**
 * Name: Registration page
 * Description: This page use for user registration
 */
'use client';
import React, { useEffect, useState } from 'react';

import { redirect } from 'next/navigation';

import Signup from '@/components/pages/Signup';
import { authToken } from '@/store/store';
import { useAtom } from 'jotai';
import PageLoading from '@/components/common/PageLoading';
import Notfound from '@/components/common/NotFound';

export default function SignupPage() {
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
		}, 800);
	}, []);

	return loading ? (
		<PageLoading />
	) : (
		<main>{unAuth ? <Notfound /> : <Signup />}</main>
	);
}
