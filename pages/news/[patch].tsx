import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next'
import { getStaticPatchUrl } from '../../lib/patch';

export default function patch(props: any) {
  
  return (
    <>
      <h1 style={{color: 'white'}}>Hello</h1>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  
  return {
    props: {
      name: "Hello" 
    }
  }
}

export const getStaticPaths: GetStaticPaths  = async ()  => {
  //Prerendering Paths for Patches. Function returns all paths for possible patches.
  const paths = getStaticPatchUrl()
  return{
    paths,
    fallback: false,
  }
}










