import React from 'react';
import Image from 'next/image';

export default function SpriteCredits({credits}: {credits: number | null}) {

    return (
        <div className='sprite_credits_container'>

            <div className='sprite_credits_icon_container'>
                <Image loading='lazy' unoptimized={true} src={"/images/sprite-coin.gif"} layout="fill"></Image>
            </div>
            <p className='small'>{credits ?? `0`}</p>
            
        </div>
    );
}