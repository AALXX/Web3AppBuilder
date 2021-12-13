import '../styles/globals.css';
import { AppProps } from 'next/app';
import React from 'react';
import Layout from '../Layout/Layout';

/**
* App Wraper
* @return {JSX.Element}
*/
export default function W3AB({ Component, pageProps }: AppProps) {
    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
}
