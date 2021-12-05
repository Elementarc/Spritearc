
//APP contants
export interface App_context {
    dispatch_app_notification: React.Dispatch<{
        type: string;
        payload?: Notification;
    }>
    is_mobile: boolean | undefined,
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
    _id: string,
    username: string,
    user_since: string,
    about: string,
    socials: string[]
    profile_image: string,
    released_packs: Pack_info[] | []
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