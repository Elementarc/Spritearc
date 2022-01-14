import { GetServerSideProps } from 'next';
import React, {ReactElement, useEffect, useContext, useState} from 'react';
import Footer from '../components/footer';
import {Pack_content, Pack, Public_user} from "../types"
import Link from 'next/dist/client/link';
import Image from 'next/dist/client/image';
import { Nav_shadow } from '../components/navigation';
import { useParallax } from '../lib/custom_hooks';
import ArrowIcon from "../public/icons/ArrowIcon.svg"
import CloseIcon from "../public/icons/CloseIcon.svg"
import ReportIcon from "../public/icons/ReportIcon.svg"
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/router';
import { AnimatePresence , motion} from 'framer-motion';
import H1_with_deco from '../components/h1_with_deco';
import { Device_context } from '../context/device_context_provider';
import { format_date } from '../lib/date_lib';
import { get_pack } from '../lib/mongo_lib';
import { ObjectId } from 'mongodb';
import { capitalize_first_letter_rest_lowercase } from '../lib/custom_lib';
import StarEmptyIcon from "../public/icons/StarEmptyIcon.svg"
import StarIcon from "../public/icons/StarIcon.svg"
import Pack_star_raiting from '../components/pack_stars_raiting';
import Fixed_app_content_overlay from '../components/fixed_app_content_overlay';
import ThrashIcon from "../public/icons/ThrashIcon.svg"
import { App_notification_context } from "../context/app_notification_context_provider";
import {NOTIFICATION_ACTIONS} from "../context/app_notification_context_provider"
const PACK_PAGE_CONTEXT: any = React.createContext(null)

