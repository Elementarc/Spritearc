import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next'
import { getPatchContent, getPatchInfo, getAllStaticPatchUrls, getAllPatchIds} from '../../lib/patch_lib';
import Footer from '../../components/footer';
import { PatchInformation } from '../../types';
import Image from "next/image"

//Frontend
export default function Patch(props: any) {
  	const patchInfos: PatchInformation = props.patchInfos

	return (
		<div className="patch_container">

			<div className="patch_preview_container">
				<Image quality="100%" priority={true} src={`/images/${patchInfos.image}`} layout="fill" alt="A Background image for header. Represent a cool planet." className="background_image"/>
				<div className="patch_preview_blur"></div>
			</div>

			<div className="patch_content_container">
				<div className="patch_main_content_container">
					<div className="patch_main_content">
						<h2>{patchInfos.update}</h2>
						<h1>{patchInfos.title}, {patchInfos.date}</h1>

						
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Placerat fermentum tellus tellus sed justo elementum nunc, vel. Lacus, ipsum eleifend eget erat faucibus lectus. Aenean ultricies ullamcorper convallis lorem. Aliquam elit sociis nec tellus nibh. Elit turpis tempus placerat mi. Mollis lectus sed risus nisi, et. Dignissim urna, vitae sed laoreet ut at neque netus.</p>
						<br />
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Placerat fermentum tellus tellus sed justo elementum nunc, vel.</p>
						<br />
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Placerat fermentum tellus tellus sed justo elementum nunc, vel. Lacus, ipsum eleifend eget erat faucibus lectus. Aenean ultricies ullamcorper convallis lorem. Aliquam elit sociis nec tellus nibh. Elit turpis tempus placerat mi. Mollis lectus sed risus nisi, et. Dignissim urna, vitae sed laoreet ut at neque netus.  Mollis lectus sed risus nisi,  Mollis lectus sed risus nisi.</p>

						<img src={""} alt="" />
						<h1 style={{marginTop: "2rem"}}>PixelPalast</h1>
						<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Placerat fermentum tellus tellus sed justo elementum nunc, vel. Lacus, ipsum eleifend eget erat faucibus lectus. Aenean ultricies ullamcorper convallis lorem. Aliquam elit sociis nec tellus nibh. Elit turpis tempus placerat mi. Mollis lectus sed risus nisi, et. Dignissim urna, vitae sed laoreet ut at neque netus.</p>
						<br />
						<p style={{marginBottom: "2rem"}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Placerat fermentum tellus tellus sed justo elementum nunc, vel. Lacus, ipsum eleifend eget erat faucibus lectus. Aenean ultricies ullamcorper convallis lorem. Aliquam elit sociis nec tellus nibh. Elit turpis tempus placerat mi. Mollis lectus sed risus nisi, et. Dignissim urna, vitae sed laoreet ut at neque netus.  Mollis lectus sed risus nisi,  Mollis lectus sed risus nisi.</p>
						<button style={{marginBottom: "6rem"}}>Go Back</button>
					</div>
				</div>

			</div>

			<Footer/>
	</div>
	);
}


//Serverside
export const getStaticProps: GetStaticProps = async (context) => {
  const params: any = context.params
  const patchInfos = getPatchInfo(params.patchId)
  const patchContent = getPatchContent(params.patchId)
  
  return {
    props: {
      patchContent,
      patchInfos,
    }
  }
}

export const getStaticPaths: GetStaticPaths  = async ()  => {
    //Prerendering Paths for Patches. Function returns all paths for possible patches.
    const paths = getAllStaticPatchUrls(getAllPatchIds())
    return{
        paths,
        fallback: false,
    }
}










