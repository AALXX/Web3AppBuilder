import '../styles/globals.css';
import {AppProps} from 'next/app';
import React from 'react';

/**
* App Wraper
* @return {JSX.Element}
*/
export default function W3AB({Component, pageProps}: AppProps) {
    return <Component {...pageProps} />;
}