//Renders the full Pack
export default function Pack_page(props: {pack: Pack, user: Public_user}) {
    const App_notification: any = useContext(App_notification_context)
    //State that saves currently clicked asset as a url string.
    const [focus_img_src, set_focus_img_src] = useState("/")
    //State that toggles focus of asset.
    const [show_focus_img, set_show_focus_img] = useState(false)
    //State to toggle delete pack confirmation container
    const [delete_confirmation_state, set_delete_confirmation_state] = useState(false)
    const [report_confirmation_state, set_report_confirmation_state] = useState(false)

    //Contexts
    const Device = useContext(Device_context)
    const Router = useRouter()

    //Props
    const pack: Pack = JSON.parse(`${props.pack}`)
    const user: Public_user = JSON.parse(`${props.user}`)

    function go_back() {
        const prev_path = sessionStorage.getItem("prev_path")
        if(!prev_path) return Router.push("/browse", "/browse", {scroll: false})
        
        Router.push(prev_path, prev_path, {scroll: false})
        
    }
    
    //Toggling arrow svg when scrollY > 0
    useEffect(() => {
        //Function that toggles the arrow. Getting called whenever scrolling is happening.
        function toggle_arrow() {
            const arrow_down = document.getElementById("arrow_down") as HTMLDivElement
            if(!arrow_down) return
            if(window.scrollY > 0 ) {
                arrow_down.style.opacity = "0"
            } else {
                arrow_down.style.opacity = "1"
            }
        }

        window.addEventListener("scroll", toggle_arrow)
        
        return(() => {
            window.removeEventListener("scroll", toggle_arrow)
        })
    }, [])

    //Creating parallax effect for Image
    useParallax("title_pack_background_image")
    
    //Function that sets img src + toggles show_focus_img to true.
    function toggle_asset(e: any) {
        if(e.target.src) {
            set_focus_img_src(e.target.src)
        } else {
            set_focus_img_src("/")
        }
        set_show_focus_img(true)
    }

    //Setting max_height and max_width of fixed asset_fixed_image_container in page Component.
    useEffect(() => {
        const get_page = document.getElementById("pack_page") as HTMLDivElement
        const get_fixed_asset = document.getElementById("asset_fixed_container") as HTMLDivElement

        function set_sizes() {
            if(show_focus_img) {
                
                get_fixed_asset.style.maxWidth = `${get_page.offsetWidth}px`
                get_fixed_asset.style.maxHeight = `${get_page.offsetHeight}px`
            }
        }

        set_sizes()
        window.addEventListener("resize", set_sizes)
        return(() => {
            window.removeEventListener("resize", set_sizes)
        })
    }, [show_focus_img])
    
    async function delete_pack() {
        const query = Router.query

        const response = await fetch(`/user/delete_pack?id=${query.id}`, {
            method: "POST"
        })

        
        if(response.status === 200) {
            App_notification.dispatch_app_notification({type: NOTIFICATION_ACTIONS.SUCCESS, payload: {title: "Successfully deleted pack!", message: `You now will be redirected.`, button_label: "Ok", callb: go_back}})
        } else {
            App_notification.dispatch_app_notification({type: NOTIFICATION_ACTIONS.ERROR, payload: {title: "No Permission!", message: "You do not have the permission to delete this pack!", button_label: "Ok"}})
        }

    }

    
    function report_pack_validation() {
        const report_input = document.getElementById("report_input") as HTMLInputElement
        const get_report_button = document.getElementById("report_submit_button") as HTMLButtonElement
        const report_input_regex = new RegExp(/^[a-zA-Z0-9\.\,\-\_?!]/)

        if(report_input.value.length < 25) {

            get_report_button.classList.add("disabled_button")
            return false
        }

        if(report_input_regex.test(report_input.value) === true) {
            get_report_button.classList.remove("disabled_button")
            return true
        }
        else {
            get_report_button.classList.add("disabled_button")
            return false
        }
    }

    async function submit_pack_report() {
        const valid_report_reason = report_pack_validation()
        const report_input = document.getElementById("report_input") as HTMLInputElement
        if(!valid_report_reason) return
        const pack_id = Router.query.id

        if(!pack_id) return
        if(typeof pack_id !== "string") return

        const response = await fetch(`/report_pack?pack_id=${pack_id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({reason: report_input.value})
        })

        if(response.status === 200) {
            const response_body = await response.json() as {success:boolean, message:string}
            console.log(response_body)
            App_notification.dispatch_app_notification({type: NOTIFICATION_ACTIONS.SUCCESS, payload: {title: "Thank you for helping us!", message: response_body.message, button_label: "Ok", callb: () => {set_report_confirmation_state(false)}}})
        } else {
            App_notification.dispatch_app_notification({type: NOTIFICATION_ACTIONS.ERROR, payload: {title: "Something went wrong!", message: "Something went wrong while trying to report this pack. We are sorry that you have to experience this.", button_label: "Ok"}})
        }
    }

    return (
        <PACK_PAGE_CONTEXT.Provider value={{pack: pack, toggle_asset}}>

            <div className="pack_page" id="pack_page">

                <AnimatePresence exitBeforeEnter>
                    {show_focus_img &&

                        <motion.div onClick={() => {set_focus_img_src("/"), set_show_focus_img(false)}} initial={{opacity: 0}} animate={{opacity: 1, transition: {duration: 0.1}}} exit={{opacity: 0, transition: {duration: 0.1}}} className="asset_fixed_container" id="asset_fixed_container">
                            
                            <div className="asset_fixed_image_container">
                                <Image src={focus_img_src} alt="Represents a bigger size of an clicked image" layout="fill" id="asset_fixed_image"></Image>

                                <div className="close_asset" id="close_pack">

                                    <div className="close">
                                        <CloseIcon className="close_icon"/>
                                    </div>

                                </div>
                            </div>

                        </motion.div>

                    }
                </AnimatePresence>

                

                { Device.is_mobile === false &&
                    <>

                        <Fixed_app_content_overlay>

                            <div className='fixed_container'>
                                <div className='close_pack_container' id="close_pack">

                                    <div onClick={() => {go_back()}} className="icon_container">
                                        <CloseIcon className="close_icon"/>
                                        <div className="hover_box">Close Pack</div>
                                    </div>

                                </div>
                                
                                
                                    <>
                                        <AnimatePresence exitBeforeEnter>

                                            {delete_confirmation_state &&
                                                <motion.div key="report_pack" initial={{opacity: 0}} animate={{opacity: 1, transition: {duration: .2, type: "tween"}}} exit={{opacity: 0, transition: {duration: .2, type: "tween"}}} className='delete_pack_confirmation_container'>
                                                    <motion.div initial={{opacity: 0, scale: .8}} animate={{opacity: 1, scale: 1, transition: {duration: .2, type: "tween"}}} exit={{opacity: 0, scale: .8, transition: {duration: .2, type: "tween"}}}  className='confirmation_content'>
                                                        <h1>Delete Pack?</h1>
                                                        <p>Do you want to delete this pack? Remember, after deleting this pack it wont be recoverable.</p>
                                                        <button onClick={delete_pack}>Yes, delete pack!</button>
                                                        <h4 onClick={() => {set_delete_confirmation_state(false)}}>No, dont delete pack</h4>
                                                    </motion.div>

                                                    <div onClick={() => {set_delete_confirmation_state(false)}} className='delete_pack_confirmation_background' />
                                                </motion.div>
                                            }

                                            {report_confirmation_state &&
                                                <motion.div key="report_pack"initial={{opacity: 0}} animate={{opacity: 1, transition: {duration: .2, type: "tween"}}} exit={{opacity: 0, transition: {duration: .2, type: "tween"}}} className='report_pack_confirmation_container'>
                                                    
                                                    <motion.div initial={{opacity: 0, scale: .8}} animate={{opacity: 1, scale: 1, transition: {duration: .2, type: "tween"}}} exit={{opacity: 0, scale: .8, transition: {duration: .2, type: "tween"}}}  className='confirmation_content'>
                                                        <h1>Report Pack</h1>
                                                        <input onKeyUp={report_pack_validation} type="text" placeholder='Reason' id="report_input"/>
                                                        <button className='disabled_button' id="report_submit_button" onClick={submit_pack_report}>Report pack</button>
                                                        <h4 onClick={() => {set_report_confirmation_state(false)}}>No, dont report this pack</h4>
                                                    </motion.div>

                                                    <div onClick={() => {set_report_confirmation_state(false)}} className='report_pack_confirmation_background' />

                                                </motion.div>
                                            }

                                        </AnimatePresence>

                                        <div className='pack_actions_fixed_container'>

                                            <div className='pack_actions_container'>

                                                <Pack_action Action_icon={ReportIcon} name='Report Pack' callb={() => {set_report_confirmation_state(!delete_confirmation_state)}}/>
                                                {user && (user.username === pack.username || user.role === "admin") &&
                                                    <Pack_action Action_icon={ThrashIcon} name='Delete Pack' callb={() => {set_delete_confirmation_state(!delete_confirmation_state)}}/>
                                                }

                                            </div>

                                        </div>
                                    </>
                                   
                            </div>

                        </Fixed_app_content_overlay>
                    </>
                }

                <div className="content" id="content">
        
                    <div className="preview_container" id="preview_container">
                        <div className="background">
						    <Image src={`${process.env.NEXT_PUBLIC_BASE_PATH}/packs/${pack._id}/${pack.preview}`} alt="Preview Image" layout="fill" priority={true} className="preview_image" id="title_pack_background_image"/>
                            <div className="background_blur" />
                        </div>

                        <div className="pack_info">
                            <div className="header_container">

                                <H1_with_deco title={pack.title}/>

                                <p>{pack.description}</p>
                                <button>Download Pack</button>
                            </div>

                           
                            

                            <div className="stats_container"> 
                                <span className="top_line" />

                                <div className="grid_container">
                                    
                                    <div className="grid_item">

                                        <div className="item_1">
                                            <p>Creator:</p>
                                        </div>

                                        <Link href={`/profile?user=${pack.username}`} scroll={false}>{pack.username}</Link>
                                    </div>



                                    <div className="grid_item">

                                        <div className="item_1">
                                            <p>Released:</p>
                                        </div>

                                        <div className="item_2">{format_date(new Date(pack.date))}</div>
                                    </div>

                                    <div className="grid_item">

                                        <div className="item_1">
                                            <p>Rating:</p>
                                        </div>


                                        <div className="item_2">
                                            <Pack_star_raiting ratings={pack.ratings}/>
                                            <div className='pack_rating_count_container'>
                                                <p className='pack_rating_count'>{`(${pack.ratings.length})`}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid_item">

                                        <div className="item_1">
                                            <p>Downloads:</p>
                                        </div>

                                        <div className="item_2">{`${pack.downloads}`}</div>
                                    </div>

                                    <div className="grid_item">

                                        <div className="item_1">
                                            <p>License:</p>
                                        </div>

                                        <div className="item_2">{pack.license.toUpperCase()}</div>
                                    </div>

                                    <div className="grid_item">

                                        <div className="item_1">
                                            <p>Tags:</p>
                                        </div>

                                        <div className="item_2">{pack.tags.join(", ").toUpperCase()}</div>
                                    </div>






                                </div>

                                <span className="bottom_line" />
                            </div>

                            <div className="arrow_container">
                                <ArrowIcon height="45px" width="45px" className="arrow_down" id="arrow_down"/>
                            </div>
                        </div>

                    </div>
                    
                    
                    
                    <Pack_sprite_sections pack={pack}/>

                    <Nav_shadow/>
                </div>
                
                <Footer/>

            </div>

        </PACK_PAGE_CONTEXT.Provider>
    );
}


function Rate_pack() {
    const [full_stars, set_full_stars] = useState<ReactElement[]>([])

    return (
        <div className='rate_pack_container'>
            <h1>Rate This Pack</h1>
            <div className='rate_pack_stars_container'>

                <div className='empty_stars_container'>
                    
                    <StarEmptyIcon className="empty_rate_star"/>
                    <StarEmptyIcon className="empty_rate_star"/>
                    <StarEmptyIcon className="empty_rate_star"/>
                    <StarEmptyIcon className="empty_rate_star"/>
                    <StarEmptyIcon className="empty_rate_star"/>
                    
                </div>

                <div className='full_stars_container'>

                    {full_stars}

                </div>
            </div>
            
        </div>
    );
}

//Component that creates a section with assets
function Pack_sprite_sections(props: {pack: Pack}): ReactElement {
    const pack: Pack = props.pack

    const section_jsx = []
    //Looping through content to create a section for each content
    for(let i = 0; i < pack.content.length; i++) {
        
        section_jsx.push(
            <div key={`section_${i}`} className="section_container">
                <h1>{"– "} {capitalize_first_letter_rest_lowercase(pack.content[i].section_name)}</h1>
                <Pack_asset pack_content={pack.content[i]} pack_id={pack._id}/>
            </div>
        )
    }
    
    return (
        <div className="asset_sections_container">

            <div key="" className="section_container">
                {section_jsx}
            </div>
            
        </div>
    );
}

//Component that creates assets from pack.
function Pack_asset(props: {pack_content: Pack_content, pack_id: ObjectId}): ReactElement {
    const PACK_PAGE: any = useContext(PACK_PAGE_CONTEXT)
    const pack_id = props.pack_id
    const pack_content = props.pack_content

    const show_asset = PACK_PAGE.toggle_asset as () => void
    
    
    //Array of assets as jsx
    const assets_jsx = []
    for(let i = 0; i < pack_content.section_images.length; i++) {
        assets_jsx.push(
            <div onClick={show_asset} key={`${pack_content.section_images[i]}_${i}`} className="asset">
                <Image src={`${process.env.NEXT_PUBLIC_BASE_PATH}/packs/${pack_id.toString()}/${pack_content.section_name}/${pack_content.section_images[i]}`}  quality="100%" layout="fill"  alt={`Representing one asset from this pack`}  className="patch_preview_image"/>
            </div>
        )
    }
    
    return (
        <div className="assets_grid_container">
            {assets_jsx}
        </div>
    );
}


function Pack_action({Action_icon, name, callb}: {Action_icon:any, name: string, callb: ()=>void}) {
  return (
    <div className='pack_action' onClick={callb}>
        <Action_icon/>
        <p>{name}</p>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async(context) => {

    try {
    
        if(typeof context.query.id === "string") {
            const pack = await get_pack(new ObjectId(context.query.id))

            try {
                const user = jwt.verify(context.req.cookies.user, process.env.JWT_PRIVATE_KEY as string)

                if(!pack) return {

                    redirect: {
                        destination: `/browse`,
                        permanent: false,
                    }
        
                }
        
                return{
                    props: {
                        pack: JSON.stringify(pack),
                        user: user ? JSON.stringify(user) : null
                    }
                }

            } catch ( err ) {
                return{
                    props: {
                        pack: JSON.stringify(pack),
                        user: null
                    }
                }

            }
            

            
            
        } else {

            return {

                redirect: {
                    destination: `/browse`,
                    permanent: false,
                }

            }

        }

    } catch( err ) {

        return {

            redirect: {
                destination: `/browse`,
                permanent: false,
            }

        }

    }

} 
