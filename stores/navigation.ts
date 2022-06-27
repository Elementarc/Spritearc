import create from "zustand"

interface IGlobalNavigation {
  navState: boolean;
  closeNav: () => void;
  openNav: () => void;
  toggleNav: () => void;
}

const useStoreNav = create<IGlobalNavigation>(set => ({
    navState: false,
    closeNav: () => {
        
        set((state) => ({
            navState: false
        }))
    },
    openNav: () => {
        
        set((state) => ({
            navState: true
        }))
    },
    toggleNav: async() => {
        set((state) => ({
            navState: !state.navState
        }))
    },
}))

export default useStoreNav