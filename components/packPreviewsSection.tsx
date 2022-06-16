import { LayoutGroup } from 'framer-motion';
import React, {useEffect, useState} from 'react';
import useGetPacks from '../hooks/useGetPacks';
import { capitalize_first_letter_rest_lowercase, sortPacks, SORT_ACTIONS } from '../lib/custom_lib';
import { Dropdown } from './dropdown';
import PackPreview from './packPreview';
import Pagination from './pagination';
import Section from './section';


export default function PackPreviewsSection(props: {label: string, api: string}) {
    const [sort, setSort] = useState<null | string>(null)
    const [page, setPage] = useState(1)
    const sortActions = [
        SORT_ACTIONS.BY_RECENT,
        SORT_ACTIONS.BY_RATING, 
        SORT_ACTIONS.BY_DOWNLOADS,
    ]

    const label = props.label
    const api = props.api
    
    const packsObj = useGetPacks(api, page)
    const packs = sortPacks(packsObj?.packs ?? [], sort) 
    
    const packPreviewsJsx = packs.map((pack) => {
        return(
            <PackPreview key={pack._id.toString()} pack={pack}/>
        )
    })

    function formatSortActions() {
        const formattedAction = []
        for(let action of sortActions) {
            formattedAction.push(capitalize_first_letter_rest_lowercase(action))
        }
        

        return formattedAction
    }

    return (
        <Section label={label} SectionInfoComponent={<Dropdown label="Sort by" reset_option='None' options={formatSortActions()} active_state={sort} set_active_state={setSort}/>}>
            <div className='pack_previews_grid'>
                <LayoutGroup>
                    {packPreviewsJsx}
                </LayoutGroup>
            </div>
            <Pagination currentPage={page} lastPage={packsObj?.availablePages} setPage={setPage}/>
        </Section>
    );
}