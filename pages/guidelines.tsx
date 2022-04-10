import React, {useEffect} from 'react';
import Footer from '../components/footer';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Qick_legal_navigation from '../components/quick_legal_nav';

export default function Guidelines() {
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

            <Head>
				<title>{`Spritearc - Community Guidelines`}</title>
				<meta name="description" content={`Spritearc Community Guidelines. Read about our guidelines that makes our platform stay safe!`}/>

				<meta property="og:url" content="https://Spritearc.com/"/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content={`Spritearc - Community Guidelines`}/>
				<meta property="og:description" content={`Spritearc Community Guidelines. Read about our guidelines that makes our platform stay safe!`}/>
                <meta property="og:image" content={`${process.env.NEXT_PUBLIC_ENV === "development" ? `` : `https://${process.env.NEXT_PUBLIC_APP_NAME}.com`}/images/spritearc_wallpaper.png`}/>

				<meta name="twitter:card" content="summary_large_image"/>
				<meta property="twitter:domain" content="Spritearc.com"/>
				<meta property="twitter:url" content="https://Spritearc.com/"/>
				<meta name="twitter:title" content={`Spritearc - Community Guidelines`}/>
				<meta name="twitter:description" content={`Spritearc Community Guidelines. Read about our guidelines that makes our platform stay safe!`}/>
                <meta name="twitter:image:src" content={`${process.env.NEXT_PUBLIC_ENV === "development" ? `` : `https://${process.env.NEXT_PUBLIC_APP_NAME}.com`}/images/spritearc_wallpaper.png`}/>
            </Head>

            <div className='content'>
                <div className='legal_content_container'>
                    <section>
                        <h1 className='tos_header'>Spritearc Community Guidelines</h1>
                        <h4 className='tos_update_date'>{`Last updated: 10/04/2022`}</h4>
                    </section>
                    <General_Guidelines/>
                    <Respect_eachother/>
                    <Be_honest/>

                    <Respect_spritearc/>
                    <section>
                        <h1>Contact Me</h1>

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


function General_Guidelines() {
    return(
        <section>
            <h1>{`General Guideline`}</h1>
            <p>{`We created Spritearc to be a place where it’s easy to publish your pixel art, build relationships, and have fun hanging out. Our Community Guidelines ensure everyone finds belonging, but not at the expense of anyone else.
These guidelines explain what is and isn’t allowed on Spritearc. Everyone on Spritearc must follow these rules, and they apply to all parts of our platform, including your content, behaviors and servers. We may consider relevant off-platform behavior when assessing for violations of specific Community Guidelines.
We review reports by users, moderators and all staff members of Spritearc. When someone violates these guidelines we may take a number of enforcement steps against them including: issuing warnings; removing content; suspending or removing the accounts and/or servers responsible; and potentially reporting them to law enforcement.`}</p>
        </section>
    )
}

function Respect_eachother() {
    return(
        <section>
            <h1 className='section_header'> {`Respect Each Other`} </h1>

            <ul>
                <li>
                    <b>{`Do not harass others or organize, promote, or participate in harassment. `}</b> 
                    {`Disagreements happen and are normal, but making continuous, repetitive, or severe negative comments or circumventing a block or ban can cross the line into harassment and is not okay.`}                    
                </li>

                <li>
                    <b>{`Do not organize, promote, or participate in hate speech or hateful conduct. `}</b> 
                    {`It’s unacceptable to attack a person or a community based on attributes such as their race, ethnicity, caste, national origin, sex, gender identity, gender presentation, sexual orientation, religious affiliation, age, serious illness, disabilities, or other protected classifications.`}                    
                </li>

                <li>
                    <b>{`Do not make threats of violence or threaten to harm others. `}</b> 
                    {`This includes indirect or suggestive threats, as well as sharing or threatening to share someone’s personally identifiable information (also known as doxxing).`}                    
                </li>

                <li>
                    <b>{`Do not use Spritearc for the organization, promotion, or support of violent extremism. `}</b> 
                    {`This also includes glorifying violent events, the perpetrators of violent acts, or similar behaviors.`}                    
                </li>

                <li>
                    <b>{`Do not use, create or publish sexually suggestive content to anyone! `}</b> 
                    {`You cannot share content or links which contains sexually suggestive, or violent manner, including illustrated or digitally altered pornography that depicts children (such as lolicon, shotacon, or cub) and conduct grooming behaviors.`}                    
                </li>

                <li>
                    <b>{`Do not share content that glorifies or promotes suicide or self-harm, `}</b> 
                    {`including any encouragement to others to cut themselves or embrace eating disorders such as anorexia or bulimia.`}                    
                </li>

                <li>
                    <b>{`Do not share real media depicting gore, excessive violence, or animal harm, especially with the intention to harass or shock others.`}</b> 
                </li>

                <li>
                    <b>{`Do not share content that violates anyone's intellectual property or other rights.`}</b> 
                </li>
            </ul>
        </section>
    )
}

function Be_honest() {
    return(
        <section>
            <h1>{`Be Honest`}</h1>
            <ul>
                <li>
                    <b>{`Do not share false or misleading information (otherwise known as misinformation). `}</b> 
                    {`Content that is false, misleading, and can lead to significant risk of physical or societal harm may not be shared on Spritearc. We may remove content if we reasonably believe its spread could result in damage to physical infrastructure, injury of others, obstruction of participation in civic processes, or the endangerment of public health.`}                    
                </li>

                <li>
                    <b>{`Do not coordinate or participate in malicious impersonation of an individual or an organization. `}</b> 
                    {`Satire and parody are okay.`}                    
                </li>

                <li>
                    <b>{`Do not engage in activities intended to cause damage or gain unauthorized access to another user's account, network, or system. `}</b> 
                    {`This includes impersonating Spritearc staff, distributing malware, authentication token theft, phishing, DDOS, and other hacking or social engineering techniques.`}                    
                </li>

                <li>
                    <b>{`Do not distribute or provide access to content involving the hacking, cracking, or distribution of stolen goods, pirated content, or accounts. `}</b> 
                    {`This includes sharing or selling game cheats or hacks.`}                    
                </li>
            </ul>
        </section>
    )
}

function Respect_spritearc() {
    return(
        <section>
            <h1>{`Respect Spritarc`}</h1>
            <ul>
                <li>
                    <b>{`Do not use Spritearc to spam, manipulate engagement, or disrupt other people’s experience, `}</b> 
                    {`including trying to to influence or disrupt conversations using bots, fake accounts, multiple accounts, or other automation. This includes purchasing or selling methods of artificially increasing membership, such as via advertisements or botting.`}                    
                </li>

                <li>
                    <b>{`Do not organize, promote, or engage in any illegal or dangerous behavior, `}</b> 
                    {`such as sexual solicitation, human trafficking, and selling or facilitating the sale of prohibited or potentially dangerous goods (firearms, ammunition, drugs, and controlled substances). These activities are likely to get you kicked off Spritearc, and may get you reported to law enforcement.`}                    
                </li>

                <li>
                    <b>{`Do not abuse Spritearc products in any way, `}</b> 
                    {`such as selling or purchasing an account or server, or participating in fraudulent Nitro incentives or Boosting activities.`}                    
                </li>

                <li>
                    <b>{`Do not use self-bots or user-bots. `}</b> 
                    {`Each account must be associated with a human, not a bot. Self-bots put strain on Spritearc's infrastructure and our ability to run our services. For more information, you can read our Developer Policies here.`}                    
                </li>

                <li>
                    <b>{`Do not mislead Spritearc's support teams. `}</b> 
                    {`Do not make false or malicious reports to Trust & Safety or Customer Support; send multiple reports about the same issue; or ask a group of users to report the same content or issue. These behaviors may result in action being taken on your account.`}                    
                </li>
            </ul>
        </section>
    )
}