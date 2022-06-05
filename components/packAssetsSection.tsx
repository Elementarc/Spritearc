import React from 'react';
import { Pack } from '../types';
import Grid from './layout/grid';
import PackAsset from './packAsset';

export default function PackAssetsSection(props: {pack: Pack, images: string[]}) {
    const images = props.images
    const packId = props.pack._id.toString()
    const username = props.pack.username
    
    function createAssetSection() {
        const assetsJsx = images.map((image) => {
            return (
                <PackAsset key={image} image={image} packId={packId} username={username}/>
            )
        })

        return assetsJsx
    }
    return(
        <Grid className='pack_assets_section'>
            {createAssetSection()}
        </Grid>
    )
}
