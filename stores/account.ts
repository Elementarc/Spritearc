import create, { useStore } from "zustand"
import apiCaller from "../lib/apiCaller";
import { PublicUser } from "../types";

interface IAccount {
  account: PublicUser | null;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const useStoreAccount = create<IAccount>(set => ({
    account: null,
    login: async(email: string, password: string) => {
        const response = await apiCaller.login(email, password, new AbortController().signal)
        if(!response?.success) return
        
        set((state) => ({
          account: response.public_user
        }))
    },
    logout: async() => {
      const response = await apiCaller.logout(new AbortController().signal)
      if(!response?.success) return
      
      set((state) => ({
        account: null
      }))
  },
}))

export default useStoreAccount