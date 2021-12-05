import React, {useContext, useEffect, useCallback} from 'react';
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router';
import { APP_CONTEXT } from '../components/layout';
import { App_context } from '../types';
import { NOTIFICATION_ACTIONS } from '../components/layout';
import { MongoClient } from 'mongodb';
import { ObjectId } from 'mongodb';

export default function Verify_account(props: any) {
    const APP: App_context = useContext(APP_CONTEXT)
    const router = useRouter()

    useEffect(() => {
        
        if(props.success) {
            APP.dispatch_app_notification({type: NOTIFICATION_ACTIONS.SUCCESS, payload: {title: "Successfully verified!", message: "Thank you for verifying your account! We will now redirect you to our login page.", button_label: "Okay", callb: () => {router.push("/login", "/login", {scroll: false})}}})
        } else {
            APP.dispatch_app_notification({type: NOTIFICATION_ACTIONS.ERROR, payload: {title: "Token has been expired!", message: "Your token has been expired. Please login to resend you a verification email.", button_label: "Okay", callb: () => {router.push("/login", "/login", {scroll: false})}}})
        }
        
    }, [])

    return (
        <div style={{height: "100vh"}} className="verification_page">

        </div>
    );
}


export const getServerSideProps: GetServerSideProps = async(context) => {

    const client = new MongoClient("mongodb://localhost:27017")
    const token = context.query.token
    const redirect = {redirect: {
        permanent: false,
        destination: "/login"
    }}

    if(!token) return redirect
    if(typeof token !== "string") return redirect
    //Token exists and its of the type string.

    try {
        
        await client.connect()
        const token_collection = client.db("pixels").collection("account_verification_tokens")
        
        const found_token = await token_collection.findOne({token: token})

        if(!found_token) return redirect
        //Token exists in database.
        const token_date = new Date(found_token.date)
        
        //function that checks if token is expired
        function check_token_expired(token_time: number): boolean {
            const current_time = new Date().getTime()
            const ten_min = 1000 * 60 * 10
            const token_alife = current_time - token_time 
            
            if(token_alife > ten_min) {
                return true
            } else {
                return false
            }
        }
        
        const token_expired = check_token_expired(token_date.getTime())
        
        if(token_expired) {
            await token_collection.deleteOne({token: token})
            return {props: {success: false}}
        }

        //Token is not expired
        const user_collection = client.db("pixels").collection("users")

        const user_found = await user_collection.find({_id: new ObjectId(found_token.user_id)}).toArray()
        if(user_found.length === 0) return redirect

        //user found & verifieng user
        user_collection.updateOne({_id: new ObjectId(found_token.user_id)}, {$set: {verified: true}}, async(err, mres) => {
            if( err ) throw err;
            
            await token_collection.deleteOne({token: token})
        })

        return {
            props: {
                success: true
            }
        }
        
    } catch ( err ) {

        console.log(err)
        return redirect
    }
	
} 


