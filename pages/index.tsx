import { ReactElement } from "react";
import Link from "next/dist/client/link";
import Footer from "../components/footer";
import { Nav_shadow } from "../components/navigation";

export default function Home(): ReactElement {
    
    return (
        <>
            <div className="home_page">
                
                <div className="content">
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
                            <Link href="/news" scroll={false}>
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
