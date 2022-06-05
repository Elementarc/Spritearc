import { ServerResponse } from "http";
import { ObjectId } from "mongodb";
import { Server_response, Server_response_pack_id } from "../types";
import { PackFormData } from "./create_lib";

interface IApiCaller {
    deletePack: (pack_id: string, signal: AbortSignal) => Promise<Server_response | null>
    createPack: (FormData: PackFormData, signal: AbortSignal) => Promise<Server_response_pack_id | null>
    buyPackPromotion: (pack_id: string, signal: AbortSignal) => Promise<Server_response| null>
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
}

const apiCaller = new ApiCaller()
export default apiCaller