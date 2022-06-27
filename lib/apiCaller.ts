import { ServerResponseIsAuth, ServerResponse, ServerResponseCredits, ServerResponseLogin, Server_response_pack_id, ServerResponsePublicUser } from "../types";
import { PackFormData } from "./create_lib";

interface IApiCaller {
    deletePack: (pack_id: string, signal: AbortSignal) => Promise<ServerResponse | null>
    createPack: (FormData: PackFormData, signal: AbortSignal) => Promise<Server_response_pack_id | null>
    buyPackPromotion: (pack_id: string, signal: AbortSignal) => Promise<ServerResponse| null>
    usernameAvailable: (username: string, signal: AbortSignal) => Promise<ServerResponse| null>
    createAccount: (username: string, email: string, password: string, legal: boolean, occasionalEmails: boolean, signal: AbortSignal) => Promise<ServerResponse| null>
    login: (email: string, password: string, signal: AbortSignal) => Promise<ServerResponseLogin| null>
    isAuth: (signal: AbortSignal) => Promise<ServerResponseIsAuth| null>
    logout: (signal: AbortSignal) => Promise<ServerResponse| null>
    forgotPassword: (email: string, signal: AbortSignal) => Promise<ServerResponse| null>
    getCredits: (signal: AbortSignal) => Promise<ServerResponseCredits| null>
    setProfilePicture: (formData: FormData, signal: AbortSignal) => Promise<ServerResponse | null>
    setProfileBanner: (formData: FormData, signal: AbortSignal) => Promise<ServerResponse | null>
    setProfileDescription: (description: string, signal: AbortSignal) => Promise<ServerResponse | null>
    deleteAccount: (password:string, signal: AbortSignal) => Promise<ServerResponse | null>
    getPublicUser: (username: string, signal: AbortSignal) => Promise<ServerResponsePublicUser | null>
}


class ApiCaller implements IApiCaller {
    async deletePack(pack_id: string, signal: AbortSignal): Promise<ServerResponse | null> {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user/delete_pack/${pack_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                signal: signal,
                credentials: "include",
            })
    
            const responseObj = await response.json() as ServerResponse
            return responseObj
        } catch ( err: any ) {
            throw new Error(err)
        }
        
    }
    async createPack(FormData: PackFormData, signal: AbortSignal): Promise<Server_response_pack_id | null> {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user/create_pack`, {
                method: "POST",
                credentials: "include",
                signal: signal,
                body: FormData
            })

            const responseObj = await response.json() as Server_response_pack_id
            return responseObj

        } catch ( err: any ) {
            throw new Error(err)
        }
    }
    async buyPackPromotion(pack_id: string, signal: AbortSignal): Promise<ServerResponse | null> {

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user/promote_pack/${pack_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                signal: signal,
                credentials: "include",
            })
            const responseObj = await response.json() as ServerResponse
            return responseObj
            
        } catch (err: any) {
            throw new Error(err)
        }
        
    }
    async usernameAvailable(username: string, signal: AbortSignal): Promise<ServerResponse | null> {

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/signup/validate_username/${username}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                signal: signal,
                credentials: "include",
            })

            const responseObj = await response.json() as ServerResponse
            return responseObj
            
        } catch (err: any) {
            throw new Error(err)
        }
        
    }
    async emailAvailable(email: string, signal: AbortSignal): Promise<ServerResponse | null> {

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/signup/validate_email/${email}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                signal: signal,
                credentials: "include",
            })

            const responseObj = await response.json() as ServerResponse
            return responseObj
            
        } catch (err: any) {
            throw new Error(err)
        }
        
    }
    async createAccount(username: string, email: string, password: string, legal: boolean, occasionalEmails: boolean, signal: AbortSignal): Promise<ServerResponse | null> {

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/signup/create_account`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                signal: signal,
                credentials: "include",
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    legal,
                    occasionalEmails
                })
            })

            const responseObj = await response.json() as ServerResponse
            return responseObj
            
        } catch (err: any) {
            throw new Error(err)
        }
        
    }
    async login(email: string, password: string, signal: AbortSignal): Promise<ServerResponseLogin| null>{

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                signal: signal,
                credentials: "include",
                body: JSON.stringify({
                    email,
                    password,
                })
            })

            const responseObj = await response.json() as ServerResponseLogin
            return responseObj
            
        } catch (err: any) {
            throw new Error(err)
        }
    }
    async isAuth(signal: AbortSignal): Promise<ServerResponseIsAuth | null> {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user/is_auth`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                signal: signal,
                credentials: "include",
            })

            const responseObj = await response.json() as ServerResponseIsAuth
            return responseObj
            
        } catch (err: any) {
            throw new Error(err)
        }
    }
    async forgotPassword(email: string, signal: AbortSignal): Promise<ServerResponse| null>{

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/forgot_password/${email}`, {
                method: "POST",
                signal: signal,
                headers: {
                    "Content-Type": "application/json"
                },
            })

            const responseObj = await response.json() as ServerResponseLogin
            return responseObj
            
        } catch (err: any) {
            throw new Error(err)
        }
    }
    async logout(signal: AbortSignal): Promise<ServerResponse| null> {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                signal: signal,
                credentials: "include",
            })

            const responseObj = await response.json() as ServerResponse
            return responseObj
            
        } catch (err: any) {
            throw new Error(err)
        }
    }
    async getCredits(signal: AbortSignal): Promise<ServerResponseCredits| null> {
        try {
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user/get_credits`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                signal: signal,
                credentials: "include",
            })

            const responseObj = await response.json() as ServerResponseCredits
            return responseObj
            
        } catch (err: any) {
            throw new Error(err)
        }
    }
    async setProfilePicture(formData: FormData, signal: AbortSignal): Promise<ServerResponse | null> {

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user/update_profile_image`, {
                method: "POST",
                credentials: "include",
                signal,
                body: formData
            })

            const responseObj = await response.json() as ServerResponse
            return responseObj
        } catch (err: any) {
            throw new Error(err)
        }
    }
    async setProfileBanner(formData: FormData, signal: AbortSignal): Promise<ServerResponse | null> {

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user/update_profile_banner`, {
                method: "POST",
                credentials: "include",
                signal,
                body: formData
            })

            const responseObj = await response.json() as ServerResponse
            return responseObj
        } catch (err: any) {
            throw new Error(err)
        }
    }
    async setProfileDescription(description: string, signal: AbortSignal): Promise<ServerResponse | null> {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user/update_user_description`, {
                method: "POST",
                credentials: "include",
                headers: {
                    'Content-Type': "application/json"
                },
                signal,
                body: JSON.stringify({description: description})
            })

            const responseObj = await response.json() as ServerResponse
            return responseObj
        } catch (err: any) {
            throw new Error(err)
        }
    }
    async deleteAccount(password: string, signal: AbortSignal): Promise<ServerResponse | null> {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user/delete_account`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                signal,
                body: JSON.stringify({password: password})
            })

            const responseObj = await response.json() as ServerResponse
            return responseObj
        } catch (err: any) {
            throw new Error(err)
        }
    }
    async getPublicUser(username: string, signal: AbortSignal): Promise<ServerResponsePublicUser | null> {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/get_public_user/${username}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
            })

            const responseObj = await response.json() as ServerResponsePublicUser
            return responseObj
        } catch (err: any) {
            throw new Error(err)
        }
    }
}

const apiCaller = new ApiCaller()
export default apiCaller