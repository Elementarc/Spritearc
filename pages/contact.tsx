import React, {useEffect} from 'react';
import Footer from '../components/footer';
import Image from "next/image"
import WaveSvg from "../public/images/wave.svg"
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Terms_of_service() {
    


    return (
        <div className='tos_page'>
            
            <div className='content'>
                <div className='legal_content_container'>
                    <section>
                        <h1 className='tos_header'>CONTACT ME</h1>
                    </section>

                    <section>
                        <h1>Details</h1>
                        <br />
                        <p>Spritearc.com</p>
                        <p>Hamit Kiziltas</p>
                        <p>Obere Str. 19</p>
                        <p>74369 Löchgau</p>
                        <p>Germany</p>
                        <br />
                        <p>Dont hesitate to contact me if you have any questions Via Email:</p>
                        <a href={`mailto: arctale.work@gmail.com`}>{"Arctale.work@gmail.com"}</a>
                        
                    </section>
                </div>
                <Qick_legal_navigation />
            </div>
            <Footer />
        </div>
    );
}

export function Qick_legal_navigation() {
    const router = useRouter()
    const pathname = router.pathname.toLowerCase()

    return (
        <div className='legal_navigation_container'>
            <h1>Quick Legal Navigation: </h1>
            <ul>
                    
                <li>
                    <Link href={`/tos`} scroll={false}>Terms Of Service</Link>
                </li>
                
                    
                <li>
                    <Link href={`/privacy`} scroll={false}>Privacy Policy</Link>
                </li>
                
                    
                <li>
                    <Link href={`/cookies`} scroll={false}>Cookies</Link>
                </li>

                    
                <li>
                    <Link href={`/contact`} scroll={false}>Contact</Link>
                </li>
                
            </ul>
        </div>
    );
}

function Users_and_publishers() {
    return(
        <section>
            <h1 className='section_header'>{`Users and Publishers`}</h1>

            <div className='tos_summary'>
                <h2>{"Summary: "}</h2>
                <p>
                    {`If you download projects, you’re a User. If you upload projects, you’re a Publisher. Users must be 13 or older. Publishers must be at least 18 or have the legal right to enter into this agreement.`}
                </p>
            </div>

            <ul>
                <li>
                    {`Users. If you register an account to purchase, download, or play games or other content from Spritearc.com, you agree to be bound to the terms of this Agreement as a platform user (“User”). Users affirm that they are over the age of 13, as the Service is not intended for children under 13.`}
                </li>

                <li>
                    {`Publishers. If you register an account to sell, distribute, or publish games or other content on Spritearc.com, you agree to be bound to the terms of this Agreement as a platform publisher (“Publisher”). Publishers affirm that they are either more than 18 years of age, or possess legal parental or guardian consent, and are fully able and competent to enter into the terms, conditions, obligations, affirmations, representations and warranties set forth in this Agreement.`}
                </li>
            </ul>
        </section>
    )
}

function Acceptable_use() {
    return(
        <section>
            <h1 className='section_header'>{`Acceptable Use`}</h1>

            <div className='tos_summary'>
                <h2>{"Summary: "}</h2>
                <p>{`Be excellent to each other! If you misbehave we may terminate your account.`}</p>
            </div>

            <p>{`Spritearc aims to create a safe environment for users of the site and service. This requires a community that is built on goodwill and responsible behavior by its members. The posting of content or other actions that, in the Company’s sole discretion, degrades the experience of others may result in account termination without prior notice. Prohibited actions include but are not limited to:`}</p>
            
            <ul>
                <li>
                    {`Uploading viruses or malicious code or acting in any manner to restrict or inhibit any other user from using and enjoying the Service.`} 
                </li>

                <li>
                    {`Spamming or sending repeated messages, junk email, contests, surveys or any unsolicited messages.`}
                </li>

                <li>
                    {`Posting unlawful, misleading, malicious, or discriminatory content.`}
                </li>

                <li>
                    {`Bullying, intimidating, harassing, defaming, threatening others, or violating the legal rights (such as rights of privacy and publicity) of others.`}
                </li>

                <li>
                    {`Posting content that promotes or participates in racial intolerance, sexism, hate crimes, hate speech, or intolerance to any group of individuals.`}
                </li>

                <li>
                    {`Soliciting, harvesting or collecting information about others.`}
                </li>

                <li>
                    {`Violating copyright, trademark or other intellectual property or other legal rights of others by posting content without permission to distribute such content.`}
                </li>

                <li>
                    {`Hacking, maliciously manipulating, or misrepresenting Spritearc’s interface in any way.`}
                </li>

                <li>
                    {`Creating a false identity for the purpose or effect of misleading others.`}
                </li>

                <li>
                    {`Violating any applicable laws or regulations`}
                </li>
            </ul>
        </section>
    )
}

