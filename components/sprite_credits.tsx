import React from 'react';
import Image from 'next/image';
import Loading from './loading';

export default function Sprite_credits(props: {credits: string | number | null | undefined}) {
    const sprite_credits = props.credits
    return (
        <div className='sprite_credits_container'>
            {!sprite_credits &&
                <Loading loading={true} main_color={true} scale={.8}/>
            }

            {sprite_credits &&
                <>
                    <div className='sprite_credits_icon_container'>
                        <Image src={"/images/sprite-coin.gif"} layout="fill"></Image>
                    </div>
                    <p>{sprite_credits}</p>
                </>
            }
            
        </div>
    );
}
