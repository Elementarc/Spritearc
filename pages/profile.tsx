import React from 'react';
import { GetServerSideProps } from 'next';

export default function Profile() {
  return (
    <>
    
    </>
  );
}




import { get_public_user } from '../lib/mongo_lib';
export const getServerSideProps: GetServerSideProps = async (context) => {
    const redirect = {redirect: {
        permanent: false,
        destination: "/browse"
    }}
    const username = context.query.user
    
    if(!username) return redirect
    if(typeof username !== "string") return redirect
    //user query exist and is type of string
    
    const user = await get_public_user(username)
    if(!user) return redirect
    //User was found in the databse
    
    
    return {
        props: {
            test: false,
        }
    }
    
}
