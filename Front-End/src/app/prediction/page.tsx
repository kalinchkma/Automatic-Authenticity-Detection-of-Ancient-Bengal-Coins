/** @format */
/**
 * Name: Prediction page
 * Description: This page use for predicting from image
 */
'use client';

import React, { useEffect, useState } from 'react';

import Prediction from '@/components/pages/Prediction';
import { authToken } from '@/store/store';
import { useAtom } from 'jotai';
import { redirect } from 'next/navigation';
import PageLoading from '@/components/common/PageLoading';
import Notfound from '@/components/common/NotFound';

export default function PredictionPage() {
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
			if (auth.token === '') {
				redirect('/login');
			}
		}, 800);
	}, []);

	return loading ? (
		<PageLoading />
	) : (
		<main>{unAuth ? <Notfound /> : <Prediction />}</main>
	);
}
