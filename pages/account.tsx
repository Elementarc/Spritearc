import { GetServerSideProps } from 'next';
import React, {useContext} from 'react';
import jwt from 'jsonwebtoken';
import { Public_user } from '../types';
import Footer from '../components/footer';
import Image from "next/image"
import Link from 'next/dist/client/link';
import ProfileIcon from "../public/icons/ProfileIcon.svg"
import AddIcon from "../public/icons/AddIcon.svg"
import LogoutIcon from "../public/icons/LogoutIcon.svg"
import SettingsIcon from "../public/icons/SettingsIcon.svg"
import { useRouter } from 'next/router';
import { USER_DISPATCH_ACTIONS } from '../context/auth_context_provider';
import { Auth_context } from '../context/auth_context_provider';
import { Nav_shadow } from '../components/navigation';
import { useParallax } from '../lib/custom_hooks';
export default function Account_page(props: {user: Public_user}) {
    const user = props.user
    const router = useRouter()
    function go_to(path: string) {
        router.push(path, path, {scroll: false})
    }
    const Auth: any = useContext(Auth_context)
    
    
    async function logout () {
        const response = await fetch("/api/user/logout", {method: "POST"})

        if(response.status === 200) {
            Auth.dispatch_user({type: USER_DISPATCH_ACTIONS.LOGOUT, payload: {callb: () => {router.push("/login", "/login", {scroll: false})}}})
        }
    }

    useParallax("profile_banner")
    return (
        <div className='account_page'>
            
            <div className='content'>
                <Nav_shadow/>
                <div className='user_preview_container'>

                    <div className='image_container'>
                        <Image priority={true} id="profile_banner" src={`/profile_banners/${user.profile_banner}`} alt={`Profile banner for the user ${user.username}`} layout='fill'></Image>
                        <div className='blur' />
                    </div>
                    
                    <div className='user_portrait_container'>

                        <div className='portrait'>
                            <Image priority={true} src={`/profile_pictures/${user.profile_picture}`} alt={`Profile banner for the user ${user.username}`} layout='fill'></Image>
                        </div>

                    </div>
                </div>

                <div className='user_info_container'>
                    <Link href={`/profile?user=${user.username.toLowerCase()}`} scroll={false}>{user.username}</Link>
                    <p>{user.description}</p>
                </div>

                <div className='user_navigator_cards'>

                    <div onClick={() => go_to(`/profile?user=${user.username}`)} className='card'>

                        <div className='icon_container'>

                            <div className='icon_background'>
                                <ProfileIcon className="icon"/>
                            </div>

                        </div>

                        <h1>Profile</h1>
                        <p>Visit your public profile and checkout what others will see when visiting your account!</p>
                    </div>

                    <div onClick={() => go_to(`/create_pack`)} className='card'>

                        <div className='icon_container'>

                            <div className='icon_background'>
                                <AddIcon className="icon"/>
                            </div>

                        </div>

                        <h1>Create Pack</h1>
                        <p>Create your own Pixelart pack! Make yourself a name.</p>
                    </div>

                    <div className='card'>

                        <div className='icon_container'>

                            <div className='icon_background'>
                                <SettingsIcon className="icon"/>
                            </div>

                        </div>

                        <h1>Account Settings</h1>
                        <p>Change important account informations of your account. </p>
                    </div>

                    <div onClick={() => logout()} className='card'>

                        <div className='icon_container'>

                            <div style={{transform: "rotate(180deg)"}} className='icon_background'>
                                <LogoutIcon className="icon"/>
                            </div>

                        </div>

                        <h1>Logout</h1>
                        <p>Logout from your account.</p>
                    </div>

                </div>


            </div>

            <Footer />
        </ div>
    );
}


export const getServerSideProps: GetServerSideProps = async (context: any) => {
    const redirect = {redirect: {
        permanent: false,
        destination: "/login"
    }}

    try {
        const user = jwt.verify(context.req.cookies.user, process.env.JWT_PRIVATE_KEY as string)

        if(user) {
            return {
                props: {
                    user: user
                }
            }
        } else {
            return redirect
        }

    } catch (err) {
        return redirect
    }
}
