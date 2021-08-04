import React from 'react';

import './LinkingWidget.scss';

const LinkingWidget = props => {

  const links = props.annotation ? 
    props.annotation.bodies.filter(b => b.purpose === 'linking') : [];
  
  return (
    <div class="r6o-widget mrm-link-widget">
      {links.length > 0 && 
        <ul>
          {links.map(link => 
            <li key={link.id}>{link.id}</li>
          )}
        </ul>
      }
    </div>
  );

}

export default LinkingWidget;