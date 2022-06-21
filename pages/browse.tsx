import React from 'react';
import Footer from '../components/footer';
import PackPreviewsSection from '../components/packPreviewsSection';
import MetaGenerator from '../components/MetaGenerator';
import PageContent from '../components/layout/pageContent';
import PromotedPack from '../components/promotedPack';
import { Suspense } from 'react';

export default function PageRenderer() {
  return (
	<>
		<MetaGenerator 
			title='Spritearc - Discover thousands of free pixel art game assets and sprites'
			description='Discover the most popular pixel art game assets and sprites like tilesets, characters, weapons, backgrounds, icons and more for free on spritearc.com, the platform for pixel artists and gamedeveloper.'
			url='https://Spritearc.com/'
			imageLinkSecure={`https://${process.env.NEXT_PUBLIC_APP_NAME}.com/images/spritearc_wallpaper.png`}
			keywords="pixelart, spritearc, 2d, fantasy, games"
		/>

		<BrowsePage/>

		<Footer/>
	</>
  );
}


function BrowsePage() {
	
	return (
		<PageContent>
			<PromotedPack/>
			<Suspense>
				<PackPreviewsSection label='Most Popular' api={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/most_popular_packs?`}/>
			</Suspense>
			<Suspense>
				<PackPreviewsSection label='Recently Uploaded' api={`${process.env.NEXT_PUBLIC_SPRITEARC_API}/recent_packs?`}/>
			</Suspense>
		</PageContent>
	);
}

