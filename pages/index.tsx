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
				<meta name="description" content={`Download or create opensource Pixelart assets to share it with the world! We have more then thousands of assets you can freely download and use in your projects.`}/>

				<meta property="og:url" content="https://Spritearc.com/"/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content={`Spritearc - Home`}/>
				<meta property="og:description" content={`Discover thousands of opensource pixelart assets and sprites for free. You can download and create your own pixelart packs that will be shared with the world!`}/>
				<meta property="og:image" content={`/images/wallpaper.png`}/>

				<meta name="twitter:card" content="summary_large_image"/>
				<meta property="twitter:domain" content="Spritearc.com"/>
				<meta property="twitter:url" content="https://Spritearc.com/"/>
				<meta name="twitter:title" content={`Spritearc - Home`}/>
				<meta name="twitter:description" content={`Discover thousands of opensource pixelart assets and sprites for free. You can download and create your own pixelart packs that will be shared with the world!`}/>
				<meta name="twitter:image:src" content={`/images/wallpaper.png`}/>
            </Head>

            <div className="home_page">
                
                <div className="content">

                    <div className="intro_container">
                        <div className="intro_content">
                            <h2>Pixelart on the Horizon</h2>
                            <h1>Welcome to Spritearc!</h1>
                        </div>
                        <div className="arrow_container">
                            <ArrowIcon height="45px" width="45px" className="arrow_down" id="arrow_down"/>
                        </div>
                        <Image priority={true} src={"/images/wallpaper.png"} alt="Pixelart wallpaper of the sky." id="intro_image" layout="fill"></Image>
                        <div className="background_blur"></div>
                    </div>

                    <div className="middle_container">

                        <div className="spritearc_info">
                            <H1_with_deco title="Explore Spritearc"></H1_with_deco>
                            <p>{`Discover thousands of pixel art assets that you can use for free in your projects. Start improving your game's visuals with high-quality character sprites, item art, backgrounds and more! You can browse art packs by tags to find the exact kind of assets you're looking for.`}</p>
                            <button onClick={() => {router.push("/browse", "/browse", {scroll: false})}}>Browse Packs</button>
                            
                        </div>

                        <div className="create_pack_home_container">

                            <div className="create_pack_home_content">
                                <div className="text_wrapper_home">
                                    <h1>What are Packs?</h1>
                                    <p>{`Packs are bundled sprites and assets published by a pixel artist. Most of the time all it's content fit well together.`}</p>
                                    <Link href={"/search"} scroll={false}>Find Packs</Link>
                                </div>
                                
                                
                                <div className="preview_packs_home">
                                    <div className="pack_1">

                                        <div className="pack_1_image_wrapper">
                                            <Image src={"/images/example_preview_2.png"} layout="fill"></Image>
                                        </div>
                                    </div>

                                    <div className="pack_2">

                                        <div className="pack_2_content">
                                            <Pack_stars_raiting ratings={[{rating: 4, user: "Lol"}]}/>
                                            <h1>Pack</h1>
                                        </div>

                                        <div className="pack_2_image_wrapper">
                                            <Image src={"/images/example_preview.png"} layout="fill"></Image>
                                            <div className="pack_2_image_background"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="create_pack_home_container_left">

                            <div className="create_pack_home_content">
                                <div className="text_wrapper_home">
                                    <h1>Create a Pack</h1>
                                    <p>If you create an Account on Pixelart you will be able to create your own unqiue Pixelart packs that people can download and use. </p>
                                    <Link href={"/signup"} scroll={false}>Signup</Link>
                                </div>
                                
                                <div className="preview_packs_home">
                                    <div className="pack_1">

                                        <div className="pack_1_image_wrapper">
                                            <Image src={"/images/wallpaper.png"} layout="fill"></Image>
                                        </div>
                                    </div>

                                    <div className="pack_2">

                                        <div className="pack_2_content">
                                            <Pack_stars_raiting ratings={[{rating: 4, user: "Lol"}]}/>
                                            <h1>Unique Pack</h1>
                                        </div>

                                        <div className="pack_2_image_wrapper">
                                            <Image src={"/images/wallpaper_5.jpg"} layout="fill"></Image>
                                            <div className="pack_2_image_background"></div>
                                        </div>
                                    </div>
                                </div>
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
                            <p>{`Are you curiouse about our newest features? You can visit our news page and read all about the changes and updates we made. We're keeping it updated. `}</p>
                            
                            

                            <Link href="/news" scroll={false}>
                                <a>Read Updates</a>
                            </Link>
                        </div>

                        <div className="img_wrapper">
                            <Image src={"/images/wallpaper_4.jpg"} alt="Pixelart wallpaper of the sky." id="intro_image" layout="fill"></Image>
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
                        <div className="img_wrapper">
                            <Image src={"/images/wallpaper_5.jpg"} alt="Pixelart wallpaper of the sky." id="intro_image" layout="fill"></Image>
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

                        <div className="img_wrapper">
                            <Image src={"/images/wallpaper_3.png"} alt="Pixelart wallpaper of the sky." id="intro_image" layout="fill"></Image>
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