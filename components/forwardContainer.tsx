import React from 'react';

export default function ForwardContainer(props: { componentsArr: JSX.Element[]}) {
    const components = props.componentsArr
    return (
      <div className={`forward_container`}>
  
          <span className="bottom_section_line" />
          <div className="items">
              {components}
          </div>
          
      </div>
    );
  }