function Publisher_content() {
    return(
        <section>
            <h1 className='section_header'>{`Publisher Content`}</h1>

            <div className='tos_summary'>
                <h2>{"Summary: "}</h2>
                <p> {`You allow us to promote your screenshots, cover-images, videos, and other promotional material you have provided. You affirm that you have the right to upload and sell your content, and that Spritearc.com and its users can use and/or purchase your content without violating anybody else’s rights.`} </p>
            </div>

            <p>
                {`Publishers are solely responsible for the content they upload and distribute on Spritearc.com. Publishers affirm, represent, and warrant that they own or have the rights, licenses, permissions and consents necessary to publish, duplicate, and distribute the submitted content. By submitting content to the Service for distribution, Publishers also grant a license to the Company for all patent, trademark, trade secret, copyright or other proprietary rights in and to the Content for publication on the Service, pursuant to this Agreement. The Company does not endorse copyright infringing activities or other intellectual property infringing activities and violations of may result in the removal of content if the Company is notified of such violations. Removal and termination of accounts may occur without prior notice. Publishers retain all ownership rights to the submitted content, and by submitting content to the Service, Publishers hereby grant the following:`}
            </p>

            <ul>
                <li>
                    {`To the Company, a worldwide, non-exclusive, royalty-free, sublicensable and transferable license to use, reproduce, distribute, prepare derivative works of, display, and perform the content in connection with the Service, including without limitation for promoting, redistributing in any and all media formats. If you choose to remove your content from the Service, this license shall terminate within a commercially reasonable time after you remove your content from the Service.`}                
                </li>
                
                <li>
                    {`To Users, a non-exclusive, perpetual license to access the content and to use, reproduce, distribute, display and perform such content as permitted through the functionality of the Service. Users shall retain a license to this content even after the content is removed from the Service.`}
                </li>
            </ul>
        </section>
    )
}

function User_generated_content() {
    return(
        <section>
            <h1 className='section_header'>{`User Generated Content`}</h1>

            <div className='tos_summary'>
                <h2>{"Summary: "}</h2>
                <p>
                    {`You agree to let us display content you have uploaded to your profile, written in a comment, left in a review, etc. If you terminate your account you can request to have your content deleted.`}
                </p>
            </div>

            <p>
                {`Spritearc.com provides interfaces and tools for Users to generate content and make it available to other users, including ratings, reviews, profile images, banners, and others (“User Generated Content” or “UGC”). By uploading or creating such UGC, you grant to Company the worldwide, non-exclusive, perpetual, royalty free license to use, reproduce, create derivative works, display, perform and distribute for the UGC.`}
            </p>
        </section>
    )
}

function General_Terms() {
    return(
        <section>
            <h1>{`General Terms`}</h1>
            <p>{`By accessing and placing an order with Spritearc, you confirm that you are in agreement with and bound by the terms of service contained in the Terms & Conditions outlined below. These terms apply to the entire website and any email or other type of communication between you and Spritearc. Under no circumstances shall Spritearc team be liable for any direct, indirect, special, incidental or consequential damages, including, but not limited to, loss of data or profit, arising out of the use, or the inability to use, the materials on this site, even if Spritearc team or an authorized representative has been advised of the possibility of such damages. If your use of materials from this site results in the need for servicing, repair or correction of equipment or data, you assume any costs thereof 4. Spritearc will not be responsible for any outcome that may occur during the course of usage of our resources. We reserve the rights to change prices and revise the resources usage policy in any moment.`}</p>
        </section>
    )
}

function License() {
    return(
        <section>
            <h1>{`License`}</h1>
            <p>{`Spritearc grants you a revocable, non-exclusive, non transferable, limited license to download, install and use the website strictly in accordance with the terms of this Agreement. These Terms & Conditions are a contract between you and Spritearc (we," "our" or "us") grants you a revocabile, non-exclusive, non-transferable limited license to download, install and use the website strictly in accordance with the terms of this Agreement`}</p>
        </section>
    )
}

