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
    nav: NavContext
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
export interface PackPreview {
    _id: string,
    title: string,
    subTitle: string,
    image: string,
    date: Date,
}