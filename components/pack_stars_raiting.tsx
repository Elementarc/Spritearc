//Component that renders Stars based on pack Rating.
import { Pack_rating } from "../types"
import StarEmpty from "../public/icons/StarEmptyIcon.svg"
import StarHalf from "../public/icons/StarHalfIcon.svg"
import Star from "../public/icons/StarIcon.svg"

//Component that renders Stars based on pack Rating.
export default function Pack_stars_raiting(props: {ratings: Pack_rating[]}) {
    const ratings: {user: string, rating: number}[] = props.ratings
    let sum_ratings: number = 0

    for(let item of ratings) {
        sum_ratings = sum_ratings + item.rating
    }

    const avg_rating = sum_ratings / ratings.length
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
    
    const stars = create_stars(avg_rating)
    return (
        <div className="pack_stars_container">
            <div className="stars">
                {stars}
            </div>
            
            <div className="pack_rating_count_container">
                <h4 className='pack_rating_count'>{`(${ratings.length})`}</h4>
            </div>
            
        </div>
    );
}