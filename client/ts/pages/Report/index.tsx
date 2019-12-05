import React from 'react';
import { Route } from 'react-router-dom';
import { Loader } from 'semantic-ui-react';
import { Switch } from 'Component/route';

const ReportList = React.lazy(() =>
  import(/* webpackChunkName: "reportList" */ './List'),
);
const ReportAdd = React.lazy(() => import(/* webpackChunkName: "reportAdd" */ './Add'));
const ReportDetail = React.lazy(() =>
  import(/* webpackChunkName: "reportDetail" */ './Detail'),
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
