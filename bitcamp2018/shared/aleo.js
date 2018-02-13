import React from 'react';

// wrapper that sets the font to Aleo-(Regular|Bold|etc.)
function aleofy(Component, fontStyle='Regular') {

  return (props) => (

      <Component {...props}
        style={[{ fontFamily: `Arial` }, props.style]}>

        {props.children}
      </Component>
  );
}

export default aleofy;
