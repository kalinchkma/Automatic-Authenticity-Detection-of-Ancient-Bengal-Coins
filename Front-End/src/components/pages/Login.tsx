/** @format */

'use client';
import { cn } from '@/utils/utils';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import { redirect } from 'next/navigation';
import { useAtom } from 'jotai';

import { authToken } from '@/store/store';
import PageLoading from '../common/PageLoading';

enum FormState {
	submitted = 'submitted',
	success = 'success',
	error = 'error',
	default = 'default',
}

export default function Login() {
	// auth state
	const [auth, setAuth] = useAtom(authToken);

	// form state
	const [formState, setFormState] = useState<FormState>(FormState.default);

	// input state
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [showPass, setShowPass] = useState<boolean>(false);

	useEffect(() => {
		if (auth.token !== '') {
			redirect('/');
		}
	}, [auth]);

	// form response state
	const [responseMessage, setResponseMessage] = useState<string>('');

	// login submit handler
	const loginHandler = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (email != '' && password != '') {
			setFormState(FormState.submitted);
			try {
				const requestObject = {
					username: email,
					password: password,
				};
				const headers = new Headers();
				headers.append('Content-Type', 'application/json');
				const res = await fetch('/api/auth/login', {
					method: 'POST',
					headers: headers,
					body: JSON.stringify(requestObject),
				});

				const responseObject = await res.json();
				console.log(responseObject);
				if (responseObject.status === 200) {
					// login success redirect to profile page and save the token
					setFormState(FormState.success);
					setAuth({ token: responseObject.data.access_token });
				} else {
					setFormState(FormState.error);
					setResponseMessage(responseObject.msg);
				}
			} catch (err) {
				setFormState(FormState.error);
				setResponseMessage('Client error!');
				console.log(err);
			}
		}
	};

	return (
		<section className='w-full h-[100vh] bg-slate-100'>
			<div className='container mx-auto h-[100%] flex items-center justify-center'>
				<div className='w-[400px] bg-white px-7 py-8 rounded-md flex flex-col'>
					{/* page header */}
					<div className='flex flex-col items-center justify-center mb-4 py-3 '>
						<h1 className='text-2xl font-bold dark:text-gray-800'>Login</h1>
					</div>
					<form onSubmit={loginHandler}>
						{responseMessage && formState === FormState.error && (
							<h3 className='text-center py-2 w-full bg-red-200 mb-1'>
								{responseMessage}
							</h3>
						)}
						<div className='w-full flex flex-col items-start justify-center mb-3'>
							<input
								type='email'
								id='email'
								className={cn(
									'w-full px-3 py-2 border rounded-lg outline-none',
									formState === FormState.error
										? 'border-red-500 hover:border-red-700'
										: 'border-zinc-500 hover:border-zinc-700',
								)}
								placeholder='Email'
								value={email}
								onChange={(e) => {
									setEmail(e.target.value);
									setFormState(FormState.default);
								}}
							/>
						</div>
						<div className='w-full flex flex-col items-start justify-center mb-3 relative'>
							<input
								type={showPass ? 'text' : 'password'}
								id='password'
								className={cn(
									'w-full px-3 py-2 border rounded-lg outline-none',
									formState === FormState.error
										? 'border-red-500 hover:border-red-700'
										: 'border-zinc-500 hover:border-zinc-700',
								)}
								placeholder='Password'
								value={password}
								onChange={(e) => {
									setPassword(e.target.value);
									setFormState(FormState.default);
								}}
							/>
							<button
								type='button'
								className='absolute right-0 top-0 h-full w-auto p-2'
								onClick={(e) => setShowPass(!showPass)}>
								{showPass ? <FaEyeSlash /> : <FaEye />}
							</button>
						</div>

						<div className='w-full flex flex-col items-start justify-center mb-3 '>
							<button
								type='submit'
								className='w-full py-2 text-lg bg-blue-700 text-white font-bold rounded-2xl'>
								Login
							</button>

							{formState === FormState.submitted && (
								<div className=' animate-spin h-[20px] w-[20px] mx-auto mt-2 rounded-full border-2 border-gray-400 border-b-gray-800'></div>
							)}
						</div>
						<div className='w-full flex flex-col items-center justify-center mb-3 '>
							<p className='dark:text-gray-800'>
								Don't have an account?
								<Link href={'/signup'} className='text-blue-500'>
									Signup
								</Link>
							</p>
						</div>
					</form>
				</div>
			</div>
		</section>
	);
}
