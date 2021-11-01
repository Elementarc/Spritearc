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
    id: string
    info: PatchnoteInfo
    content: string
}

export interface PatchnoteInfo {
    title: string | undefined,
    update: string | undefined,
    date: Date | undefined,
    image: string | undefined,
}