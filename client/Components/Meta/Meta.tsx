import Head from 'next/head';
import React from 'react';

interface Props {
  title: string
  keywords: string
  description: string
}

const Meta = (props: Props) => {
    return (
        <Head>
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
            />
            <meta name="keywords" content={props.keywords} />
            <meta name='description' content={props.description} />
            <meta charSet="utf-8" />
            <link rel="icon" href="/favicon.ico" />
            <title>{props.title}</title>
        </Head>
    );
};

Meta.defaultProps = {
    title: 'W3WB',
    keywords: 'Web3, nocode, metaverse',
    description: 'a no code website builder for web 3',
};

export default Meta;
