import React from 'react';

export interface IStats {
    label: string,
    value?: string | number,
    Component?: JSX.Element | JSX.Element[]
}

export default function Stats(props: {stats: IStats[]}) {
    const stats = props.stats

    function generateStats() {
        const jsxStats = stats.map((stat) => {

            return (
                <div key={stat.label} className='stat_grid'>
                    <div className="stat_label_container">
                        <p className='p default'>{`${stat.label}:`}</p>
                    </div>

                    <div className='stat_value_container'>
                        {stat.Component && stat.Component}
                        {!stat.Component &&
                            <p style={{color: 'white'}} className='p default'>{stat.value}</p>
                        }
                    </div>
                </div>
            )

        })

        return jsxStats
    }

    return (
        
        <div className="stats_container">
            
            {generateStats()}

        </div>

    )
}
