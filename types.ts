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
    isDesktop: boolean,
    nav: NavContext
}

export interface Patchnote {
    info: PatchnoteInfo
    content: string
}

export interface PatchnoteInfo {
    id: string
    title: string,
    update: string,
    date: string,
    image: string,
}