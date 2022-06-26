import React from 'react';
import { PublicUser } from '../types';
import Image from 'next/image';
import ProfileBox, { ProfilePicture } from './profileBox';
import { useRouting } from '../lib/custom_hooks';
import useGetPublicUser from '../hooks/useGetPublicUser';

export default function TipCreator({publicUser}: {publicUser: PublicUser | null}) {
    const {push} = useRouting()
    if(!publicUser) return null
    return (
        <div className='tip_creator_container'>
            <div className='creator_banner'>
                <Image unoptimized={true} layout="fill" src={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/profile_banners/${publicUser.profile_banner}`}></Image>
            </div>

            <div className='portrait_wrapper'>
                <ProfilePicture imageLink={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/profile_pictures/${publicUser.profile_picture}`}/>
            </div>
            <a onClick={() => push(`/user/${publicUser.username.toLowerCase()}`)} className='default primary'>{publicUser.username}</a>
            <p className='default'>
                {`'${publicUser.username}' would greatly appreciate your donation and it would help to create more cool things! If you wish to show your appreciation, make sure to let the creators know. Tipping is completly voluntarily and not mandatory. Keep in mind that tips cannot be refunded!`}
            </p>
        </div>
    );
}
