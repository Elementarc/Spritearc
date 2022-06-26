import React from 'react';
import Image from 'next/image';
import ThrashIcon from "../public/icons/ThrashIcon.svg"

export default function PackAsset(props: {src: string, onClick?: (e: any) => void, editable?: boolean}) {
    const onClick = props.onClick
    return(
        <div key={`${props.src}`} className="pack_asset">
            <Image loading='lazy' unoptimized={true} src={props.src} quality="100%" layout="fill"  alt={`Representing one asset from this pack`}  className="patch_preview_image"/>
        
            {props.editable &&
                <div onClick={(e) => {if(onClick) onClick(e)}} className='delete_asset_container'>
                    <ThrashIcon/>
                </div>
            }
        </div>
    )
    
}
