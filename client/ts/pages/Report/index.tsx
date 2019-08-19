import React from 'react';
import { Route } from 'react-router-dom';

import { Switch } from 'Component/route';
import ReportAdd from './Add';
import ReportDetail from './Detail';
import ReportList from './List';

const ReportRouter = (props) => {
  return (
    <Switch>
      <Route path='/report/add' component={ReportAdd} />
      <Route path='/report/:id' component={ReportDetail} />
      <Route exact path='/report' component={ReportList} />
    </Switch>
  );
};

export { ReportRouter as default, ReportList, ReportDetail, ReportAdd };
