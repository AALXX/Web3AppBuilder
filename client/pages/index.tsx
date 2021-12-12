import React from 'react';
import dynamic from 'next/dynamic';

const LazyComponent = dynamic(
    () => import('../Components/EditingUi/EditWebsiteUi'),
    {
        loading: () => <p>Loading...</p>,
    },
);

/**
 * This is Home Page
 * @return {JSX.Element}
 */
export default function Home() {
    return (
        <div>
            <LazyComponent />
        </div>
    );
}
