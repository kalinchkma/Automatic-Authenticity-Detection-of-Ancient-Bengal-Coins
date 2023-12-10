/** @format */
/**
 * Name: Registraction
 * Description: This file provide UI for registraction page
 */
'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { cn } from '@/utils/utils';

import { FaEyeSlash, FaEye } from 'react-icons/fa';

interface SignupResponse {
	status: Number;
	data: {
		msg: string;
	};
}

enum FormState {
	submited = 'submited',
	responsed = 'responsed',
	default = 'default',
	success = 'success',
}

export default function Signup() {
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [confirmPassword, setConfirmPassword] = useState<string>('');
	const [passError, setPassError] = useState<boolean>(false);
	const [showPass, setShowPass] = useState<boolean>(false);
	const [signupError, setSignupError] = useState<boolean>(false);
	const [formState, setFromState] = useState<FormState>(FormState.default);
	const [responseMessage, setResponseMessage] = useState<String | null>(null);
	// check password match
	const checkPassword = (p1: string, p2: string) => {
		return p1 === p2;
	};

	// signup submit handler
	const submitHander = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const requestObject = {
			email,
			password,
		};
		if (
			email != '' &&
			password != '' &&
			checkPassword(password, confirmPassword)
		) {
			try {
				setFromState(FormState.submited);
				const headers = new Headers();
				headers.append('Content-Type', 'application/json');
				const res = await fetch('/api/auth/signup', {
					method: 'POST',
					headers: headers,
					body: JSON.stringify(requestObject),
				});

				const responseObject = (await res.json()) as SignupResponse;
				setFromState(FormState.responsed);
				if (responseObject.status == 200) {
					setSignupError(false);
					setResponseMessage(responseObject.data.msg);
					setEmail('');
					setPassword('');
					setConfirmPassword('');
					setFromState(FormState.success);
				} else {
					setSignupError(true);
					setResponseMessage(responseObject.data.msg);
				}
			} catch (err) {
				setSignupError(true);
				setResponseMessage('Client errors!');
			}
		}
	};

	return (
		<section className='w-full h-[100vh] bg-slate-100'>
			<div className='container mx-auto h-[100%] flex items-center justify-center'>
				{!(formState === FormState.success) ? (
					<div className='w-[400px] bg-white px-7 py-8 rounded-md flex flex-col'>
						{/* page header */}
						<div className='flex items-center justify-center mb-4 py-3'>
							<h1 className='text-2xl font-bold dark:text-gray-800'>Signup</h1>
						</div>
						<form onSubmit={submitHander}>
							<div className='w-full flex flex-col items-start justify-center mb-3'>
								<input
									type='email'
									id='email'
									className={cn(
										'w-full px-3 py-2 border  rounded-lg outline-none',
										signupError
											? 'border-red-500 hover:border-red-700'
											: 'border-zinc-500 hover:border-zinc-700',
									)}
									placeholder='Email'
									value={email}
									onChange={(e) => {
										setFromState(FormState.default);
										setEmail(e.target.value);
										setSignupError(false);
									}}
								/>
								{formState === FormState.responsed && signupError && (
									<p
										className={cn(
											'text-center w-full text-sm font-normal',
											'bg-red-200',
										)}>
										{responseMessage}
									</p>
								)}
							</div>
							<div className='w-full flex flex-col items-start justify-center mb-3'>
								<input
									type='password'
									id='password'
									className={cn(
										'w-full px-3 py-2 border border-zinc-500 hover:border-zinc-700  rounded-lg outline-none',
									)}
									placeholder='Create password'
									value={password}
									onChange={(e) => {
										setFromState(FormState.default);
										setPassword(e.target.value);
										setSignupError(false);
									}}
								/>
							</div>
							<div className='w-full flex flex-col items-start justify-center mb-3 relative '>
								<input
									type={showPass ? 'text' : 'password'}
									id='confirm-password'
									className={cn(
										'w-full px-3 py-2 border  rounded-lg outline-none',
										passError
											? 'border-red-600'
											: ' border-zinc-500 hover:border-zinc-700',
									)}
									placeholder='Confirm password'
									value={confirmPassword}
									onChange={(e) => {
										setConfirmPassword(e.target.value);
										setFromState(FormState.default);
										setSignupError(false);
										if (!checkPassword(e.target.value, password)) {
											setPassError(true);
										} else {
											setPassError(false);
										}
									}}
								/>
								<button
									type='button'
									className='absolute right-0 top-0 h-full w-auto p-2'
									onClick={(e) => setShowPass(!showPass)}>
									{showPass ? <FaEyeSlash /> : <FaEye />}
								</button>
							</div>
							<div className='w-full flex items-start justify-center mb-3 flex-col '>
								<button
									type='submit'
									className='w-full py-2 text-lg bg-blue-700 text-white font-bold rounded-2xl'>
									Signup
								</button>
								{formState === FormState.submited && (
									<div className=' animate-spin h-[20px] w-[20px] mx-auto mt-2 rounded-full border-2 border-gray-400 border-b-gray-800'></div>
								)}
							</div>
							<div className='w-full flex flex-col items-center justify-center mb-3 '>
								<p className='dark:text-gray-800'>
									Already have an account?
									<Link href={'/login'} className='text-blue-500'>
										Login
									</Link>
								</p>
							</div>
						</form>
					</div>
				) : (
					<div className='w-[70%] mx-auto py-3 px-4 bg-white'>
						<h4
							className={cn(
								'text-center w-full p-2 rounded-lg text-xl font-normal',
							)}>
							{responseMessage}
						</h4>
					</div>
				)}
			</div>
		</section>
	);
}
