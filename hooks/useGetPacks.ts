import React, {useState, useEffect} from 'react';
import { Pack, Server_response_packs } from '../types';

export interface IPacksObj {
    currentPage: number,
    availablePages: number,
    packs: Pack[]
}

export default function useGetPacks(api: string, page: number) {
    const [packsObj, setPacksObj] = useState<IPacksObj | null>(null);

    //Getting packs from server. Setting it aswell
	useEffect(() => {
		const controller = new AbortController()
		
		async function getRecentPacks() {
			try {
                // `${process.env.NEXT_PUBLIC_SPRITEARC_API}/recent_packs?page=${page}`
				const response = await fetch(`${api}&page=${page}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					credentials: "include",
					signal: controller.signal,
				})
				
				const response_obj = await response.json() as Server_response_packs
				
                setPacksObj({
                    currentPage: page,
                    availablePages: response_obj.available_pages,
                    packs: response_obj.packs
                })

			} catch(err) {
				//
			}
		}

		getRecentPacks()

		return(() => {
			controller.abort()
		})
	}, [api, page])


    return packsObj
}
