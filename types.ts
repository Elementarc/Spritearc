import { ObjectId } from "mongodb";

//APP context_types
export interface App_navigation_context_type {
    nav_state: boolean,
    set_nav_state: React.Dispatch<React.SetStateAction<boolean>>
}
export interface App_notification_context_type {
    app_notification: App_notification,
    dispatch_app_notification: React.Dispatch<{type: string,payload?: App_dispatch_notification | undefined}>
}

export interface App_context {
    app_content_element: () => HTMLElement,
    
}

//Navigation item
export interface Nav_item{
    label: string
    icon: any
    link: string
    query?: string
}

//App Notification types
export interface App_dispatch_notification {
    title: string | null, 
    message: string | null, 
    button_label: string | null,
    callb?: () => void
}
export interface App_notification extends App_dispatch_notification {
    toggle: boolean,
    success: boolean
}
export interface App_notification_actions {
    SUCCESS: string,
    ERROR: string,
    CLOSE: string,
}

//Patchnote types
export interface Patchnote {
    id: string
    info: Patchnote_info
    content: string
}
export interface Patchnote_info {
    title: string,
    update: string,
    date: Date,
    image: string,
    author: string
}

//PackPreview types
export interface Pack {
    _id: string,
    premium: boolean,
    username: string,
    preview_image: string,
    title: string,
    license: string,
    description: string,
    date: string,
    tags: string[],
    downloads: number,
    content: Pack_content[]
    ratings: {user: string, rating: number}[] | []
}
export interface Pack_content {
    section_name: string,
    section_assets: string[] | []
}

//Create pack
export interface Create_pack_frontend {
    current_step: number,
    steps_available: number[],
    license: string | null,
    preview: {preview_asset: Blob | null, preview_url: string | null}
    premium: boolean,
    title: string | null,
    description: string | null,
    tags: string[],
    content: Map<string, {section_assets: Blob[], section_urls: string[]}>
}

export interface Create_pack_context_type {
    create_pack_obj: Create_pack_frontend;
    dispatch: React.Dispatch<{
        type: string;
        payload?: any;
    }>;
}

//User
export interface User extends Public_user{
    email: string,
    password: string,
    salt: string,
    verified: boolean,
    notifications: [],
    role: string,
    occasional_emails: boolean,
}

export interface Public_user {
    username: string,
    description: string,
    created_at: Date,
    profile_picture: string,
    profile_banner: string,
    following: [],
    followers: [],
    released_packs: string[] | [],
}


//Signup
export interface Signup_obj {
    username: string | null,
    email: string | null,
    password: string | null,
    legal: boolean,
    occasional_emails: boolean,
}
export interface Server_signup_obj extends Signup_obj {
    hashed_password: string,
    salt: string,
    date: Date,
    about: string,
    socials: string[],
    profile_image: string,
    released_packs: Pack[]
}

