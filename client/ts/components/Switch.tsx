import React from 'react';
import { AnimatedSwitch } from 'react-router-transition';

interface SwitchProps {
  children: React.ReactElement | React.ReactElement[];
}

const Switch: React.JSXElementConstructor<SwitchProps> = ({ children }) => (
  <AnimatedSwitch
    atEnter={{ opacity: 0 }}
    atLeave={{ opacity: 0 }}
    atActive={{ opacity: 1 }}
  >
    {children}
  </AnimatedSwitch>
);

export default Switch;
