import { ObjectId } from 'mongodb';
import React from 'react';
import Sprite_credits from './sprite_credits';
import Image from 'next/image';
import { capitalize_first_letter_rest_lowercase } from '../lib/custom_lib';

export interface IAchievement {
    _id: ObjectId
    preview_image: string
    counter: number
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

            <div className='achievement_preview_container'>
                <div className='achievement_preview_image_wrapper'>
                    <Image loading='lazy' unoptimized={true} src={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/achievement_images/${achievment.preview_image}`} layout="fill" />
                </div>
            </div>

            <ul>
                <Achievement_stat label='Difficulty' value={achievment.difficulty} reward={false}/>
                <Achievement_stat label='Counter' value={achievment.counter} reward={false} />
                <Achievement_stat label='Reward' value={achievment.reward} reward={true}/>

                <span></span>
            </ul>
            <p className='achievement_requirement'>{achievment.requirement}</p>
            <button className='disabled_button'>Collect Rewards</button>
        </div>
    )
}


function Achievement_stat(props: {label: string, value: string | number, reward: boolean}) {
    return (
        <li>
            <p className='achievement_stat_label'>{`${props.label}: `}</p>

            {props.reward &&
                <div className='credits_wrapper'>
                    <Sprite_credits/>
                </div>
            }

            {!props.reward &&
                <p className='achievement_stat_value'>{capitalize_first_letter_rest_lowercase(`${props.value}`)}</p>
            }
            
        </li>
    );
}

