import React, {useEffect, useState} from 'react';
import { GetServerSideProps } from 'next';
import Image from "next/image"
import Link from "next/link"
import { Pack_info, Public_user } from '../types';
import Footer from '../components/footer';
import { get_released_packs_by_user } from '../lib/mongo_lib';
import Packs_section from '../components/packs_section';
import { useParallax } from '../lib/custom_hooks';

export default function Profile(props: {public_user: any, user_packs: any}) {
    const public_user = JSON.parse(props.public_user) as Public_user
    const user_packs = JSON.parse(props.user_packs) as Pack_info[]
    useParallax("profile_banner")
    
    return (
        <div className='profile_page'>

            <div className='content'>

                <div className='user_preview_container'>

                    <div className='image_container'>
                        <Image priority={true} id="profile_banner" src={`/profile_banners/${public_user.profile_banner}`} alt={`Profile banner for the user ${public_user.username}`} layout='fill'></Image>
                        <div className='blur' />

                        
                    </div>
                    
                    <div className='header'>

                        <div className='user_portrait_container'>

                            <div className='portrait'>
                                
                                <Image priority={true} src={`/profile_pictures/${public_user.profile_picture}`} alt={`Profile banner for the user ${public_user.username}`} layout='fill'></Image>

                            </div>

                        </div>

                        <div className='user_info_container'>
                            <Link href={`/profile?user=${public_user.username}`} scroll={false}>{`${public_user.username}`}</Link>
                            <p>{`${public_user.description}`}</p>
                        </div>
                    </div>



                </div>
                
                <div className='user_packs_container'>
                    <Packs_section header={`Packs created by '${public_user.username}'`} packs={user_packs}/>
                </div>

            </div>
            <Footer/>
        </div>
    );
}




import { get_public_user } from '../lib/mongo_lib';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const redirect = {redirect: {
        permanent: false,
        destination: "/browse"
    }}
    const username = context.query.user
    
    if(!username) return redirect
    if(typeof username !== "string") return redirect
    //user query exist and is type of string
    
    const user = await get_public_user(username)
    if(!user) return redirect
    //User was found in the databse
    
    const user_packs = await get_released_packs_by_user(user.released_packs)
    
    return {
        props: {
            public_user: JSON.stringify(user),
            user_packs: JSON.stringify(user_packs)
        }
    }
    
}
