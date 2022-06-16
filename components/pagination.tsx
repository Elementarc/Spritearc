import { useAnimation } from 'framer-motion';
import React, {useEffect} from 'react';
import { motion } from 'framer-motion';

export default function Pagination(props: {currentPage: number, lastPage: number | null | undefined, setPage: React.Dispatch<React.SetStateAction<number>>}) {
    const page = props.currentPage
    const lastPage = props.lastPage ?? 0

    function increasePage() {
        if(page < lastPage) props.setPage(page + 1)
    }

    const paginationAnimation = useAnimation()
    
    useEffect(() => {

        if(page < lastPage) {
            paginationAnimation.set({
                opacity: 1,
                pointerEvents: "all",
            })
        } else {
            paginationAnimation.set({
                opacity: 0,
                pointerEvents: "none",
            })
        }
        
    }, [paginationAnimation, lastPage, page])

    return (
        <motion.div animate={paginationAnimation}>
            <div className='pagination_grid'>
                <span className='left_line' />
                <div className='next_page_container'>
                    <p onClick={increasePage} className='p default'>Load More</p>
                </div>
                <span className='right_line'/>
            </div>
            
        </motion.div>
        
    );
}
