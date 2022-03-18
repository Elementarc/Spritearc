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
import Pack_stars_raiting from "../components/pack_stars_raiting";

export default function Home(): ReactElement {
	useParallax("intro_image")
    const router = useRouter()
    
    return (
        <>
            <Head>
				<title>{`Spritearc - Home`}</title>
                <link rel="canonical" href="https://spritearc.com" />
                <link rel="shortlink" href="https://spritearc.com" />
                <meta name="keywords" content="pixelart, pixel art, free, sprites, game assets, free game assets, 2d"></meta>
				<meta name="description" content={`Discover thousands of pixel art assets and sprites for free. You can download and create your own pixel art packs that will be shared with the world!`}/>

				<meta property="og:url" content="https://Spritearc.com/"/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content={`Spritearc - Home`}/>
				<meta property="og:description" content={`Discover thousands of pixel art assets and sprites for free. You can download and create your own pixel art packs that will be shared with the world!`}/>
				<meta property="og:image" content={`${process.env.NEXT_PUBLIC_ENV === "development" ? `` : `https://${process.env.NEXT_PUBLIC_APP_NAME}.com`}/images/spritearc_wallpaper.png`}/>

				<meta name="twitter:card" content="summary_large_image"/>
				<meta property="twitter:domain" content="Spritearc.com"/>
				<meta property="twitter:url" content="https://Spritearc.com/"/>
				<meta name="twitter:title" content={`Spritearc - Home`}/>
				<meta name="twitter:description" content={`Discover thousands of pixel art assets and sprites for free. You can download and create your own pixel art packs that will be shared with the world!`}/>
                <meta name="twitter:image:src" content={`${process.env.NEXT_PUBLIC_ENV === "development" ? `` : `https://${process.env.NEXT_PUBLIC_APP_NAME}.com`}/images/spritearc_wallpaper.png`}/>
            </Head>

            <div className="home_page">
                <div className="content">

                    <div className="intro_container">
                        <div className="intro_content">
                            <h2>2D Pixel World</h2>
                            <h1>Become A Creator</h1>
                            <p>Join a growing community of 2D artists and game developers by publishing your own pixel art sprites!</p>
                            <button onClick={() => {router.push("/signup", "/signup", {scroll: false})}}>Join Now</button>
                        </div>
                        <div className="arrow_container">
                            <ArrowIcon height="45px" width="45px" className="arrow_down" id="arrow_down"/>
                        </div>
                        <Image loading="lazy" src={"/images/spritearc_wallpaper.png"} alt="Pixel art wallpaper of the sky." id="intro_image" layout="fill"></Image>
                        <div className="background_blur"></div>
                    </div>

                    <div className="middle_container">

                        <div className="spritearc_info">
                            <H1_with_deco title="Explore Sprites"></H1_with_deco>
                            <p>{`Discover thousands of different 2D game assets and sprites that you can use for free in your projects. Start improving your game's visuals with high quality character sprites, item art, backgrounds and more! You can browse pixel art packs by tags to find the exact kind of assets you're looking for.`}</p>
                            <button onClick={() => {router.push("/browse", "/browse", {scroll: false})}}>Browse Packs</button>
                        </div>

                        <div className="packs_explanation_container">
                            <div className="packs_explanation_content">
                                <h2>What are Packs?</h2>
                                <p>{`Packs are bundled sprites and assets published by a pixel artist. Most of the time, all its content fit well together.`}</p>
                                <Link href="/search" scroll={false}>Find Packs</Link>

                                <div className="example_preview_container">

                                    <div className="example_preview_info">

                                        <div className="example_ratings_container">
                                            <Pack_stars_raiting ratings={[{user_id: "Test", rating: 5}]}/>
                                        </div>
                                        
                                        <h2>Platformer Pack</h2>
                                    </div>

                                    <div className="example_image_container">
                                        <Image loading="lazy" src={"/images/example_preview.png"} layout="fill" alt="Preview image of one pack"></Image>
                                        <div className="blur"></div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>

                        <div className="create_pack_explanation_container">
                            <div className="create_pack_explanation_content">
                                <h2>Pack Licenses</h2>
                                <p>There are different kind of licenses you can choose from, when publishing a pixel art pack.</p>
                                <Link href="/license" scroll={false}>Licenses</Link>

                                <div className="example_preview_container">

                                    <div className="example_preview_info">

                                        <div className="example_ratings_container">
                                            <Pack_stars_raiting ratings={[{user_id: "Test", rating: 5}]}/>
                                        </div>
                                        
                                        <h2>Adventure Pack</h2>
                                    </div>

                                    <div className="example_image_container">
                                        <Image src={"/images/example_preview_2.png"} layout="fill" alt="Preview image of one pack"></Image>
                                        <div className="blur"></div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>

                        <div className="blob_container">
                            <Image loading='lazy' unoptimized={true} src={"/blobs/blob_3.svg"} layout="fill" alt="Big wave blob"></Image>
                        </div>
                    </div>

                    <div className="perks_container">

                        <h1>Perks</h1>
                        <div className="perks_grid">
                            
                            <div className="perk">
                                <div className="perk_header">
                                    <div className="perk_icon_wrapper">
                                        <AddIcon/>
                                    </div>
                                    <h2>Creating Packs</h2>
                                </div>
                                
                                <p>You can organize your game assets and sprites into packs to create beautiful experiences. Create your first pixel art pack within only 3 steps!</p>
                            </div>
                           
                            <div className="perk">
                                <div className="perk_header">
                                    <div className="perk_icon_wrapper">
                                        <WorldIcon/>
                                    </div>
                                    <h2>Public</h2>
                                </div>
                                <p>Your recently released pixel art packs will be displayed on the front page which makes it easier to grow your audience.</p>
                            </div>
                            
                            <div className="perk">
                                <div className="perk_header">
                                    <div className="perk_icon_wrapper">
                                        <HighQuality/>
                                    </div>
                                    <h2>High Quality</h2>
                                </div>
                                
                                <p>{`Discover assets made directly from those who have a passion for pixel art.`}</p>
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
                            <p>{`Are you curious about our newest features? You can visit our news page and read all about the changes and updates we have made.`}</p>
                            
                            

                            <Link href="/news" scroll={false}>
                                <a>Read Updates</a>
                            </Link>
                        </div>

                        <div className="img_wrapper">
                            <Image loading='lazy' src={"/images/wallpaper_4.jpg"} alt="Pixel art wallpaper of the sky." id="intro_image" layout="fill"></Image>
                        </div>
                        <div className="section_one_background_blur" />
                    </section>

                    <section className="news_section_container">
                        <div className="news_section_content">
                            <h2>Your Desires</h2>
                            <h1>Find Whatever You Need!</h1>
                            <p>Our searching tool provides you a way to look for specific tags in packs. You also can search for specific creators!</p>
                            <Link href="/search" scroll={false}>
                                <a>Search Packs</a>
                            </Link>
                        </div>
                        <div className="img_wrapper">
                            <Image loading='lazy' src={"/images/wallpaper_5.jpg"} alt="Pixel art wallpaper of the sky." id="intro_image" layout="fill"></Image>
                        </div>
                        <div className="news_section_background_blur" />
                    </section>

                    <section className="signup_section_container">
                        <div className="signup_section_content">
                            <h1>Create Unique Packs</h1>
                            <p>Are you interested in releasing your own pixel art packs? Join our growing community and become known for your incredible art! </p>
                            <Link href="/signup" scroll={false}>
                                <button>Create Account</button>
                            </Link>
                        </div>

                        <div className="img_wrapper">
                            <Image loading='lazy' src={"/images/wallpaper_3.png"} alt="Pixel art wallpaper of the sky." id="intro_image" layout="fill"></Image>
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