function Definitions_and_key_terms() {
    return(
        <section>
            <h1 className='section_header'> {`Definitions and key terms`} </h1>

            <div className='tos_summary'>
                <h2>{"Summary: "}</h2>
                <p>
                    {`Key terms that we're using througout this whole Terms Of Service.`}
                </p>
            </div>

            <p>{"For this Terms & Conditions:"}</p>
            <ul>
                <li>
                    <b>{`Cookie: `}</b> 
                    {`small amount of data generated by a website and saved by your web browser It is used to identify your browser, provide analytics, remember information about you such as your language preference or login information.`}                    
                </li>

                <li>
                    <b>{`Company: `}</b>
                    {`when this policy mentions Company "we" us," or "our" it refers to Spritearc that is responsible for your information under this Privacy Policy.`}
                </li>

                <li>
                    <b> {`Country: `} </b>
                    {`where Spritearc or the owners/founders of Spritearc are based in this case is Germany.`}
                </li>
                
                <li>
                    <b> {`Customer:`} </b>
                    {`refers to the company, organization or person that signs up to use the Spritearc Service to manage the relationships with your consumers or service users.`}
                </li>

                <li>
                    <b> {`Device: `} </b>
                    {`any internet connected device such as a phone, tablet, computer or any other device that can be used to visit Spritearc.`}
                </li>

                <li>
                    <b>{`IP address: `}</b>
                    {`Every device connected to the Internet is assigned a number known as an Internet protocol (IP) address. These numbers are usually assigned in geographic blocks An IP address can often be used to identify the location from which a device is connecting to the Internet.`}
                </li>

                <li>
                    <b> {`Personnel: `} </b>
                    {`refers to those individuals who are employed by Spritearc or are under contract to perform a service on behalf one of the parties.`}
                </li>

                <li>
                    <b> {`Personal Data: `} </b>
                    {`any information that directly, indirectly, or in connection with other information including a personal identification number-allows for the identification or identifiability of a natural person`}
                </li>

                <li>
                    <b> {`Service: `} </b>
                    {`refers to the service provided by Spritearc as described in the relative terms of available) and on this platform.`}
                </li>

                <li>
                    <b> {`Third-party service: `} </b>
                    {`refers to advertisers, contest sponsors, promotional and marketing partners, and others who provide our content or whose products or services we think may interest you.`}
                </li>

                <li>
                    <b> {`Website: `} </b>
                    {`Spritearc's site, which can be accessed via this URL, Spritearc.com`}
                </li>

                <li>
                    <b> {`You: `} </b>
                    {`a person or entity that is registered with Spritearc to use the Services.`}
                </li>
            </ul>
        </section>
    )
}

function Restrictions() {
    return(
        <section>
            <h1>{`Restrictions`}</h1>
            <p>{`You agree not to, and you will not permit others to: License, sell, rent, lease, assign, distribute, transmit, host, outsource, disclose or otherwise commercially exploit the service or make the platform available to any third party Modify, make derivative works of disassemble, decrypt, reverse compile or reverse engineer any part of the service Remove, alter or obscure any proprietary notice (including any notice of copyright or trademark) of or its affiliates, partners, suppliers or the licensors of the service.`}</p>
        </section>
    )
}

function Return_and_refund_policy() {
    return(
        <section>
            <h1>{`Return and refund policy`}</h1>
            <p>{`Thanks for shopping with us. We appreciate the fact that you like to buy the stuff we build We also want to make sure you have a rewarding experience while you're exploring, evaluating, and purchasing our products As with any shopping experience, there are terms and conditions that apply to transactions at our company We'll be as brief as our attomeys will allow. The main thing to remember is that by placing an order or making a purchase from us, you agree to the terms along with our Privacy Policy. If, for any reason, You are not completely satisfied with any good or service that we provide, don't hesitate to contact us and we will discuss any of the issues you are going through with our product`}</p>
        </section>
    )
}

function Your_suggestions() {
    return(
        <section>
            <h1 className='section_header'>{`Your suggestions`}</h1>

            <div className='tos_summary'>
                <h2>{"Summary: "}</h2>
                <p>
                    {`We are allowed to use your suggestions for free and modify it without your consent.`}
                </p>
            </div>

            <p>
                {`Any feedback, comments, ideas, improvements or suggestions (collectively, "Suggestions") provided by you to us with respect to the service shall remain the sole and exclusive property of us. We shall be free to use, copy, modify publish, or redistribute the Suggestions for any purpose and in any way without any credit or any compensation to you.`}
            </p>
        </section>
    )
}

