export interface NavItem{
    label: string
    icon: any
    link: string
}

export interface NavContext {
    navState: boolean,
    setNavState: React.Dispatch<React.SetStateAction<boolean>>
}

export interface AppContext {
    isDesktop: boolean,
    nav: NavContext
    
}

export interface PatchInformation{
    title: string,
    update: string,
    date: string,
    image: string,
}

export interface FullPatchInformation extends PatchInformation {
    id: string
}