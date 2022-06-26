import { ReactElement } from "react";
import Link from "next/dist/client/link";
import Footer from "../components/footer";
import { useParallax } from "../lib/custom_hooks";
import Image from "next/image";
import Transition_1 from "../public/images/transition_1.svg"
import AddIcon from "../public/icons/AddIcon.svg"
import WorldIcon from "../public/icons/WorldIcon.svg"
import HighQuality from "../public/icons/HighQuality.svg"
import { useRouter } from "next/router";
import Pack_stars_raiting from "../components/pack_stars_raiting";
import React from 'react';
import MetaGenerator from "../components/MetaGenerator";
import PageContent from "../components/layout/pageContent";
import KingHeader from "../components/kingHeader";
import ParallaxIntro from "../components/parallaxIntro";
import Perk, { IPerk } from "../components/perk";
import PerksGroup from "../components/perksGroup";
import ContentSegment, { ESegmentAlignment } from "../components/contentSegment";

export default function PageRenderer() {
  return (
    <>
        <MetaGenerator 
            title="Spritearc - Home" 
            description="Welcome to the Official Spritearc.com platform, where all mythical pixel artists and game developers can coexist in peace. Download and upload your own 2D pixel art sprites. Create yourself a community by creating awesome assets for 2D games."
            url="https://Spritearc.com"
            imageLinkSecure={`https://${process.env.NEXT_PUBLIC_APP_NAME}.com/images/spritearc_wallpaper.png`}
        />

        <HomePage/>

        <Footer/>
    </>
  );
}

function HomePage(): ReactElement {
    const router = useRouter()
    const perks: IPerk[] = [
        {
            Icon: <AddIcon/>,
            title: "creating Packs",
            description: "You can organize your game assets and sprites into packs to create beautiful experiences. Create your first pixel art pack within only 3 steps!"
        },
        {
            Icon: <WorldIcon/>,
            title: "Public",
            description: "Your recently released pixel art packs will be displayed on the front page which makes it easier to grow your audience."
        },
        {
            Icon: <HighQuality/>,
            title: "High Quality",
            description: "Discover assets made directly from those who have a passion for pixel art."
        },
    ]

    return (
        <PageContent>

            <ParallaxIntro 
                title="Become A Creator"
                subTitle="2D Pixel World" 
                description="Join a growing community of 2D artists and game developers by publishing your own pixel art sprites!"
                btnLabel="Join Now"
                contentUrl="/images/spritearc_wallpaper.png"
                btnCallback={() => {router.push("/signup", "/signup", {scroll: false})}}
            />

            <div className="middle_container">

                <div className="spritearc_info">
                    <KingHeader title="Explore Sprites" />
                    <p className="big">{`Discover thousands of different 2D game assets and sprites that you can use for free in your projects. Start improving your game's visuals with high quality character sprites, item art, backgrounds and more! You can browse pixel art packs by tags to find the exact kind of assets you're looking for.`}</p>
                    <button className="primary default" onClick={() => {router.push("/browse", "/browse", {scroll: false})}}>Browse Packs</button>
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

            <PerksGroup title="Perks" perks={perks}/>

            <ContentSegment 
                subTitle="News"
                title="Our Recent Updates"
                description={`Are you curious about our newest features? You can visit our news page and read all about the changes and updates we have made.`}
                imagePath="/images/wallpaper_4.jpg"
                component={<a className="main default" onClick={() => router.push("/news", "/news", {scroll: false})}>Read News</a>}
                alignDirection={ESegmentAlignment.LEFT}
            />

            <ContentSegment 
                subTitle="Your Desires"
                title="Whatever You Need!"
                description={`Our searching tool provides you a way to look for specific tags, perspectives and even sizes in packs. You also can search for specific creators!`}
                imagePath="/images/wallpaper_5.jpg"
                component={<a className="main default" onClick={() => router.push("/search", "/search", {scroll: false})}>Search Packs</a>}
                alignDirection={ESegmentAlignment.RIGHT}
            />

            <ContentSegment 
                title="Create Unique Packs"
                description={`Are you interested in releasing your own pixel art packs? Join our growing community and become known for your incredible art!`}
                imagePath="/images/wallpaper_3.png"
                component={<button onClick={() => router.push("/signup", "/signup", {scroll: false})} className="primary default">Create Account</button>}
                alignDirection={ESegmentAlignment.CENTER}
            />
        </PageContent>
    );
}

