import React from 'react';
import Line from './line';

export default function ForwardContainer(props: { componentsArr: JSX.Element[]}) {
    const components = props.componentsArr
    return (
      <div className={`forward_container`}>
          <Line display={true} opacity={.5}/>
          <div className="items">
              {components}
          </div>
          
      </div>
    );
  }
