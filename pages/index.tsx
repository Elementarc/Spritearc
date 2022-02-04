import { ReactElement } from "react";
import Link from "next/dist/client/link";
import Footer from "../components/footer";
import { Nav_shadow } from "../components/navigation";
import { useParallax } from "../lib/custom_hooks";
import Image from "next/image";
import H1_with_deco from "../components/h1_with_deco";
import ArrowIcon from "../public/icons/ArrowIcon.svg"
import Transition_1 from "../public/images/transition_1.svg"
import AddIcon from "../public/icons/AddIcon.svg"
import WorldIcon from "../public/icons/WorldIcon.svg"
import HighQuality from "../public/icons/HighQuality.svg"
import { useRouter } from "next/router";
import Head from "next/head";

export default function Home(): ReactElement {
	useParallax("intro_image")
    const router = useRouter()
    
    return (
        <>
            <Head>
				<title>{`Spritearc - Home`}</title>
				<meta name="description" content={`Download or create opensource Pixelart assets to share it with the world! We have more then thousands of assets you can freely download and use in your projects.`}/>

				<meta property="og:url" content="https://Spritearc.com/"/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content={`Spritearc - Home`}/>
				<meta property="og:description" content={`Download or create opensource Pixelart assets to share it with the world! We have more then thousands of assets you can freely download and use in your projects.`}/>
				<meta property="og:image" content={`/images/wallpaper.png`}/>

				<meta name="twitter:card" content="summary_large_image"/>
				<meta property="twitter:domain" content="Spritearc.com"/>
				<meta property="twitter:url" content="https://Spritearc.com/"/>
				<meta name="twitter:title" content={`Spritearc - Home`}/>
				<meta name="twitter:description" content={`Download or create opensource Pixelart assets to share it with the world! We have more then thousands of assets you can freely download and use in your projects.`}/>
				<meta name="twitter:image" content={`/images/wallpaper.png`}/>
            </Head>

            <div className="home_page">
                
                <div className="content">

                    <div className="intro_container">
                        <div className="intro_content">
                            <h2>Pixelart on the Horizon</h2>
                            <h1>Welcome to Spritearc!</h1>
                        </div>
                        
                        
                        
                        <Image src={"/images/wallpaper.png"} id="intro_image" layout="fill"></Image>
                        <div className="background_blur"></div>
                    </div>

                    <div className="middle_container">

                        <div className="spritearc_info">
                            <H1_with_deco title="Explore Spritearc"></H1_with_deco>
                            <p>Discover more than thousands of pixelart assets and sprites that you can freely use in your projects. Start to improve your game design by using sprites that people publish to Spritearc.</p>
                            <button onClick={() => {router.push("/browse", "/browse", {scroll: false})}}>Browse Packs</button>
                            <div className="arrow_container">
                                <ArrowIcon height="45px" width="45px" className="arrow_down" id="arrow_down"/>
                            </div>
                        </div>


                        <div className="blob_container">
                            <Image src={"/blobs/blob_3.svg"} layout="fill"></Image>
                        </div>
                    </div>

                    

                    

                    <div className="perks_container">

                        <h1>Perks</h1>
                        <div className="perks_grid">
                            
                            <div className="perk">
                                <div className="perk_icon_wrapper">
                                    <AddIcon/>
                                </div>
                                
                                <h2>Creating Packs</h2>
                                <p>We made creating packs an enjoyment. Create your pixelart packs easily with only 3 steps!</p>
                            </div>
                           
                            <div className="perk">
                                <div className="perk_icon_wrapper">
                                    <WorldIcon/>
                                </div>
                                <h2>Public</h2>
                                <p>Your recently released packs will be displayed on the front page which makes it easier to grow your audience.</p>
                            </div>
                            
                            <div className="perk">
                                <div className="perk_icon_wrapper">
                                    <HighQuality/>
                                </div>
                                <h2>High Quality</h2>
                                <p>You can download thousands of high quality pixelart assets on Spritearc.</p>
                            </div>

                        </div>

                        <div className="svg_wrapper">
                            <Transition_1/>
                        </div>
                        
                    </div>

                    <section className="section_one_container">
                        <div className="section_one_content">
                            <h2>News</h2>
                            <h1>Our Recent Updates</h1>
                            <p>Are you curiouse about our newest features? You can visit our news page and read all about the changes and updates we made. We're keeping it updated. </p>
                            <Link href="/news" scroll={false}>
                                <a>Read Updates</a>
                            </Link>
                        </div>

                        <div className="section_one_background_blur" />
                    </section>

                    <section className="news_section_container">
                        <div className="news_section_content">
                            <h2>Your Desires</h2>
                            <h1>Find Whatever You Need!</h1>
                            <p>Our searching tool provides you a way to look for specific tags in packs. That way whenever you exactly know what you need, you will find it.</p>
                            <Link href="/search" scroll={false}>
                                <a>Search Packs</a>
                            </Link>
                        </div>

                        <div className="news_section_background_blur" />
                    </section>

                    <section className="signup_section_container">
                        <div className="signup_section_content">
                            <h1>Publish Your Pixelart</h1>
                            <p>Are you interested in releasing your own pixelart packs? Create your account now and build yourself a community that will support you through all pixels. </p>
                            <Link href="/signup" scroll={false}>
                                <button>Create Account</button>
                            </Link>
                        </div>

                        <div className="signup_section_background_blur" />
                    </section>
                    <Nav_shadow/>
                </div>
                
                <Footer/>
            </div>
            
        </>
    );
}