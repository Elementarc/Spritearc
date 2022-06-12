import { useRouter } from 'next/router';
import React from 'react';
import { capitalize_first_letter_rest_lowercase } from '../lib/custom_lib';
import { format_date } from '../lib/date_lib';
import { Pack } from '../types';
import Flex from './layout/flex';
import Rating from './rating';
import Stats, { IStats } from './stats';



//Pack stats
export default function PackStats(props: {pack: Pack, ownPack: boolean}) {
    const router = useRouter()
    const pack = props.pack
    const ownPack = props.ownPack

    function createPackTagsJsx() {
        const tags = pack?.tags

        try {
            const tags_jsx = tags.map((tag) => {
                return  <a key={`tag_${tag}`} className='white default' onClick={() => {router.push(`/search?query=${tag.toLowerCase()}`,`/search?query=${tag.toLowerCase()}`, {scroll: false})}}>{tag.toUpperCase()}</a>
            })

            return (
                <Flex className='pack_tags_flex'>
                    {tags_jsx}
                </Flex>
            )
        } catch(err) {
            return []
        }
        
    }
    function visitUser() {
        router.push(`/user/${pack?.username.toLowerCase()}`, `/user/${pack?.username.toLowerCase()}`, {scroll: false})
    }
    function visitLicense() {
        router.push(`/license`, `/license`, {scroll: false})
    }
    const packStats: IStats[] = [
        {
            label: "Creator",
            Component: <a className='main default' onClick={visitUser} >{pack?.username}</a>
        },
        {
            label: "Released",
            value: `${format_date(new Date(pack?.date))}`
        },
        {
            label: "Raiting",
            Component: <Rating avgRating={pack.avg_rating} raitingCount={pack.ratings.length}/>
        },
        {
            label: "Downloads",
            value: `${pack?.downloads}`
        },
        {
            label: "License",
            Component: <a onClick={visitLicense} className='white default' >{`${capitalize_first_letter_rest_lowercase(pack?.license)}`}</a>
        },
        {
            label: "Tags",
            Component: createPackTagsJsx()
        },
    ]

    return (
        <div style={ownPack ? {marginTop: "16rem"} : {}} className="pack_stats_container"> 
            <span className="top_line" />

            <Stats stats={packStats}/>

            <span className="bottom_line" />
        </div>
    )
}