function Your_consent() {
    return(
        <section>
            <h1 className='section_header'>{`Your Consent`}</h1>
            <p>{"We've updated our Terms & Conditions to provide you with complete transparency into what is being set when you visit our site and how it's being used. By using our service, registering an account, or making a purchase, you hereby consent to our Terms & Conditions"}
            </p>
        </section>
    )
}

function Links_to_other_websites() {
    return(
        <section>
            <h1 className='section_header'>{`Links to Other Websites`}</h1>
            <p>{"Our service may contain links to other websites that are not operated by Us If You click on a third party link, You will be directed to that third party's site. We strongly advise You to review the Terms & Conditions of every site You visit. We have no control over and assume no responsibility for the content, Terms & Conditions or practices of any third party sites or services"}
            </p>
        </section>
    )
}

function Cookies() {
    return(
        <section>
            <h1 className='section_header'>{`Cookies`}</h1>
            <p>
                {`We use "Cookies" to identify the areas of our website that you have visited A Cookie is a small piece of data stored on your computer or mobile device by your web browser We use Cookies to enhance the performance and functionality of our service but are non essential to their use. However, without these cookies, certain functionality like videos may become unavailable or you would be required to enter your login details every time you visit our platform as we would not be able to remember that you had logged in previously. Most web browsers can be set to disable the use of Cookies. However, if you disable Cookies, you may not be able to access functionality on our website correctly or at all. We never place Personally identifiable information in Cookies`}
            </p>
        </section>
    )
}

function Changes_to_our_tos() {
    return(
        <section>
            <h1 className='section_header'>{`Changes To Our Terms & Conditions`}</h1>
            <p>{"You acknowledge and agree that we may stop (permanently or temporarily) providing the Service (or any features within the Service) to you or to users generally at our sole discretion, without prior notice to you. You may stop using the Service at any time. You do not need to specifically inform us when you stop using the Service. You acknowledge and agree that if we disable access to your account, you may be prevented from accessing the Service, your account details or any files or other materials which is contained in your account If we decide to change our Terms & Conditions, we will post those changes on this page, and/or update the Terms & Conditions modification date below."}
            </p>
        </section>
    )
}

function Modifications_to_our_service() {
    return(
        <section>
            <h1 className='section_header'>{`Modifications to Our service`}</h1>
            <p>
               {`We reserve the right to modify, suspend or discontinue, temporarily or permanently, the service or any service to which it connects, with or without notice and without liability to you.`} 
            </p>
        </section>
    )
}

function Updates_to_our_service() {
    return(
        <section>
            <h1 className='section_header'>{`Updates to Our service`}</h1>
            <p>
                {`We may from time to time provide enhancements or improvements to the features/ functionality of the service, which may include patches bug fixes, updates, upgrades and other modifications (Updates") Updates may modify or delete certain features and/or functionalities of the service You agree that we have no obligation to () provide any Updates, or (u) continue to provide or enable any particular features and/or functionalities of the service to you You further agree that all Updates will be (0) deemed to constitute an integral part of the service, and (i) subject to the terms and conditions of this Agreement.`}
            </p>
        </section>
    )
}

function Third_party_services() {
    return(
        <section>
            <h1 className='section_header'>{`Third-Party Services`}</h1>
            <p>
                {`We may display, include or make available third-party content (including data, information, applications and other products services) or provide links to third-party websites or services ("Third-Party Services"). You acknowledge and agree that we shall not be responsible for any Third Party Services, including their accuracy, completeness, timeliness, validity, copyright compliance, legality, decency, quality or any other aspect thereof We do not assume and shall not have any liability or responsibility to you or any other person or entity for any Third-Party Services Third-Party Services and links thereto are provided solely as a convenience to you and you access and use them entirely at your own risk and subject to such third parties' terms and conditions.`}
            </p>
        </section>
    )
}

