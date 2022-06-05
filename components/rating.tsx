import React from 'react';
import StarEmpty from "../public/icons/StarEmptyIcon.svg"
import StarHalf from "../public/icons/StarHalfIcon.svg"
import Star from "../public/icons/StarIcon.svg"

export default function Rating(props: {avgRating: number, raitingCount?: number}) {
    const avgRaiting = props.avgRating
    const raitingCount = props.raitingCount
    
    //Return a ReactElement array with stars. 
    function create_stars(number: number) {
        const max_stars = 5
        const stars_jsx: any = []
        const decimal = number % 1

        for(let i = 0; i < Math.floor(number); i++) {
            stars_jsx.push(<Star key={i}/>)
        }
        

        if(decimal >= .5) {
            stars_jsx.push(<StarHalf key={decimal}/>)
        }

        if(stars_jsx.length < max_stars) {
            const left_over = max_stars - stars_jsx.length
            for(let i = 0; i < left_over; i++) {
                stars_jsx.push(<StarEmpty key={`empty_star_${i}`}/>)
            }
        }

        return stars_jsx
    }
    
    const stars = create_stars(avgRaiting)
    return (
        <div className="pack_stars_container">
            <div className="stars">
                {stars}
            </div>
            
            <div className="pack_rating_count_container">
                <h4 className='pack_rating_count'>{`(${raitingCount})`}</h4>
            </div>
            
        </div>
    );
}