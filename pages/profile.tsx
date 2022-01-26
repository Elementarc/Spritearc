import React from 'react';
import { GetServerSideProps } from 'next';
import Image from "next/image"
import Link from "next/link"
import { Public_user } from '../types';
import Footer from '../components/footer';
import { useParallax } from '../lib/custom_hooks';
import { Nav_shadow } from '../components/navigation';
import Packs_section from '../components/packs_section';

export default function Profile(props: {public_user: any}) {
    const public_user = JSON.parse(props.public_user) as Public_user
    useParallax("profile_banner")
    
    
    return (
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
                    <Packs_section section_name={`Packs created by '${public_user.username}'`} api={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user_packs`} method='POST' body={public_user.released_packs}/>
                </div>

            </div>
            <Footer/>
        </div>
    );
}






export const getServerSideProps: GetServerSideProps = async (context) => {
    const redirect = {redirect: {
        permanent: false,
        destination: "/browse"
    }}
    const username = context.query.user
    
    if(!username) return redirect
    if(typeof username !== "string") return redirect
    //user query exist and is type of string
    
    try {

        const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/get_public_user?user=${context.query.user}`, {
            method: "POST",
            credentials: "include"
        })
        
        if(response.status === 200) {
            const user = await response.json()
            console.log(user)
            if(!user) return redirect

            return {
                props: {
                    public_user: JSON.stringify(user),
                }
            }

        } else {
            return redirect
        }
        
    } catch( err ) {

        return redirect

    }
    
    
    //User was found in the databse
    
    
    
    
    
}
