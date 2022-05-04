import { ObjectId } from 'mongodb';
import React from 'react';

export interface IAchievement {
    _id: ObjectId
    label: string
    difficulty: string
    reward: number
    requirement: string
}

export default function Achievement(props: {achievment: IAchievement}) {
    const achievment = props.achievment
    
    return(
        <div className='achievement_container'>
            <h1>{achievment.label}</h1>
            <ul>
                <Achievement_stat label='Difficulty' value={achievment.difficulty}/>
                <Achievement_stat label='Counter' value={12}/>
                <Achievement_stat label='Reward' value={achievment.reward}/>

                <span></span>
            </ul>
            <p className='achievement_requirement'>Win one Game of Chess</p>
            <button className='disabled_button'>Collect Rewards</button>
        </div>
    )
}


function Achievement_stat(props: {label: string, value: string | number}) {
    return (
        <li>
            <p className='achievement_stat_label'>{`${props.label}: `}</p>
            <p className='achievement_stat_value'>{props.value}</p>
        </li>
    );
}

