/** @format */

import React from 'react';

export default function PageLoading() {
	return (
		<div className='h-[100vh] w-[100vw] flex items-center justify-center bg-white dark:bg-zinc-900'>
			<div className='h-[70px] w-[70px] rounded-full animate-spin'>
				<img src='/spin.png' />
			</div>
		</div>
	);
}
