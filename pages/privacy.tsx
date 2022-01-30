import React, {useEffect} from 'react';
import Footer from '../components/footer';
import Image from "next/image"
import WaveSvg from "../public/images/wave.svg"
import { Qick_legal_navigation } from './tos';

export default function Privacy_policy() {
    //Setting numbers for headers
    useEffect(() => {
        const section_headers = document.getElementsByClassName("section_header") as HTMLCollection

        const headers_arr = Array.from(section_headers)

        for(let i = 0; i < headers_arr.length; i++) {
            const headers = headers_arr as HTMLHeadElement[]
            headers[i].innerText = `${i + 1}. ${headers[i].innerText}`
        }
       
    }, [])


    return (
        <div className='tos_page'>
            
            <div className='content'>
                <div className='legal_content_container'>
                    <section>
                        <h1 className='tos_header'>{`PRIVACY POLICY`}</h1>
                        <h4 className='tos_update_date'>{`Last updated: 30/01/2022`}</h4>
                    </section>
                    
                    <Introduction/>
                    <Children_under_age_of_13/>
                    <Information_we_collect_and_how_we_collect_it/>
                    <Information_you_provide_to_us/>
                    <Automatic_information_collection_and_tracking/>
                    <Information_collection_and_tracking_technologies/>
                    <Third_party_information_collection/>
                    <How_we_use_your_information/>
                    <Disclosure_of_your_information/>
                    <Data_security/>
                    <Changes_to_our_privacy_policy/>
                    <section>
                        <h1>Contact Me</h1>

                        <p>Dont hesitate to contact me if you have any questions Via Email:</p>
                        <a href={`mailto: arctale.work@gmail.com`}>{"Arctale.work@gmail.com"}</a>
                    </section>
                </div>
                <Qick_legal_navigation/>
            </div>
            <Footer />
        </div>
    );
}


