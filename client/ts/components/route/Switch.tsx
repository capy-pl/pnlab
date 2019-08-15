import React from 'react';
import { AnimatedSwitch, spring } from 'react-router-transition';

function mapStyles(styles: { opacity: number; scale: any }) {
  // Please see https://github.com/maisano/react-router-transition/issues/3
  // to learn why need this function.
  if (styles.opacity > 1) {
    return {
      display: 'none',
    };
  }
  return {
    opacity: styles.opacity,
    transform: `scale(${styles.scale})`,
  };
}

// wrap the `spring` helper to use a bouncy config
function bounce(val: any) {
  return spring(val, {
    stiffness: 330,
    damping: 22,
  });
}

// child matches will...
const fadeTransition = {
  // start in a transparent, upscaled state
  atEnter: {
    opacity: 0,
    // scale: 1.2,
  },
  // leave in a transparent, downscaled state
  atLeave: {
    opacity: 2,
    // scale: bounce(0.8),
    // display: 'none',
  },
  // and rest at an opaque, normally-scaled state
  atActive: {
    opacity: 1,
    // scale: bounce(1),
  },
};

type Props = {
  children: React.ReactNode;
};

const Switch = ({ children }: Props) => (
  <AnimatedSwitch
    atEnter={fadeTransition.atEnter}
    atLeave={fadeTransition.atLeave}
    atActive={fadeTransition.atActive}
    mapStyles={mapStyles}
    className='route-wrapper'
  >
    {children}
  </AnimatedSwitch>
);

export default Switch;
