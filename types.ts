export interface NavItem{
    label: string
    icon: any
    link: string
    query?: string
}

export interface NavContext {
    navState: boolean,
    setNavState: React.Dispatch<React.SetStateAction<boolean>>
}

export interface AppContext {
    isMobile: boolean | undefined,
    nav: NavContext,
    app_content_container: () => HTMLElement
}

//Patchnote Interface
export interface Patchnote {
    id: string
    info: PatchnoteInfo
    content: string
}
//PatchnoteInfo Interface
export interface PatchnoteInfo {
    title: string,
    update: string,
    date: Date,
    image: string,
    author: string
}

//PackPreview Interface
export interface PackInfo {
    _id: string,
    user: User,
    preview_image: string,
    title: string,
    sub_title: string,
    description: string,
    socials: string[]
    date: string,
    tags: string[],
    downloads: number,
    content: PackContent[]
    ratings: {user: string, rating: number}[] | []
}
export interface PackContent {
    section_name: string,
    section_assets: string[]
}

interface User{
    _id: string,
    username: string,
    user_since: string,
    about: string,
    profile_image: string,
    released_packs: PackInfo[] | []
}