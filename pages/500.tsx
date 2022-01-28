import { useRouter } from 'next/router';
import React from 'react';
import Footer from '../components/footer';

export default function Error_404() {
    const router = useRouter()
    return (
        <div className='error_page'>

            <div className='content'>
                <h1>We had issues delivering this page</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et lectus eu tincidunt faucibus. Vel venenatis eget euismod nulla ut. eget euismod nulla ut. eget euismod nulla ut. eget euismod nulla ut.</p>
                <button onClick={() => {router.push("/", "/", {scroll: false})}}>Back to Safety</button>
            </div>
            <Footer />
        </div>
    );
}
