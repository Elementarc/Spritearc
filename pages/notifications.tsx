import { ReactElement, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import Footer from "../components/footer";
import { Nav_shadow } from "../components/navigation";
import Head from "next/head";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { format_date } from "../lib/date_lib";
//@ts-ignore 
import {NOTIFICATION_TYPES, INotification, User_notification} from "../spritearc_lib/user_notification"
import { IUnseen_notification_context_provider, Unseen_notification_context } from "../context/unseen_notifications_provider";
import { useRouter } from "next/router";

export default function Notification_page(): ReactElement {
    const [notifications, set_notifications] = useState<null | [] | INotification[]>(null)
    const [page, set_page] = useState(1)
    const Unseen_notification: IUnseen_notification_context_provider = useContext(Unseen_notification_context)
    const set_unseen_notification_count = Unseen_notification.set_unseen_notifications
    const unseen_notifications_count = Unseen_notification.unseen_notifications
    

    useEffect(() => {
        const controller = new AbortController()
        let timer: any = 0
        async function fetch_notifications() {
            
            try {
                    
                const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user/notifications?page=${page}`, {
                    method: "POST",
                    credentials: "include",
                    signal: controller.signal,
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
    
                const response_obj = await response.json()
                
                set_notifications(response_obj.notifications.reverse())
            } catch(err) {
                //
            }

        
        }

        fetch_notifications()

        timer = setInterval(() => {
            fetch_notifications()
        }, 1000 * 30)

        return(() => {
            clearInterval(timer)
            controller.abort()
        })
    }, [page, set_notifications])

    useEffect(() => {
        set_unseen_notification_count(0)
    }, [set_unseen_notification_count, unseen_notifications_count])
    
    return (
        <>
            <Head>
				<title>{`Spritearc - Notifications`}</title>
                <link rel="canonical" href="https://spritearc.com" />
                <link rel="shortlink" href="https://spritearc.com" />
                <meta name="keywords" content="pixelart, pixel art, free, sprites, game assets, free game assets, 2d"></meta>
				<meta name="description" content={`Your Spritearc notifications! Stay up to date with your community`}/>

				<meta property="og:url" content="https://Spritearc.com/"/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content={`Spritearc - Notifications`}/>
				<meta property="og:description" content={`Your Spritearc notifications! Stay up to date with your community`}/>
				<meta property="og:image" content={`${process.env.NEXT_PUBLIC_ENV === "development" ? `` : `https://${process.env.NEXT_PUBLIC_APP_NAME}.com`}/images/spritearc_wallpaper.png`}/>

				<meta name="twitter:card" content="summary_large_image"/>
				<meta property="twitter:domain" content="Spritearc.com"/>
				<meta property="twitter:url" content="https://Spritearc.com/"/>
				<meta name="twitter:title" content={`Spritearc - Notifications`}/>
				<meta name="twitter:description" content={`Your Spritearc notifications! Stay up to date with your community`}/>
                <meta name="twitter:image:src" content={`${process.env.NEXT_PUBLIC_ENV === "development" ? `` : `https://${process.env.NEXT_PUBLIC_APP_NAME}.com`}/images/spritearc_wallpaper.png`}/>
            </Head>

            <div className="notifications_content">

                {notifications &&
                    <Notification_list notifications={notifications}/>
                }
                
                <Nav_shadow/>
            </div>
            
            <Footer/>
            
        </>
    );
}

function Notification_list(props: {notifications: INotification[]}) {
    const notifications = props.notifications

    function create_notifications() {
        let notifications_jsx: ReactElement[] = []

        for(let i = 0; i < notifications.length; i++) {

            
            notifications_jsx.push(
                <User_notification_component key={`${NOTIFICATION_TYPES.FOLLOW}_notification_${i}`} notification={notifications[i]}/>
            )
            
            
        }

        return notifications_jsx.reverse()
    }

    return (
        <div className="notification_list_container">
            <h1>Notifications</h1>
            {create_notifications()}
        </div>
    );
}

function User_notification_component(props: {notification: INotification}) {
    const notification = props.notification
    const router = useRouter()

    return (
        <motion.div initial={{y: -25, opacity: 0}} animate={{y: 0, opacity: 1}} className={`notification_container ${notification.seen ? "" : "notification_container_unseen"}`}>

            <div onClick={() => {router.push(`/user/${notification.from.username}`, `/user/${notification.from.username}`, {scroll: false})}} className="profile_img_container">
                <Image loading='lazy' unoptimized={true} src={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/profile_pictures/${notification?.from?.profile_picture}`} alt={`Profile picture for the user ${notification.from.username}`} layout='fill'></Image>
            </div>

            <div className="notification_content_container">

                <Link href={`/user/${notification?.from?.username}`} scroll={false}><a className="username">{notification?.from?.username}</a></Link>
                
                <p>{notification?.message}</p>

                {notification.pack_id &&
                    <Link href={`/pack/${notification?.pack_id}`}><a className="visit_pack">show pack</a></Link>
                }
                
                <h4>{format_date(new Date(notification?.date))}</h4>

            </div>
        </motion.div>
    );
}
