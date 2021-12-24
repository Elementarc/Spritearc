import nodemailer from "nodemailer"
const ACCOUNT = process.env.EMAIL
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'corine.jaskolski49@ethereal.email',
        pass: 'KcZSJ3mDuFXTSPdr8D'
    }
});


export function send_email_verification(to_email: string, content: string): Promise<boolean> {
    return new Promise((resolve) => {
        const email_regex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)

        if(!email_regex.test(to_email)) resolve(false)
        
        transporter.sendMail({
    
            from: "test@gmail.com", // sender address
            to: to_email, // list of receivers
            subject: "Please confirm your E-mail!", // Subject line
            text: content, // plain text body
    
        }, (err: any, info: any) => {
            console.log("test")
            if(err) throw err
            
        }); 
        
        resolve(true)
    })
    
}