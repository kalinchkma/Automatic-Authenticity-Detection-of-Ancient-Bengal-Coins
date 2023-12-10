/** @format */
/**
 * Name: Root layout
 * Description: This file serves as a root layout of the website
 */

import type { Metadata } from 'next';

import '@/styles/globals.css';

import ThemeProvider from './ThemeProvider';

export const metadata: Metadata = {
	title: 'Numismatic with AI',
	description: 'This application generated by a group of researcher',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <ThemeProvider>{children}</ThemeProvider>;
}