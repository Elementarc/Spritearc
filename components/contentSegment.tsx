import Image from "next/image";

export enum ESegmentAlignment {
    LEFT = "left",
    CENTER = "center",
    RIGHT = "right"
}

export interface IContentSegment {
    title: string,
    subTitle?: string,
    description: string,
    imagePath: string,
    component?: JSX.Element
    alignDirection: ESegmentAlignment
}

export default function ContentSegment(props: IContentSegment) {
    return (
        <section className="content_segment_container">
            <div className={`segment_content ${props.alignDirection}`}>
                {props.subTitle && <h2>{props.subTitle}</h2>}
                <h1>{props.title}</h1>
                <p>{props.description}</p>

                {props.component && props.component}
                
            </div>

            <div className="img_wrapper">
                <Image src={props.imagePath} alt="A picture that represents this content" id="intro_image" layout="fill"></Image>
            </div>
            <div className={`segment_background ${props.alignDirection}`} />
        </section>
    );
}