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
import { useRouter } from "next/router";

export default function Home(): ReactElement {
	useParallax("intro_image")
    const router = useRouter()
    
    return (
        <>
            <div className="home_page">
                
                <div className="content">


                    <div className="middle_container">

                        <div className="middle_info">
                            <H1_with_deco title="Explore Spritearc"></H1_with_deco>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et lectus eu tincidunt faucibus. Vel venenatis eget euismod nulla ut imperdiet tristique amet scelerisque. t lectus eu tincidunt faucibus. Vel venenatis eget euismod nulla ut imperdiet tristique amet scelerisque.</p>
                            <button onClick={() => {router.push("/browse", "/browse", {scroll: false})}}>Browse Packs</button>
                            <div className="arrow_container">
                                <ArrowIcon height="45px" width="45px" className="arrow_down" id="arrow_down"/>
                            </div>
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
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nibh nulla aliquet at egestas ut sodales.</p>
                            </div>
                           
                            <div className="perk">
                                <div className="perk_icon_wrapper">
                                    <AddIcon/>
                                </div>
                                <h2>Public</h2>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nibh nulla aliquet at egestas ut sodales.</p>
                            </div>
                            
                            <div className="perk">
                                <div className="perk_icon_wrapper">
                                    <AddIcon/>
                                </div>
                                <h2>Public</h2>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nibh nulla aliquet at egestas ut sodales.</p>
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
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et lectus eu tincidunt faucibus. Vel venenatis eget euismod nulla ut imperdiet tristique amet scelerisque. Sed scelerisque sit faucibus imperdiet. Leo senectus diam volutpat arcu.</p>
                            <Link href="/news" scroll={false}>
                                <a>Learn more</a>
                            </Link>
                        </div>

                        <div className="section_one_background_blur" />
                    </section>

                    <section className="news_section_container">
                        <div className="news_section_content">
                            <h2>News</h2>
                            <h1>Our Recent Updates</h1>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et lectus eu tincidunt faucibus. Vel venenatis eget euismod nulla ut imperdiet tristique amet scelerisque. Sed scelerisque sit faucibus imperdiet. Leo senectus diam volutpat arcu.</p>
                            <Link href="/news" scroll={false}>
                                <a>Learn more</a>
                            </Link>
                        </div>

                        <div className="news_section_background_blur" />
                    </section>

                    <section className="signup_section_container">
                        <div className="signup_section_content">
                            <h1>Create Account</h1>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et lectus eu tincidunt faucibus. Vel venenatis eget euismod nulla ut imperdiet tristique amet scelerisque. Sed scelerisque sit faucibus imperdiet. Leo senectus diam volutpat arcu.</p>
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
