import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Qick_legal_navigation() {
    const router = useRouter()
    const pathname = router.pathname.toLowerCase()

    return (
        <>
            <div className='legal_navigation_container'>
                <h1>Quick Legal Navigation: </h1>
                <ul>
                        
                    <li>
                        <Link href={`/tos`} scroll={false}>Terms Of Service</Link>
                    </li>
                    
                        
                    <li>
                        <Link href={`/privacy`} scroll={false}>Privacy Policy</Link>
                    </li>
                    
                        
                    <li>
                        <Link href={`/cookies`} scroll={false}>Cookies</Link>
                    </li>

                        
                    <li>
                        <Link href={`/guidelines`} scroll={false}>Guidelines</Link>
                    </li>

                    <li>
                        <Link href={`/contact`} scroll={false}>Contact</Link>
                    </li>
                    
                </ul>
            </div>
        </>
    );
}