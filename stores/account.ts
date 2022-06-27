import create, { useStore } from "zustand"
import apiCaller from "../lib/apiCaller";
import { PublicUser, ServerResponseLogin, ServerResponse, ServerResponseCredits, ServerResponseIsAuth } from "../types";

interface IGlobalAccount {
  userData: PublicUser | null | undefined;
  credits: number;
  login: (email: string, password: string, signal: AbortSignal) => Promise<ServerResponseLogin | null>;
  logout: (signal: AbortSignal) => Promise<ServerResponse | null>;
  deleteAccount: (password: string, signal: AbortSignal) => Promise<ServerResponse | null>
  isLoggedIn: (signal: AbortSignal) => Promise<ServerResponseIsAuth | null>;
  fetchCredits: (signal: AbortSignal) => Promise<ServerResponseCredits | null>
  editCredits: (editNumber: number) => void;

}

const useStoreAccount = create<IGlobalAccount>(set => ({
    userData: undefined,
    credits: 0,
    login: async(email: string, password: string, signal: AbortSignal) => {
        try {
            const response = await apiCaller.login(email, password, signal)
            if(!response?.success) return response
            
            set((state) => ({
                userData: response.public_user
            }))
            return response
        } catch (error) {
            return null
        }
    },
    logout: async(signal: AbortSignal) => {
        try {
            const response = await apiCaller.logout(signal)
            if(!response?.success) return response
            
            set((state) => ({
                userData: null
            }))           
            
            return response
        } catch (error) {
            return null
        }
    },
    deleteAccount: async(password: string, signal: AbortSignal) => {
        try {
            const response = await apiCaller.deleteAccount(password, signal)
            if(!response?.success) return response
            
            set((state) => ({
                userData: null
            }))           
            
            return response
        } catch (error) {
            return null
        }
    },
    isLoggedIn: async(signal: AbortSignal) => {
        try {
            const response = await apiCaller.isAuth(signal)
            if(!response?.success) {
                set((state) => ({
                    userData: null
                }))
                return response
            }
            
            
            set((state) => ({
                userData: response.publicUser
            }))           
            
            return response
        } catch (error) {
            return null
        }
    },
    editCredits: (editNumber: number) => {
        set((state) => ({
            credits: state.credits + editNumber
        }))
    },
    fetchCredits: async(signal: AbortSignal) => {
        try {
            const response = await apiCaller.getCredits(signal)
            if(!response?.success) return response
            
            set((state) => ({
                credits: response.credits
            }))

            return response
        } catch (error) {
            return null
        }
    },
}))

export default useStoreAccount