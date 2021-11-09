import React, {ReactElement, useEffect, useState} from 'react';
import { Pack , RecentPacksResponse } from "../types"
import { GetServerSideProps } from 'next'
import { Recent_packs } from '../components/pack_previews';

export default function Browse(props: {recentPacksResponse: RecentPacksResponse}) {
	const recentPacksResponse = props.recentPacksResponse
	return (
		<div className="packs_container">
			
			<div className="title_pack_preview_container">
				
			</div>

			<Recent_packs recentPacksResponse={recentPacksResponse} />
		</div>
	);
}


export const getServerSideProps: GetServerSideProps = async(context) => {
	const recentPacksResponse: RecentPacksResponse = await (await fetch(`http://localhost:3000/api/getRecentPacks?page=1`)).json()
	
	return{
		props: {
			recentPacksResponse
		}
	}
} 