function Term_and_termination() {
    return(
        <section>
            <h1 className='section_header'>{`Term and Termination`}</h1>
            <p>
                {`This Agreement shall remain in effect until terminated by you or us. We may, in its sole discretion, at any time and for any or no reason, suspend or terminate this Agreement with or without prior notice. This Agreement will terminate immediately, without prior notice from us in the event that you fail to comply with any provision of this Agreement You may also terminate this Agreement by deleting the service and all copies thereof from your computer Upon termination of this Agreement, you shall cease all use of the service and delete all copies of the service from your computer Termination of this Agreement will not limit any of our rights or remedies at law or in equity in case of breach by you (during the term of this Agreement) of any of your obligations under the present Agreement.`}
            </p>
        </section>
    )
}

function Copyright_infringement_notice() {
    return(
        <section>
            <h1 className='section_header'>{`Copyright Infringement Notice`}</h1>
            <p>
                {`if you are a copyright owner or such owner's agent and believe any material from us constitutes an infringement on your copyright, please contact us setting forth the following information (a) a physical or electronic signature of the copyright owner or a person authorized to act on his behalf; (b) identification of the material that is claimed to be infringing; (c) your contact information, including your address, telephone number, and an email, (d) a statement by you that you have a good faith belief that use of the material is not authorized by the copyright owners, and (e) the a statement that the information in the notification is accurate, and, under penalty of perjury you are authorized to act on behalf of the owner.`}
            </p>
        </section>
    )
}

function Indemnification() {
    return(
        <section>
            <h1 className='section_header'>{`Indemnification`}</h1>
            <p>
                {`You agree to indemnity and hold us and our parents, subsidiaries, affiliates, officers, employees, agents, partners and licensors (if any) harmless from any claim or demand, including reasonable attorneys' fees, due to or arising out of your (a) use of the service; (b) violation of this Agreement or any law or regulation, or (c) violation of any right of a third party.`}
            </p>
        </section>
    )
}

function No_warranties() {
    return(
        <section>
            <h1 className='section_header'>{`No Warranties`}</h1>
            <p>
                {`The service is provided to you "AS IS" and "AS AVAILABLE" and with all faults and defects without warranty of any kind. To the maximum extent permitted under applicable law, we, on our own behalf and on behalf of our affiliates and our respective licensors and service providers, expressly disclaims all warranties, whether express, implied, statutory or otherwise, with respect to the service, including all implied warranties of merchantability, fitness for a particular purpose, title and non- infringement, and warranties that may arise out of course of dealing, course of performance, usage or trade practice. Without limitation to the foregoing, we provide no warranty or undertaking, and makes no representation of any kind that the service will meet your requirements, achieve any intended results, be compatible or work with any other software, websites, systems or services, operate without interruption, meet any performance or reliability standards or be error free or that any errors or defects can or will be corrected Without limiting the foregoing, neither us nor any provider makes any representation or warranty of any kind, express or implied. (1) as to the operation or availability of the service or the information, content, and materials or products included thereon (i) that the service will be uninterrupted or error-free, () as to the accuracy, reliability or currency of any information or content provided through the service; or (iv) that the service, its servers, the content, or e mails sent from or on behalf of us are free of viruses, scripts, trojan horses, worms, malware timebombs or other harmful components Some jurisdictions do not allow the exclusion of or limitations on t implied warranties or the limitations on the applicable statutory rights of a consumer, so some or all of the above exclusions and limitations may not apply to you`}
            </p>
        </section>
    )
}

function Limitation_of_liability() {
    return(
        <section>
            <h1 className='section_header'>{`Limitation of Liability`}</h1>
            <p>
                {`Notwithstanding any damages that you might incur, the entire liability of us and any of our suppliers under any provision of this Agreement and your exclusive remedy for all of the foregoing shall be limited to the amount actually paid by you for the service To the maximum extent permitted by applicable law, in no event shall we or our suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever (including, but not limited to, damages for loss of profits, for loss of data or other information, for business interruption, for personal injury, for loss of privacy arising out of or in any way related to the use of or inability to use the service, third-party software and/or third-party hardware used with the service, or otherwise in connection with any provision of this Agreement), even if we or any supplier has been advised of the possibility of such damages and even if the remedy fails of its essential purpose Some states/jurisdictions do not allow the exclusion or limitation of incidental or consequential damages, so the above limitation or exclusion may not apply to you.`}
            </p>
        </section>
    )
}

