import React from 'react';
import Image from 'next/image';

export default function Sprite_credits(props: {credits: string | number}) {

    return (
        <div className='sprite_credits_container'>
            <div className='sprite_credits_icon_container'>
                <Image src={"/images/sprite-coin.gif"} layout="fill"></Image>
            </div>
            <p>{props.credits}</p>
        </div>
    );
}
