import { useContext, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Dropdown } from "./dropdown"
import ProfileIcon from "../public/icons/ProfileIcon.svg"
import PacksIcon from "../public/icons/PacksIcon.svg"
import CloseIcon from "../public/icons/CloseIcon.svg"
import { useRouter } from "next/router"

export enum ESearchBarType {
    PACKS = "packs",
    CREATORS = "creators",
}
export interface ISearchBarProps {
    placeholder: string
    type: ESearchBarType
    callb?: () => Promise<any> | void
}
export default function SearchBar({placeholder, callb, type}: ISearchBarProps) {
    const router = useRouter()
    const [inputType, setInputType] = useState(type)
    
	const searchInputRef = useRef<null | HTMLInputElement>(null)
    
    const resetInput = () => {
        if(!searchInputRef?.current) return 
        searchInputRef.current.value = ''
    }

   
    const onClick = () => {
        if(!searchInputRef?.current) return 
        if(searchInputRef?.current.value.length === 0) return
        if(callb) callb()
        router.push(`?query=${searchInputRef?.current.value}`, `?query=${searchInputRef?.current.value}`, {scroll: false})
    }

    useEffect(() => {
        if(!searchInputRef?.current) return 
        searchInputRef.current.value = `${router.query.query ?? ''}`
        searchInputRef.current.focus()
    }, [router, searchInputRef])

    
	return(
        <div className='searchbar_container'>

            <div className='input_container'>
                <input className="default secondary" ref={searchInputRef} type="text" placeholder={placeholder ?? ''} />
                
                <div className='delete_search_query_container'>

                    {searchInputRef.current && searchInputRef.current.value.length > 0 &&
                        <div onClick={resetInput} className='svg_wrapper'>
                            <CloseIcon/>
                        </div>
                    }
                    
                </div>

                <div className='toggle_search_state_container'>

                    <AnimatePresence exitBeforeEnter>

                        {inputType === ESearchBarType.CREATORS &&
                            <motion.div 
                                key="search_users" 
                                initial={{scale: 0.9}} 
                                animate={{scale: 1, transition: {duration: 0.18, type: "spring"}}} 
                                exit={{scale: 0, transition: {duration: 0.12}}} 
                                onClick={() => {setInputType(ESearchBarType.PACKS)}} 
                                className='svg_wrapper'
                            >
                                <PacksIcon />
                            </motion.div>
                        }

                        {inputType === ESearchBarType.PACKS &&
                            <motion.div 
                                key="search_packs" 
                                initial={{scale: 0.9}} 
                                animate={{scale: 1, transition: {duration: 0.18, type: "spring"}}} 
                                exit={{scale: 0, transition: {duration: 0.12}}} 
                                onClick={() => {setInputType(ESearchBarType.CREATORS)}} className='svg_wrapper'
                            >
                                <ProfileIcon />
                            </motion.div>
                        }
                        
                        

                    </AnimatePresence>
                </div>
                
            </div>

            <button className="primary default" onClick={onClick}>Search</button>
        </div>
	)
}