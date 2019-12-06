import React from 'react';
import { Route } from 'react-router-dom';
import { Loader } from 'semantic-ui-react';
import { Switch } from 'Component/route';

const ReportList = React.lazy(() =>
  import(
    /* webpackPreload: true */
    /* webpackChunkName: "reportList" */
    './List'
  ),
);
const ReportAdd = React.lazy(() =>
  import(
    /* webpackPreload: true */
    /* webpackChunkName: "reportAdd" */
    './Add'
  ),
);
const ReportDetail = React.lazy(() =>
  import(
    /* webpackPreload: true */
    /* webpackChunkName: "reportDetail" */
    './Detail'
  ),
);

const ReportRouter = () => {
  return (
    <React.Suspense fallback={<Loader />}>
      <Switch>
        <Route path='/report/add' component={ReportAdd} />
        <Route path='/report/:id' component={ReportDetail} />
        <Route exact path='/report' component={ReportList} />
      </Switch>
    </React.Suspense>
  );
};

export { ReportRouter as default, ReportList, ReportDetail, ReportAdd };
