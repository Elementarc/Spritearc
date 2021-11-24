export interface Nav_item{
    label: string
    icon: any
    link: string
    query?: string
}

export interface App_context {
    app_name: string,
    sheme: string,
    domain: string,
    port: 3000,
    path: string,
    is_mobile: boolean | undefined,
    nav: {nav_state: boolean, set_nav_state: React.Dispatch<React.SetStateAction<boolean>>},
    app_content_container: () => HTMLElement
}

//Patchnote Interface
export interface Patchnote {
    id: string
    info: Patchnote_info
    content: string
}
//PatchnoteInfo Interface
export interface Patchnote_info {
    title: string,
    update: string,
    date: Date,
    image: string,
    author: string
}

//PackPreview Interface
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

export interface User{
    _id: string,
    username: string,
    user_since: string,
    about: string,
    socials: string[]
    profile_image: string,
    released_packs: Pack_info[] | []
}