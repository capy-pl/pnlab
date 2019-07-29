import React from 'react';
import { Route } from 'react-router-dom';

import Switch from 'Component/Switch';
import Compare from './Compare';

const CompareRouter = (props) => {
  return (
    <Switch>
      <Route path='/report/:id' component={Compare} />
    </Switch>
  );
};

export {
  CompareRouter as default,
  Compare,
};