function Waiver() {
    return(
        <section>
            <h1 className='section_header'>{`Waiver`}</h1>
            <p>
                {`Except as provided herein, the failure to exercise a night or to require performance of an obligation under this Agreement shall not effect a party's ability to exercise such right or require such performance at any time thereafter nor shall be the waiver of a breach constitute waiver of any subsequent breach No failure to exercise, and no delay in exercising, on the part of either party, any right or any power under this Agreement shall operate as a waiver of that right or power. Nor shall any single or partial exercise of any right or power under this Agreement preclude: further exercise of that or any other right granted herein. In the event of a conflict between this Agreement and any applicable purchase or other terms, the terms of this Agreement shall govern.`}
            </p>
        </section>
    )
}

function Amendments_to_this_agreement() {
    return(
        <section>
            <h1 className='section_header'>{`Amendments to this Agreement`}</h1>
            <p>
                {`We reserve the right, at its sole discretion, to modify or replace this Agreement at any time If a revision is material we will provide at least 30 days' notice prior to any new terms taking effect What constitutes a material change will be determined at our sole discretion. By continuing to access or use our service after any revisions become effective, you agree to be bound by the revised terms If you do not agree to the new terms, you are no longer authorized to use our service.`}
            </p>
        </section>
    )
}

function Entire_agreement() {
    return(
        <section>
            <h1 className='section_header'>{`Entire Agreement`}</h1>
            <p>
                {`The Agreement constitutes the entire agreement between you and us regarding your use of the service and supersedes all prior and contemporaneous written or oral agreements between you and us. You may be subject to additional terms and conditions that apply when you use or purchase other services from us, which we will provide to you at the time of such use or purchase.`}
            </p>
        </section>
    )
}

function Updates_to_our_terms() {
    return(
        <section>
            <h1 className='section_header'>{`Updates to Our Terms`}</h1>
            <p>
                {`We may change our Service and policies, and we may need to make changes to these Terms so that they accurately reflect our Service and policies Unless otherwise required by law, we will notify you (for example, through our Service) before we make changes to these Terms and give you an opportunity to review them before they go into effect. Then, if you continue to use the Service, you will be bound by the updated Terms. If you do not want to agree to these or any updated Terms, you can delete your account.`}
            </p>
        </section>
    )
}

function Intellectual_property() {
    return(
        <section>
            <h1 className='section_header'>{`Intellectual Property`}</h1>
            <p>{"Our platform and its entire contents, features and functionality (including but not limited to all information, software, text, displays, images, video and audio, and the design, selection and arrangement thereof), are owned by us, its licensors or other providers of such material and are protected by Germany and international copyright trademark patent, trade secret and other intellectual property or proprietary nghts laws The material may not be copied modified, reproduced, downloaded or distributed in any way in whole or in part, without the express prior written permission of us, unless and except as is expressly provided in these Terms & Conditions. Any unauthorized use of the material is prohibited"}
            </p>
        </section>
    )
}

function Agreement_to_arbitrate() {
    return(
        <section>
            <h1 className='section_header'>{`Agreement to Arbitrate`}</h1>
            <p>
                {`This section applies to any dispute EXCEPT IT DOESN'T INCLUDE A DISPUTE RELATING TO CLAIMS FOR INJUNCTIVE OR EQUITABLE RELIEF REGARDING THE ENFORCEMENT OR VALIDITY OF YOUR OR 's INTELLECTUAL PROPERTY RIGHTS The term "dispute" means any dispute, action, or other controversy between you and us concerning the Services or this agreement, whether in contract, warranty, tort, statute, regulation, ordinance, or any other legal or equitable basis Dispute will be given the broadest possible meaning allowable under law.`}
            </p>
        </section>
    )
}

function Notice_of_dispute() {
    return(
        <section>
            <h1 className='section_header'>{`Notice of Dispute`}</h1>
            <p>
                {`In the event of a dispute, you or us must give the other a Notice of Dispute, which is a written statement that sets forth the name, address, and contact information of the party giving it, the facts giving rise to the dispute, and the relief requested. You must send any Notice of Dispute via email to: We will send any Notice of Dispute to you by mail to your address if we have it, or otherwise to your email address. You and us will attempt to resolve any dispute through informal negotiation within sixty (60) days from the date the Notice of Dispute is sent After sixty (60) days, you or us may commence arbitration.`}
            </p>
        </section>
    )
}

