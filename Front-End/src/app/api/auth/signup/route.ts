/** @format */

import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
	const api_route = process.env.API_HOST;
	const headers = new Headers();

	// set content type
	headers.append('Content-Type', 'application/json');
	try {
		const data = await req.json();
		const res = await fetch(`${api_route}/auth/signup`, {
			method: 'POST',
			headers: headers,
			body: JSON.stringify({
				email: data.email,
				password: data.password,
			}),
		});
		if (res.status == 410) {
			return Response.json({
				status: res.status,
				data: { msg: 'Email already exists' },
			});
		}
		if (res.status == 200) {
			const responseObject = await res.json();
			return Response.json({
				status: res.status,
				data: {
					msg: responseObject.msg,
				},
			});
		}
		return Response.json({
			status: res.status,
			data: {
				msg: 'Server error!',
			},
		});
	} catch (err) {
		return Response.json({
			status: 500,
			data: { msg: 'Internal server error' },
		});
	}
}
