import React from 'react';
import Image from 'next/image';
import Loading from './loading';
import useGetUserCredits from '../hooks/useGetUserCredits';

export default function Sprite_credits() {
    const credits = useGetUserCredits()

    return (
        <div className='sprite_credits_container'>
            {!credits &&
                <Loading loading={true} main_color={true} scale={.8}/>
            }

            {credits &&
                <>
                    <div className='sprite_credits_icon_container'>
                        <Image loading='lazy' unoptimized={true} src={"/images/sprite-coin.gif"} layout="fill"></Image>
                    </div>
                    <p>{credits}</p>
                </>
            }
            
        </div>
    );
}
