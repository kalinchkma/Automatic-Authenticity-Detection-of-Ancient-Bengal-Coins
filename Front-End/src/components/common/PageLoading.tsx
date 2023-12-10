/** @format */

import React from 'react';

export default function PageLoading() {
	return (
		<div className='h-[100vh] w-[100vw] flex items-center justify-center bg-white dark:bg-zinc-900'>
			<div className='h-[50px] w-[50px] border-2 border-slate-200 border-t-zinc-900 rounded-full animate-spin'></div>
		</div>
	);
}
