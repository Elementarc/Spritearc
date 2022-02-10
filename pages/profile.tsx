import React, {useState, useEffect} from 'react';
import Image from "next/image"
import Link from "next/link"
import { Public_user } from '../types';
import Footer from '../components/footer';
import { useParallax } from '../lib/custom_hooks';
import { Nav_shadow } from '../components/navigation';
import Packs_section from '../components/packs_section';
import Head from 'next/head';
import { useRouter } from 'next/router';


export default function Profile_page_handler() {
    const [public_user, set_public_user] = useState<null | Public_user>(null)
    const router = useRouter()

    useEffect(() => {
        const controller = new AbortController()

        async function get_pack() {
            if(!router.query.user) return
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/get_public_user?user=${router.query.user}`, {
                    method: "POST",
                    signal: controller.signal,
                    headers: {
                        "Content-Type": "application/json"
                    }
                })

                if(response.status === 200) {
                    const public_user_obj = await response.json() as Public_user // JSON PACK
                    set_public_user(public_user_obj)
                    
                } else {
                    //router.push("/browse", "/browse", {scroll: false})
                }

            } catch(err) {
                //Couldnt reach server
                //router.push("/browse", "/browse", {scroll: false})
            }
        }
        get_pack()
        return(() => {
            controller.abort()
        })
        
    }, [router])

    return (
        <div>
            {public_user &&
                <Profile_page public_user={public_user}/>
            }
        </div>
    );
}

function Profile_page(props: {public_user: Public_user}) {
    const public_user = props.public_user
    useParallax("profile_banner")
    
    
    return (
        <>
            <Head>
				<title>{`${public_user.username}`}</title>
				<meta name="description" content={`${public_user.description}`}/>

				<meta property="og:url" content="https://Spritearc.com/"/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content={`${public_user.username}`}/>
				<meta property="og:description" content={`${public_user.description}`}/>
				<meta property="og:image" content={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/profile_pictures/${public_user.profile_picture}`}/>

				<meta name="twitter:card" content="summary_large_image"/>
				<meta property="twitter:domain" content="Spritearc.com"/>
				<meta property="twitter:url" content="https://Spritearc.com/"/>
				<meta name="twitter:title" content={`${public_user.username}`}/>
				<meta name="twitter:description" content={`${public_user.description}`}/>
				<meta name="twitter:image:src" content={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/profile_pictures/${public_user.profile_picture}`}/>
            </Head>
       
            <div className='profile_page'>

                <div className='content'>
                    <Nav_shadow/>
                    <div className='user_preview_container'>

                        <div className='image_container'>
                            <Image priority={true} id="profile_banner" src={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/profile_banners/${public_user.profile_banner}`} alt={`Profile banner for the user ${public_user.username}`} layout='fill'></Image>
                            <div className='blur' />

                            
                        </div>
                        
                        <div className='header'>

                            <div className='user_portrait_container'>

                                <div className='portrait'>
                                    
                                    <Image priority={true} src={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/profile_pictures/${public_user.profile_picture}`} alt={`Profile banner for the user ${public_user.username}`} layout='fill'></Image>

                                </div>

                            </div>

                            <div className='user_info_container'>
                                <Link href={`/profile?user=${public_user.username}`} scroll={false}>{`${public_user.username}`}</Link>
                                <p>{`${public_user.description}`}</p>
                            </div>
                        </div>



                    </div>
                    
                    <div className='user_packs_container'>
                        <Packs_section section_name={`Packs created by '${public_user.username}'`} api={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user_packs`} method='POST' body={{username: public_user.username}}/>
                    </div>

                </div>
                <Footer/>
            </div>
        </>
    );
}






