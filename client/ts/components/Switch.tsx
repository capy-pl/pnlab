import React from 'react';
import { AnimatedSwitch } from 'react-router-transition';

const Switch = ({ children }) => (
  <AnimatedSwitch
    atEnter={{ opacity: 0 }}
    atLeave={{ opacity: 0 }}
    atActive={{ opacity: 1 }}
  >
    {children}
  </AnimatedSwitch>
);

export default Switch;
