import React from 'react';
import { Route } from 'react-router-dom';

import { Switch } from 'Component/route';

import Add from './Add';
import List from './List';

const Router = (props) => {
  return (
    <Switch>
      <Route exact path='/upload/add' component={Add} />
      <Route exact path='/upload' component={List} />
    </Switch>
  );
};

export { Router as default, List, Add };
