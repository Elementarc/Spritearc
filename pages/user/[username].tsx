import React, {useState, useEffect} from 'react';
import Image from "next/image"
import Link from "next/link"
import { Public_user, Server_response,Server_response_pack, Server_response_public_user } from '../../types';
import Footer from '../../components/footer';
import { useParallax } from '../../lib/custom_hooks';
import { Nav_shadow } from '../../components/navigation';
import Packs_section from '../../components/packs_section';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Fixed_app_content_overlay from '../../components/fixed_app_content_overlay';
import Profile_socials_background from "../../public/images/profile_socials_background.svg"
import Twitter_logo from "../../public/logos/twitter_logo.svg"
import Artstation_logo from "../../public/logos/artstation_logo.svg"
import { GetServerSideProps } from 'next'
import http from "http"
import https from "https"



export default function Profile_page(props: {public_user: Public_user}) {
    const public_user = props.public_user
    useParallax("profile_banner")
    
    return (
        <>
            <Head>
				<title>{`${public_user.username}`}</title>
				<meta property="description" content={`${public_user.description}`}/>
                <meta property="og:url" content={`https://Spritearc.com/user/${public_user.username}`}/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content={`${public_user.username}`}/>
				<meta property="og:description" content={`${public_user.description}`}/>
				<meta property="og:image" content={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/profile_pictures/${public_user.profile_picture}`}/>
				<meta property="og:image:secure_url" content={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/profile_pictures/${public_user.profile_picture}`}/>

				<meta property="twitter:card" content="summary"/>
				<meta property="twitter:domain" content="Spritearc.com"/>
				<meta property="twitter:url" content={`https://Spritearc.com/user/${public_user.username}`}/>
				<meta property="twitter:title" content={`${public_user.username}`}/>
				<meta property="twitter:description" content={`${public_user.description}`}/>
                <meta property="twitter:image" content={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/profile_pictures/${public_user.profile_picture}`}/>
            </Head>
       
            <div className='profile_page'>

                <div className='content'>
                    <Nav_shadow/>

                    <Fixed_app_content_overlay>
                        <div className='fixed_profile_container'>
                            {(public_user?.socials?.artstation.length > 0 || public_user?.socials?.instagram.length > 0 || public_user?.socials?.twitter.length > 0) &&
                            
                                <div className='socials_container'>
                                    
                                    <div className='socials'>
                                        <div className='background_wrapper'>
                                            <Profile_socials_background/>
                                        </div>
                                        
                                        {public_user?.socials?.instagram.length > 0 &&
                                            <a href={`https://www.instagram.com/${public_user.socials.instagram}`} target="_blank" rel='noreferrer' className='logo_container'>
                                                <Image src={"/logos/instagram_color.png"} layout={"fill"}></Image>
                                            </a>
                                        }
                                        {public_user?.socials?.twitter.length > 0 &&
                                            <a href={`https://www.twitter.com/${public_user.socials.twitter}`} target="_blank" rel='noreferrer' className='logo_container'>
                                                <Twitter_logo/>
                                            </a>
                                        }

                                        {public_user?.socials?.artstation.length > 0 &&
                                            
                                            <a href={`https://www.artstation.com/${public_user.socials.artstation}`} target="_blank" rel='noreferrer' className='logo_container'>
                                                <Image src={"/logos/artstation_color.png"} layout={"fill"}></Image>
                                            </a>
                                        }
                                    </div>
                                </div>

                            }
                        </div>
                    </Fixed_app_content_overlay>
                    

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
                                <Link href={`/profile?user=${public_user.username}`} scroll={false}>{`${public_user?.username}`}</Link>
                                <p>{`${public_user?.description}`}</p>
                            </div>
                        </div>



                    </div>
                    
                    <div className='user_packs_container'>
                        <Packs_section section_name={`Packs created by '${public_user?.username}'`} api={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user_packs`} method='POST' body={{username: public_user?.username}}/>
                    </div>

                </div>
                <Footer/>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {

    try {
        const agent = process.env.NEXT_PUBLIC_ENV === "development" ? new http.Agent() : new https.Agent({
            rejectUnauthorized: false
        })
        const username = context?.params?.username
        if(!username) throw new Error("No user param")

        const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/get_public_user?user=${username}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            // @ts-ignore: Unreachable code error
            agent
        })

        const response_obj = await response.json() as Server_response_public_user

    
        if(!response_obj.success) return {redirect: {destination: "/browse", permanent: false}} 
    
        return {
            props: {
                public_user: response_obj.public_user
            }
        }
        
    } catch (err) {
        return {redirect: {destination: "/browse", permanent: false}} 
    }
}






