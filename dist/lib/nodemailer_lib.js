"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.send_email_verification = void 0;
const nodemailer = __importStar(require("nodemailer"));
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'chadrick.rath0@ethereal.email',
        pass: 'xe8kY6Y44aM9xbCqKj'
    }
});
function send_email_verification(to_email, content) {
    return new Promise((resolve) => {
        console.log("Started sending email");
        try {
            const email_regex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
            if (!email_regex.test(to_email))
                resolve(false);
            console.log("Verified email");
            transporter.sendMail({
                from: "test@gmail.com",
                to: to_email,
                subject: "Please confirm your E-mail!",
                text: content,
            }, (err) => {
                console.log(err);
                if (err)
                    resolve(false);
                resolve(true);
            });
        }
        catch (err) {
            resolve(false);
        }
    });
}
exports.send_email_verification = send_email_verification;
