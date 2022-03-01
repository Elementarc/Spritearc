import { ObjectId } from "mongodb";
import { FileJSON } from "formidable";

//APP context_types
export interface App_navigation_context_type {
    nav_state: boolean,
    set_nav_state: React.Dispatch<React.SetStateAction<boolean>>
}
export interface App_notification_context_type {
    notification: App_notification,
    dispatch: React.Dispatch<{type: string, payload: App_dispatch_notification | null}>
}

export interface App_context {
    app_content_element: () => HTMLElement,
    
}

//Navigation item
export interface Nav_item{
    label: string
    icon: any
    link: string
    query?: string
}

//App Notification types
export interface App_dispatch_notification {
    title: string | null, 
    message: string | null, 
    button_label: string | null,
    callb?: () => void
}
export interface App_notification extends App_dispatch_notification {
    toggle: boolean,
    success: boolean
}
export interface App_notification_actions {
    SUCCESS: string,
    ERROR: string,
    CLOSE: string
}

//Patchnote types
export interface Patchnote {
    id: string
    info: Patchnote_info
    content: string
}
export interface Patchnote_info {
    title: string,
    update: string,
    date: Date,
    image: string,
    author: string
}

//PackPreview types
export interface Pack {
    _id: ObjectId,
    username: string,
    preview: string,
    popularity: number,
    title: string,
    license: string,
    description: string,
    date: Date,
    tags: string[],
    downloads: number,
    content: Pack_content[]
    ratings: Pack_rating[]
}
export interface Pack_rating {
    user: string,
    rating: number
}
export interface Pack_content {
    section_name: string,
    section_images: string[]
}

export interface Formidable_files {
    [file: string]: Formidable_file | Formidable_file[];
}
export interface Formidable_file {
    /**
     * The size of the uploaded file in bytes. If the file is still being uploaded (see `'fileBegin'`
     * event), this property says how many bytes of the file have been written to disk yet.
     */
    size: number;

    /**
     * The path this file is being written to. You can modify this in the `'fileBegin'` event in case
     * you are unhappy with the way formidable generates a temporary path for your files.
     */
    filepath: string;

    /**
     * The name this file had according to the uploading client.
     */
    originalFilename: string | null;

    /**
     * Calculated based on options provided
     */
    newFilename: string;

    /**
     * The mime type of this file, according to the uploading client.
     */
    mimetype: string | null;

    /**
     * A Date object (or `null`) containing the time this file was last written to. Mostly here for
     * compatibility with the [W3C File API Draft](http://dev.w3.org/2006/webapi/FileAPI/).
     */
    mtime?: Date | null | undefined;

    hashAlgorithm: false | "sha1" | "md5" | "sha256";

    /**
     * If `options.hashAlgorithm` calculation was set, you can read the hex digest out of this var
     * (at the end it will be a string).
     */
    hash?: string | null;

    /**
     * This method returns a JSON-representation of the file, allowing you to JSON.stringify() the
     * file which is useful for logging and responding to requests.
     *
     * @link https://github.com/node-formidable/formidable#filetojson
     */
    toJSON(): FileJSON;

    toString(): string;
}


export interface Create_pack_frontend{
    current_step: number,
    steps_available: number[],
    license: string | null,
    preview: {
        preview_asset: File | null,
        preview_url: string | null
    },
    title: string | null,
    description: string | null,
    tags: string[],
    content: Map<string, {section_assets: File[], section_urls: string[]}>
}

export interface Create_pack_context_type {
    create_pack_obj: Create_pack_frontend;
    dispatch: React.Dispatch<{
        type: string;
        payload?: any;
    }>;
}

//User
export interface User_with_id extends User {
    _id: ObjectId
}
export interface User extends Public_user{
    email: string,
    password: string,
    salt: string,
    verified: boolean,
    notifications: [],
    
    occasional_emails: boolean,
}
export interface Account_socials {
    instagram: string
    twitter: string 
    artstation: string 
}
export interface Public_user {
    username: string,
    description: string,
    socials: Account_socials,
    created_at: Date,
    profile_picture: string,
    profile_banner: string,
    paypal_donation_link: string,
    following: [],
    followers: [],
    role: string,
}

export interface Frontend_public_user {
    auth: boolean | null
    public_user: Public_user
}
//Auth

export interface Auth_context_type {
    user: Frontend_public_user,
    dispatch: React.Dispatch<{
        type: string;
        payload: {
            auth: boolean;
            public_user?: Public_user | undefined;
            token?: string | undefined;
            callb?: (() => void) | undefined;
        } | null;
    }>
}
//Signup
export interface Signup_obj {
    username: string | null,
    email: string | null,
    password: string | null,
    legal: boolean,
    occasional_emails: boolean,
}
export interface Server_signup_obj extends Signup_obj {
    hashed_password: string,
    salt: string,
    date: Date,
    about: string,
    socials: string[],
    profile_image: string,
    released_packs: Pack[]
}

export interface Server_response_pack{
    success: boolean,
    message: string,
    pack: Pack | null,
}
export interface Server_response_packs extends Server_response{
    packs: Pack[] | [],
    available_pages: number,
}
export interface Server_response_login extends Server_response{
    public_user: Public_user | null, 
    token: string | null,
    verified: boolean,
    email: string | undefined | null,
}
export interface Server_response_pack_rating extends Server_response{
    user: string,
    rating: number,
}
export interface Server_response_email extends Server_response{
    email: string,
}
export interface Server_response_public_user extends Server_response{
    public_user: Public_user
}
export interface Server_response {
    success: boolean,
    message: string
}
