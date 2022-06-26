import React from 'react';
import { Pack } from '../types';
import PackAsset from './packAsset';

export default function PackAssetsSection(props: {pack: Pack, images: string[]}) {
    const imageUrls = props.images
    const packId = props.pack._id.toString()
    const username = props.pack.username
    
    function createAssetSection() {
        const assetsJsx = imageUrls.map((image) => {
            return (
                <PackAsset key={image} src={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/packs/${username.toLowerCase()}_${packId}/${image}`}/>
            )
        })

        return assetsJsx
    }
    return(
        <div className='pack_assets_section'>
            {createAssetSection()}
        </div>
    )
}
