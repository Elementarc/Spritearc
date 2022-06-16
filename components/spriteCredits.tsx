import React from 'react';
import Image from 'next/image';
import Loading from './loading';
import useGetUserCredits from '../hooks/useGetUserCredits';

export default function SpriteCredits() {
    const credits = useGetUserCredits()

    return (
        <div className='sprite_credits_container'>

            <div className='sprite_credits_icon_container'>
                <Image loading='lazy' unoptimized={true} src={"/images/sprite-coin.gif"} layout="fill"></Image>
            </div>
            <p className='small'>{credits ?? `0`}</p>
            
        </div>
    );
}