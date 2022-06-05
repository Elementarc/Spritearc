import React from 'react';
import Image from 'next/image';

export default function PackAsset(props: {image: string, packId: string, username: string}) {
    const image = props.image
    const packId = props.packId
    return(
        <div key={`${image}`} className="pack_asset">
            <Image loading='lazy' unoptimized={true} src={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/packs/${props.username.toLowerCase()}_${packId}/${image}`}  quality="100%" layout="fill"  alt={`Representing one asset from this pack`}  className="patch_preview_image"/>
        </div>
    )
    
}
