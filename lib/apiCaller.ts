import { ServerResponse } from "http";
import { ObjectId } from "mongodb";
import { Server_response, Server_response_credits, Server_response_login, Server_response_pack_id } from "../types";
import { PackFormData } from "./create_lib";

interface IApiCaller {
    deletePack: (pack_id: string, signal: AbortSignal) => Promise<Server_response | null>
    createPack: (FormData: PackFormData, signal: AbortSignal) => Promise<Server_response_pack_id | null>
    buyPackPromotion: (pack_id: string, signal: AbortSignal) => Promise<Server_response| null>
    usernameAvailable: (username: string, signal: AbortSignal) => Promise<Server_response| null>
    createAccount: (username: string, email: string, password: string, legal: boolean, occasionalEmails: boolean, signal: AbortSignal) => Promise<Server_response| null>
    login: (email: string, password: string, signal: AbortSignal) => Promise<Server_response_login| null>
    logout: (signal: AbortSignal) => Promise<Server_response| null>
    forgotPassword: (email: string, signal: AbortSignal) => Promise<Server_response| null>
    getCredits: (signal: AbortSignal) => Promise<Server_response_credits| null>
}


class ApiCaller implements IApiCaller {
    async deletePack(pack_id: string, signal: AbortSignal): Promise<Server_response | null> {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user/delete_pack/${pack_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                signal: signal,
                credentials: "include",
            })
    
            const responseObj = await response.json() as Server_response
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
    async buyPackPromotion(pack_id: string, signal: AbortSignal): Promise<Server_response | null> {

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user/promote_pack/${pack_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                signal: signal,
                credentials: "include",
            })

            const responseObj = await response.json() as Server_response
            return responseObj
            
        } catch (err: any) {
            throw new Error(err)
        }
        
    }
    async usernameAvailable(username: string, signal: AbortSignal): Promise<Server_response | null> {

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/signup/validate_username/${username}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                signal: signal,
                credentials: "include",
            })

            const responseObj = await response.json() as Server_response
            return responseObj
            
        } catch (err: any) {
            throw new Error(err)
        }
        
    }
    async emailAvailable(email: string, signal: AbortSignal): Promise<Server_response | null> {

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/signup/validate_email/${email}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                signal: signal,
                credentials: "include",
            })

            const responseObj = await response.json() as Server_response
            return responseObj
            
        } catch (err: any) {
            throw new Error(err)
        }
        
    }
    async createAccount(username: string, email: string, password: string, legal: boolean, occasionalEmails: boolean, signal: AbortSignal): Promise<Server_response | null> {

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

            const responseObj = await response.json() as Server_response
            return responseObj
            
        } catch (err: any) {
            throw new Error(err)
        }
        
    }
    async login(email: string, password: string, signal: AbortSignal): Promise<Server_response_login| null>{

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

            const responseObj = await response.json() as Server_response_login
            return responseObj
            
        } catch (err: any) {
            throw new Error(err)
        }
    }
    async forgotPassword(email: string, signal: AbortSignal): Promise<Server_response| null>{

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/forgot_password/${email}`, {
                method: "POST",
                signal: signal,
                headers: {
                    "Content-Type": "application/json"
                },
            })

            const responseObj = await response.json() as Server_response_login
            return responseObj
            
        } catch (err: any) {
            throw new Error(err)
        }
    }
    async logout(signal: AbortSignal): Promise<Server_response| null> {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                signal: signal,
                credentials: "include",
            })

            const responseObj = await response.json() as Server_response
            return responseObj
            
        } catch (err: any) {
            throw new Error(err)
        }
    }
    async getCredits(signal: AbortSignal): Promise<Server_response_credits| null> {
        try {
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user/get_credits`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                signal: signal,
                credentials: "include",
            })

            const responseObj = await response.json() as Server_response_credits
            return responseObj
            
        } catch (err: any) {
            throw new Error(err)
        }
    }
}

const apiCaller = new ApiCaller()
export default apiCaller