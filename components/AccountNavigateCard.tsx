export default function AccountNavigateCard(props: {label: string, description: string, callb: () => void, icon: any}) {
    const Icon = props.icon
    const label = props.label
    const descritpion = props.description
    const link = props.callb

    return (
        <div onClick={() => link()} className='navigate_card_container'>

            <div className='icon_container'>

                <div className='icon_background'>
                    <Icon className="icon"/>
                </div>

            </div>

            <h1>{label}</h1>
            <p>{descritpion}</p>
        </div>
    );
}
