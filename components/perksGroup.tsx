import React from 'react';
import Transition_1 from "../public/images/transition_1.svg"
import Perk, { IPerk } from './perk';

export default function PerksGroup(props: {title: string, perks: IPerk[]}) {
    const perks = props.perks

    function generatePerks() {
        let perksJsx = []

        for(let perk of perks) {
            perksJsx.push(
                <Perk key={perk.title} Icon={perk.Icon} title={perk.title} description={perk.description} />
            )
        }

        return perksJsx
    }

    return (
        <div className="perks_container">

            <h1>{props.title}</h1>
            <div className="perks_grid">
                {generatePerks()}
            </div>

            <div className="svg_wrapper">
                <Transition_1/>
            </div>
            
        </div>
    );
}
