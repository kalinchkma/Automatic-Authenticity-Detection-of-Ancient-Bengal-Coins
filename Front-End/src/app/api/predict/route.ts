/** @format */

import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
	const path = `${process.env.API_HOST}/ai/predict`;
	try {
		const data = await req.formData();
		let body = Object.fromEntries(data);

		const formData = new FormData();
		formData.append('file', body.file);

		const res = await fetch(path, {
			method: 'POST',
			body: formData,
		});

		const responseObject = await res.json();

		return Response.json({
			status: res.status,
			msg: responseObject,
		});
	} catch (err) {
		return Response.json({
			status: 500,
			msg: `Server Error! ${err}`,
		});
	}
}
