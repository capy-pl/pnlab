import React from 'react';
import { Route } from 'react-router-dom';

import Switch from '../../components/route/Switch';
import Compare from './Compare';

const CompareRouter = (props) => {
  return (
    <Switch>
      <Route path='/analysis/:id' component={Compare} />
    </Switch>
  );
};

export {
  CompareRouter as default,
  Compare,
};
