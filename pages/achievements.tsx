import React from 'react';
import Head from 'next/head';
import Footer from '../components/footer';
import { ObjectId } from 'mongodb';
import Achievement, { IAchievement } from '../components/achievement';

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
                <Achievement_sections achievements={[test_achievement,test_achievement, test_achievement, test_achievement2]}/>
            </div>

            <Footer/>
        </>
    );
}

function Achievement_sections(props: {achievements: IAchievement[]}) {
    const achievements = props.achievements
    const achievments_by_difficulty = new Map<string, IAchievement[]>()

    for(let achievement of achievements) {
        const prev_map = achievments_by_difficulty.get(achievement.difficulty) as undefined | IAchievement[]

        if(prev_map) achievments_by_difficulty.set(achievement.difficulty, [...prev_map, achievement])
        else achievments_by_difficulty.set(achievement.difficulty, [achievement]) 
        
    }

    function create_achievement_section() {
        let jsx = []

        for(let [difficulty, achievements_arr] of achievments_by_difficulty) {

            const jsx_achievements = achievements_arr.map((achievement) => {
                return (
                    <Achievement key={`${achievement._id}`} achievment={achievement}/>
                )
            })

            jsx.push(
                <div key={difficulty} className='achievements_section'>

                    <h1>{difficulty}</h1>

                    <div className='achievements_container'>
                        {jsx_achievements}
                    </div>
                    
                </div>
            )
        }

        return jsx
        
    }

    console.log(achievments_by_difficulty)
    return (
        <div className='achievements_section_container'>
            {create_achievement_section()}
        </div>
    )
}