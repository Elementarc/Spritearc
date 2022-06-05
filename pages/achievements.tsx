import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import Footer from '../components/footer';
import { ObjectId } from 'mongodb';
import Achievement, { IAchievement } from '../components/achievement';
import { capitalize_first_letter_rest_lowercase } from '../lib/custom_lib';

export default function Achievements_page() {
    const [achievements_arr, set_achievements_arr] = useState<null | Map<string, IAchievement[]>>(null)

    useEffect(() => {
        //FETCH ALL ACHIEVEMENTS
        async function get_all_achievements() {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/achievements/get_all`, {
                method: "POST"
            })
            
            if(response.status !== 200) return null

            const response_obj = await response.json() 
            const achievements = response_obj.achievements as IAchievement[]
            
            const achievement_map = new Map<string, IAchievement[]>()
            for(let achievement of achievements) {
                const achievement_map_entries = achievement_map.get(achievement.difficulty)

                achievement_map.set(achievement.difficulty, achievement_map_entries ? [...achievement_map_entries, achievement] : [achievement])
            }
            
            console.log(achievement_map)
            set_achievements_arr(achievement_map)
        }
        get_all_achievements()
        
    }, [set_achievements_arr])

    const generate_achievements_jsx = useCallback(() => {
        function generate_achievements_jsx() {
            if(!achievements_arr) return
            let achievements_section_jsx = []

            console.log(achievements_arr)
            for(let [difficulty, achievements] of achievements_arr) {

                achievements_section_jsx.push(
                    <Achievement_sections key={difficulty} label={difficulty} achievements={achievements}/>
                )
            }

            return achievements_section_jsx
        }
        return generate_achievements_jsx()
    },[achievements_arr])
    
    return (
        <>
            <Head>
				<title>{`Spritearc - Achievements`}</title>
				<meta name="description" content="Navigate through your account."/>

				<meta property="og:url" content="https://Spritearc.com/"/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content="Spritearc - Achievements"/>
				<meta property="og:description" content="Navigate through your account."/>
                <meta property="og:image" content={`${process.env.NEXT_PUBLIC_ENV === "development" ? `` : `https://${process.env.NEXT_PUBLIC_APP_NAME}.com`}/images/spritearc_wallpaper.png`}/>

				<meta name="twitter:card" content="summary_large_image"/>
				<meta property="twitter:domain" content="Spritearc.com"/>
				<meta property="twitter:url" content="https://Spritearc.com/"/>
				<meta name="twitter:title" content="Spritearc - Achievements"/>
				<meta name="twitter:description" content="Navigate through your account."/>
                <meta name="twitter:image:src" content={`${process.env.NEXT_PUBLIC_ENV === "development" ? `` : `https://${process.env.NEXT_PUBLIC_APP_NAME}.com`}/images/spritearc_wallpaper.png`}/>
            </Head>

            <div className='achievements_content'>
                {generate_achievements_jsx()}
            </div>

            <Footer/>
        </>
    );
}

function Achievement_sections(props: {label: string, achievements: IAchievement[]}) {
    const [display_achievement_section, set_display_achievement_section] = useState(true)

    const achievements = props.achievements
    
    function generate_achievement_jsx(): ReactElement[] {

        let jsx_achievements = achievements.map((achievement) => {
            return <Achievement key={`${achievement._id}`} achievment={achievement}/>
        })

        return jsx_achievements
    }
    
    return (
        <div className='achievements_section_container'>
            <div key={`achievements_${props.label}`} className='achievements_section'>

                <div className="achievements_section_info">
                    <h1 onClick={() => {set_display_achievement_section(!display_achievement_section)}}>{display_achievement_section ? `–` : "+"} {capitalize_first_letter_rest_lowercase(props.label)}</h1>
                </div>

                <div style={display_achievement_section ? {display: "grid"} : {display: "none"}} className='achievements_container'>
                    {generate_achievement_jsx()}
                </div>

            </div>
        </div>
    )
}