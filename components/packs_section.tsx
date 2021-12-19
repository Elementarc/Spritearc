import React, {ReactElement, useState, useEffect} from 'react';
 import { Pack_info } from '../types';
import Link from 'next/link';
import Pack_preview from './pack_preview';
import Loader from './loading';

export default function Packs_section(props: { header: string , packs: Pack_info[] | null}) {
	const packs = props.packs ? props.packs : []

    const jsx_packs = []
    for(let pack of packs) {
        jsx_packs.push(
            <Pack_preview key={pack._id} pack={pack}/>
        )
    }
    
	return (
		<div className="packs_container">
			
			<div className="info">
				<h1>– {props.header}</h1>
				
			</div>

			<div className="previews_container">
				{jsx_packs.length > 0 &&
                    jsx_packs
				}
				{jsx_packs.length === 0 &&
                    null
				}
				{!jsx_packs &&
					<Loader loading={true} main_color={true}/>
				}
			</div>
			
		</div>
	);
	
}