function Introduction() {
    return(
        <section>
            <h1> {`Introduction`} </h1>


            <p>{`We at Spritearc.com. (“Company”, “We”, or “Spritearc.com”) respect your privacy and are committed to protecting it through our compliance with this policy. This policy describes the types of information we may collect or that you may provide when you purchase, download, install, register with, access, or use the Spritearc.com application (the “App”) or website (the “Website” and collectively with the App, the “Service”). The policy also describes our practices for collecting, using, maintaining, protecting, and disclosing that information.
                We utilize payment processors who have their own privacy policies, which we encourage you to read their privacy policies before providing information on or through them.
                Please read this policy carefully to understand our policies and practices regarding your information and how we will treat your information. If you do not agree with our policies and practices, please do not download, register with, or use this Service. By downloading, registering with, or using this Service, you agree to this privacy policy. This policy may change from time to time, with updates appearing on the Website and on the App. Your continued use of this Service after we make changes is deemed to be acceptance of those changes, so please check the policy periodically for updates.`}</p>
        </section>
    )
}
function Children_under_age_of_13() {
    return(
        <section>
            <h1 className='section_header'> {`Children Under the Age of 13`} </h1>

            <div className='tos_summary'>
                <h2>{"Summary: "}</h2>
                <p>
                    {`We dont collect data from users under the age of 13. You are not eglible to use our service if you are under the age of 13.`}
                </p>
            </div>

            <p>{`The Service is not intended for children under 13 years of age, and we do not knowingly collect personal information from children under 13. If we learn we have collected or received personal information from a child under 13 without verification of parental consent, we will delete that information. If you believe we might have any information from or about a child under 13, please contact us at arctale.work@gmail.com.`}</p>
        </section>
    )
}
function Information_we_collect_and_how_we_collect_it() {
    return(
        <section>
            <h1 className='section_header'>{`Information We Collect and How We Collect It`}</h1>


            <p>{`We collect information from and about users of our Service:`}</p>

            <ul>
                <li>
                    {`Directly from you when you provide it to us.`}
                </li>

                <li>
                    {`Automatically when you use certain parts of the Service.`}
                </li>
            </ul>
        </section>
    )
}
function Information_you_provide_to_us() {
    return(
        <section>
            <h1 className='section_header'> {`Information You Provide to Us`} </h1>


            <p>{`When you download, register with, or use this Service, we may ask you provide information:`}</p>

            <ul>
                <li>
                    {`By which you may be personally identified, such as your name, postal address, email address, telephone number, payment service provider account information, and any other identifier by which you may be contacted online or offline (“Personal Information”).`}
                </li>

                <li>
                    {`Information that you provide by filling in forms in the Service. This includes information provided at the time of registering to use the Service, posting material, comments or content, and if you request further services from Spritearc.com. We may also ask you for information when you enter a contest or promotion sponsored by us, and when you report a problem with the Service.`}
                </li>

                <li>
                    {`Records and copies of your correspondence (including email addresses and/or phone numbers), if you contact us.`}
                </li>

                <li>
                    {`Your responses to surveys that we might ask you to complete for research purposes.`}
                </li>

                <li>
                    {`Details of transactions you carry out through the Service and of the fulfillment of your orders. You may be required to provide financial information with a payment service provider before placing an order through the Service. We only hold onto a portion of your payment information for fraud detection purposes.`}
                </li>
            </ul>

            <p>{`You may provide information to be published or displayed (“Posted”) on public areas of our Service (collectively, “User Contributions”). Your User Contributions are Posted and transmitted to others at your own risk. Although you may set certain privacy settings for such information by logging into your account profile, please be aware that no security measures are perfect or impenetrable. Additionally, we cannot control the actions of third parties with whom you may choose to share your User Contributions or view on the Service.`}</p>
        </section>
    )
}
function Automatic_information_collection_and_tracking() {
    return(
        <section>
            <h1 className='section_header'> {`Automatic Information Collection and Tracking`} </h1>

            <p>{`When you download, access, and use the Service, it may use technology to automatically collect:`}</p>

            <ul>
                <li>
                    <b>{`Usage Details. `}</b>
                    {`When you access and use the Service, we may automatically collect certain details of your access to and use of the Service, including traffic data, location data, logs, and other communication data and the resources that you access and use on or through the Service.`}
                </li>

                <li>
                    <b>{`Device Information. `}</b>
                    {`We may collect information about your accessing device and internet connection, including the user’s IP address, and browser type.`}
                </li>

            </ul>

        </section>
    )
}
function Information_collection_and_tracking_technologies() {
    return(
        <section>
            <h1 className='section_header'> {`Information Collection and Tracking Technologies`} </h1>

            <p> {`The technologies we use for automatic information collection may include:`} </p>

            <ul>
                <li>
                    <b>{`Cookies. `}</b>
                    {`A cookie is a small file placed on your device. It may be possible to refuse to accept cookies by activating the appropriate setting on your device. However, if you select this setting you may be unable to access certain parts of our Service. We utilize Google Analytics in our data collection.`}
                </li>

                <li>
                    <b>{`Web Beacons `}</b>
                    {`Pages of the Service and our emails may contain small electronic files known as web beacons (also referred to as clear gifs, pixel tags, and single-pixel gifs) that permit Spritearc.com, for example, to count users who have visited those pages or opened an email and for other related Service statistics (for example, recording the popularity of certain app content and verifying system and server integrity).`}
                </li>

            </ul>

        </section>
    )
}
function Third_party_information_collection() {
    return(
        <section>
            <h1 className='section_header'> {`Third Party Information Collection`} </h1>

            <div className='tos_summary'>
                <h2>{"Summary: "}</h2>
                <p>
                    {`We might collect data automaticly for services like Google analytics etc.`}
                </p>
            </div>

            <p> {`When you use the Service or its content, certain third parties may use automatic information collection technologies to collect information about you. These third parties may include:`} </p>

            <ul>
                <li>
                    {`Social media services like Twitter, Twitch, or Facebook, when you link your accounts to Spritearc.com.`}
                </li>

                <li>
                    {`Analytics companies like Google Analytics.`}
                </li>

                <li>
                    {`Payment providers like Stripe and PayPal.`}
                </li>

            </ul>

            <p>{`These third parties may use tracking technologies to collect information about you when you use this Service. The information they collect may be associated with your Personal Information or they may collect information, including Personal Information, about your online activities over time and across different websites, apps, and other online services websites. They might use this information to provide you with interest-based (behavioral) advertising or other targeted content.`}</p>
            <br />
            <p>{`We do not control these third parties’ tracking technologies or how they may be used. If you have any questions about an advertisement or other targeted content, you should contact the responsible provider directly.`}</p>
        </section>
    )
}
function How_we_use_your_information() {
    return(
        <section>
            <h1 className='section_header'> {`How We Use Your Information`} </h1>

            <p> {`We use information that we collect about you or that you provide to us, including any Personal Information, to:`} </p>

            <ul>
                <li>
                    {`Provide you with the Service and its contents, and any other information, products or services that you request from us.`}
                </li>

                <li>
                    {`Fulfill any other purpose for which you provide it.`}
                </li>

                <li>
                    {`Give you notices about your account.`}
                </li>

                <li>
                    {`Notify you when Service updates are available, and of changes to any products or services we offer or provide though it.`}
                </li>

                <li>
                    {`Improve our Service experience and efficiency.`}
                </li>

            </ul>

            <p>{`The usage information we collect helps us to improve our Service and to deliver a better and more personalized experience by enabling us to:`}</p>
            <ul>
                <li>
                    {`Estimate our audience size and usage patterns.`}
                </li>

                <li>
                    {`Store information about your preferences, allowing us to customize our Service according to your individual interests.`}
                </li>

                <li>
                    {`Recognize you when you use the Service`}
                </li>

                <li>
                    {`Notify you when Service updates are available, and of changes to any products or services we offer or provide though it.`}
                </li>

                <li>
                    {`Improve our Service experience and efficiency.`}
                </li>

            </ul>
        
        </section>
    )
}
function Disclosure_of_your_information() {
    return(
        <section>
            <h1 className='section_header'>{`Disclosure of Your Information`}</h1>

            <p>{`We do not intend to sell or market your Personal Information, however, through providing the Service we may disclose aggregated information about our users in order to deliver the Service, including for the following:`}</p>

            <ul>
                <li>
                    {`To contractors, service providers, and other third parties we use to support our business, and who are bound by contractual obligations to keep Personal Information confidential and use it only for the purposes for which we disclose it to them.`}
                </li>

                <li>
                    {`To a buyer or other successor in the event of a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of Spritearc.com’s assets, whether as a going concern or as part of bankruptcy, liquidation, or similar proceeding, in which Personal Information held by Spritearc.com about our Service users is among the assets transferred.`}
                </li>

                <li>
                    {`To fulfill the purpose for which you provide it (For example, if you give us a social media account handle to use social sharing features of our Service, we will transmit the contents of that request to the recipients.).`}
                </li>

                <li>
                    {`For any other purpose disclosed by us when you provide the information.`}
                </li>

                <li>
                    {`With your consent.`}
                </li>

                <li>
                    {`To comply with any court order, law, or legal process, including to respond to any government or regulatory request.`}
                </li>

                <li>
                    {`To enforce our rights arising from any contracts entered into between you and us, including the Spritearc.com Terms of Service, and for billing and collection.`}
                </li>

                <li>
                    {`If we believe disclosure is necessary or appropriate to protect the rights, property, or safety of Spritearc.com, our customers or others. This includes exchanging information with other companies and organizations for the purposes of fraud protection and credit risk reduction.`}
                </li>

            </ul>

        </section>
    )
}
function Data_security() {
    return(
        <section>
            <h1 className='section_header'> {`Data Security`} </h1>

            <div className='tos_summary'>
                <h2>{"Summary: "}</h2>
                <p>
                    {`We do use latest technologies to protect your data. But even that might not be always 100% secure. Please be aware of that.`}
                </p>
            </div>

            <p>{`We have implemented measures designed to secure your Personal Information from accidental loss and from unauthorized access, use, alteration, and disclosure. All information you provide to us is stored on our secure servers behind firewalls. Any payment transactions will be encrypted using SSL technology.`}</p>
            <br />
            <p>{`The safety and security of your information also depends on you. Where you have chosen a password for access to certain parts of our Service, you are responsible for keeping this password confidential. We ask you not to share your password with anyone. Please be careful about giving out information in public areas of the Service, like comment sections. The information you share in public areas may be viewed by any user of the Service.`}</p>
            <br />
            <p>{`Unfortunately, the transmission of information via the internet and mobile platforms is not completely secure. Although we try to protect your Personal Information, we cannot guarantee the security of your Personal Information transmitted through our Service. Any transmission of Personal Information is at your own risk. We are not responsible for circumvention of any privacy settings or security measures we provide.`}</p>

        </section>
    )
}
function Changes_to_our_privacy_policy() {
    return(
        <section>
            <h1 className='section_header'>{`Changes to Our Privacy Policy`}</h1>

            <p>{`We may update our privacy policy from time to time. If we make material changes to how we treat our users’ Personal Information, we will post the new privacy policy on this page with a notice that the privacy policy has been updated and notify you by email specified in your account and an in-app alert the first time you use the Service after we make the change.`}</p>
            <br />
            <p>{`The date the privacy policy was last revised is identified at the top of the page. You are responsible for ensuring we have an up-to-date active and deliverable email address for you and for periodically visiting this privacy policy to check for any changes.`}</p>

        </section>
    )
}