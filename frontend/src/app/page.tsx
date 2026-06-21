
import dynamic from 'next/dynamic';
import React from 'react';

const AppShell = dynamic(
	() => import('../components/layout/AppShell'),
	{ ssr: true }
);

export default function Page() {
	return <AppShell />;
}
