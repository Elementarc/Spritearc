import React from 'react';
import Head from 'next/head';

export default function MetaGenerator(props: {title: string, description: string, url: string, imageLinkSecure: string, keywords?: string}) {
  const title = props.title
  const description = props.description
  const url = props.url
  const imageLinkSecure = props.imageLinkSecure
  const keywords = props.keywords ?? "Pixel Art, Spritearc"

  return (
    <Head>
        <title>{`${title}`}</title>
        <meta property="description" content={`${description}`}/>
        <meta property='keywords' content={`${keywords}`}/>

        <meta property="og:url" content={`${url}`}/>
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${title}`}/>
        <meta property="og:description" content={`${description}`}/>
        <meta property="og:image" content={`${imageLinkSecure}`}/>
        <meta property="og:image:secure_url" content={`${imageLinkSecure}`}/>

        <meta property="twitter:card" content="summary_large_image"/>
        <meta property="twitter:domain" content="Spritearc.com"/>
        <meta property="twitter:url" content={`${url}`}/>
        <meta property="twitter:title" content={`${title}`}/>
        <meta property="twitter:description" content={`${description}`} />
        <meta property="twitter:image" content={`${imageLinkSecure}`}/>
    </Head>
  );
}
