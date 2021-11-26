export default function H1_with_deco(props: {title: string}) {
    const title = props.title
    return (
        <div className="h1_with_deco">
            <div className="left_container">
                <span className="left_line"/>
                <div className="left_icon"/>
            </div>
            
            <h1>{title}</h1>
    
            <div className="right_container">
                <div className="right_icon"/>
                <span className="right_line"/>
            </div>
        </div>
    );
}