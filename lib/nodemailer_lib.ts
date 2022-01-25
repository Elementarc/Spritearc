import * as nodemailer from "nodemailer"
import logger from "./logger"
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'chadrick.rath0@ethereal.email',
        pass: 'xe8kY6Y44aM9xbCqKj'
    }
});


export function send_email_verification(to_email: string, content: string): Promise<boolean> {

    return new Promise((resolve, reject) => {
        
        try {
            const email_regex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
        
            if(!email_regex.test(to_email)) resolve(false)
            logger.info("Sending email")
            transporter.sendMail({
        
                from: "test@gmail.com", // sender address
                to: to_email, // list of receivers
                subject: "Please confirm your E-mail!", // Subject line
                text: content, // plain text body
        
            }, (err: any) => {
                if(err) return reject(err)

                resolve(true)
            }); 
        } catch(err) {
            logger.error(err)
            resolve(false)
        }
        
        
    })
    
}