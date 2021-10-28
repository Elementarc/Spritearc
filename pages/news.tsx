import React, { ReactElement} from 'react';
import Head from "next/head"
import Image from "next/image"
import Eclipse from "../public/images/eclipse.jpg"
//IMAGES
import Footer from '../components/footer';
//News Component
export default  function News(): ReactElement {
	
	return (
		<>
			<Head>
				<title>Everything new about Pixels</title>
				<meta name="description" content="You can see the patchnotes of our application"/>
				
			</Head>
			<div className="news_container">
				<div className="news_header_container">

					<div className="background_container">
						<div className="background_image_container">
							<Image priority={true} src={Eclipse} layout="fill" alt="A Background image for header. Represent a cool planet." className="background_image"/>
						</div>
						<div className="background_blur" />
					</div>

					<div className="header_content_container">
						<h2>Recent Updates</h2>
						<h1>Everything New About PixelPalast</h1>
						<p>We will release occasional updates for PixelPalast. If you want to stay tuned you should come here and visit sometimes.</p>
						<span />
					</div>
					
				</div>
				
				<div className="news_content_container">
					<Patch_template date="14/10/2021" patch="1" name="Patchnote 1.0.0" type="Application Launch" preview={"PatchImage"}/>
				</div>

				<Footer />
			</div>
		</>
	);
}

//Component to create a Patch template
function Patch_template(props: any): ReactElement{
	
	return(
		<div className="patch_template_container">
			<div className="patch_preview_container" id="patch_preview_container">
			</div>
			<div className="patch_information">
				<h2>{props.type}</h2>
				<h1>{props.name}</h1>
				<p>2 Weeks ago</p>
			</div>
		</div>
	)
}
