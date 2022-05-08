import React, { ReactElement, useEffect, useState } from 'react';
import Head from 'next/head';
import Footer from '../components/footer';
import { ObjectId } from 'mongodb';
import Achievement, { IAchievement } from '../components/achievement';
import { capitalize_first_letter_rest_lowercase } from '../lib/custom_lib';

let id = "asdaiosdas" as unknown as ObjectId
let id2 = "asdaiosdasasd" as unknown as ObjectId
const test_achievement: IAchievement = {
    _id: id,
    label: "King",
    difficulty: "hard",
    reward: 250,
    requirement: "win a game of chess"
}

const test_achievement2: IAchievement = {
    _id: id2,
    label: "King",
    difficulty: "easy",
    reward: 250,
    requirement: "win a game of chess"
}

export default function Achievements_page() {
    const [sorted_achievements_section_jsx, set_sorted_achievements_section_jsx] = useState<ReactElement[]>([])

    useEffect(() => {
        //FETCH ALL ACHIEVEMENTS
        const achievements_arr = [test_achievement,test_achievement, test_achievement, test_achievement2]

        const achievement_map = new Map()

        for(let achievement of achievements_arr) {
            achievement_map.set(achievement.difficulty, achievement_map.get(achievement.difficulty) ? [...achievement_map.get(achievement.difficulty), achievement] : [achievement])
        }

        function generate_achievements_jsx() {
            let achievements_section_jsx = []
            for(let [difficulty, achievements] of achievement_map) {
                achievements_section_jsx.push(
                    <Achievement_sections key={difficulty} label={difficulty} achievements={achievements}/>
                )
            }

            set_sorted_achievements_section_jsx(achievements_section_jsx)
        }
        
        generate_achievements_jsx()

    }, [set_sorted_achievements_section_jsx])

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
                {sorted_achievements_section_jsx}
            </div>

            <Footer/>
        </>
    );
}

function Achievement_sections(props: {label: string, achievements: IAchievement[]}) {
    const [display_achievement_section, set_display_achievement_section] = useState(true)

    const achievements = props.achievements
    const achievments_by_difficulty = new Map<string, IAchievement[]>()
    
    function generate_achievement_jsx(): ReactElement[] {

        let jsx_achievements = props.achievements.map((achievement) => {
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