function Submissions_and_privacy() {
    return(
        <section>
            <h1 className='section_header'>{`Submissions and Privacy`}</h1>
            <p>
                {`In the event that you submit or post any ideas, creative suggestions, designs, photographs, information, advertisements, data or proposals, including ideas for new or improved products, services, features technologies or promotions, you expressly agree that such submissions will automatically be treated as non-confidential and non-proprietary and will become the sole property of us without any compensation or credit to you whatsoever. We and our affiliates shall have no obligations with respect to such submissions or posts and may use the ideas contained in such submissions or posts for any purposes in any medium in perpetuity, including, but not limited to, developing, manufacturing, and marketing products and services using such ideas.`}
            </p>
        </section>
    )
}

function Promotions() {
    return(
        <section>
            <h1 className='section_header'>{`Promotions`}</h1>
            <p>
                {`We may, from time to time, include contests, promotions, sweepstakes, or other activities ("Promotions") that require you to submit material or information concerning yourself Please note that all Promotions may be governed by separate rules that may contain certain eligibility requirements, such as restrictions as to age and geographic location. You are responsible to read all Promotions rules to determine whether or not you are eligible to participate. If you enter any Promotion, you agree to abide by and to comply with all Promotions Rules. Additional terms and conditions may apply to purchases of goods or services on or through the Services, which terms and conditions are made a part of this Agreement by this reference.`}
            </p>
        </section>
    )
}

function Typographical_errors() {
    return(
        <section>
            <h1 className='section_header'>{`Typographical Errors`}</h1>
            <p>
                {`In the event a product and/or service is listed at an incorrect price or with incorrect information due to typographical error, we shall have the right to refuse or cancel any orders placed for the product and/or service listed at the incorrect price We shall have the right to refuse or cancel any such order whether or not the order has been confirmed and your credit card charged If your credit card has already been charged for the purchase and your order is canceled, we shall immediately issue a credit to your credit card account or other payment account in the amount of the charge.`}
            </p>
        </section>
    )
}

function Miscellaneous() {
    return(
        <section>
            <h1 className='section_header'>{`Miscellaneous`}</h1>
            <p>
                {`If for any reason a court of competent jurisdiction finds any provision or portion of these Terms & Conditions to be unenforceable, the remainder of these Terms & Conditions will continue in full force and effect Any waiver of any provision of these Terms & Conditions will be effective only if in writing and signed by an authorized representative of us. We will be entitled to injunctive or other equitable relief (without the obligations of posting any bond or surety) in the event of any breach or anticipatory breach by you. We operate and control our Service from our offices in Germany The Service is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation Accordingly, those persons who choose. to access our Service from other locations do so on their own initiative and are solely responsible for compliance with local laws, if and to the extent local laws are applicable. These Terms & Conditions (which include and incorporate our Privacy Policy) contains the entire understanding, and supersedes all prior understandings, between you and us concerning its subject matter, and cannot be changed or modified by you. The section headings used in this Agreement are for convenience only and will not be given any legal import.`}
            </p>
        </section>
    )
}

function Disclaimer() {
    return(
        <section>
            <h1 className='section_header'>{`Disclaimer`}</h1>
            <p>
                {`We are not responsible for any content, code or any other imprecision. We do not provide warranties or guarantees. In no event shall we be liable for any special, direct, indirect, consequential, or incidental damages or any damages whatsoever, whether in an action of contract, negligence or other tort, arising out of or in connection with the use of the Service or the contents of the Service We reserve the right to make additions, deletions, or modifications to the contents on the Service at any time without prior notice. Our Service and its contents are provided "as is" and "as available without any warranty or representations of any kind whether express or implied. We are a distributor and not a publisher of the content supplied by third parties, as such, our exercises no editorial control over such content and makes no warranty or representation as to the accuracy, reliability or currency of any information, content, service or merchandise provided through or accessible via our Service Without limiting the foregoing, We specifically disclaim all warranties and representations in any content transmitted on or in connection with our Service or on sites that may appear as links on our Service, or in the products provided as a part of or otherwise in connection with, our Service, including without limitation any warranties of merchantability, fitness for a particular purpose or non-infringement of third party rights. No oral advice or written information given by us or any of its affiliates, employees, officers, directors, agents, or the like will create a warranty Price and availability information is subject to change without notice Without limiting the foregoing, we do not warrant that our Service will be uninterrupted, uncorrupted, timely, or error-free.`}
            </p>
        </section>
    )
}