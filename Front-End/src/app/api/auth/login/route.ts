/** @format */
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
	try {
		const data = await req.json();
		const headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded');
		const formDara = new URLSearchParams();
		formDara.append('username', data.username);
		formDara.append('password', data.password);
		const res = await fetch(`${process.env.API_HOST}/auth/token`, {
			method: 'POST',
			headers: headers,
			body: formDara,
		});
		const responseObject = await res.json();

		if (res.status === 200) {
			return Response.json({
				status: 200,
				msg: 'Login success',
				data: responseObject,
			});
		}
		return Response.json({
			status: 400,
			msg: 'Login failed! Invalid email & password',
			data: await req.json(),
		});
	} catch (err) {
		return Response.json({
			status: 500,
			msg: `'Login failed! Invalid email & password'`,
		});
	}
}
