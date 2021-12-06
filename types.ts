
//APP contants
export interface App_context {
    nav: {nav_state: boolean, set_nav_state: React.Dispatch<React.SetStateAction<boolean>>},
    app_content_element: () => HTMLElement,
    
}

//Navigation
export interface Nav_item{
    label: string
    icon: any
    link: string
    query?: string
}

//App Notification types
export interface Notification {
    title: string | null, 
    message: string | null, 
    button_label: string | null,
    callb?: () => void
}
export interface Dispatch_notification extends Notification {
    toggle: boolean,
    success: boolean
}
export interface Notification_actions {
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
export interface Pack_info {
    _id: string,
    premium: boolean,
    user: User,
    preview_image: string,
    title: string,
    sub_title: string,
    description: string,
    date: string,
    tags: string[],
    downloads: number,
    content: Pack_content[]
    ratings: {user: string, rating: number}[] | []
}
export interface Pack_content {
    section_name: string,
    section_assets: string[]
}

//User
export interface User{
    username: string,
    email: string,
    password: string,
    salt: string,
    verified: boolean,
    description: string,
    picture: string,
    notifications: [],
    following: [],
    followers: [],
    released_packs: [],
    created_at: Date,
    occasional_emails: boolean,
}

//Signup
export interface SignUp {
    username: string | null,
    email: string | null,
    password: string | null,
    legal: boolean,
    occasional_emails: boolean,
}
export interface ServerSignUp extends SignUp {
    hashed_password: string,
    salt: string,
    date: Date,
    about: string,
    socials: string[],
    profile_image: string,
    released_packs: Pack_info[]
}