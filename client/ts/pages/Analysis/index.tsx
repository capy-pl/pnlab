import React from 'react';
import { Route } from 'react-router-dom';
import { Loader } from 'semantic-ui-react';
import Switch from '../../components/route/Switch';

const Compare = React.lazy(() =>
  import(/* webpackChunkName: "analysisCompare" */ './Compare'),
);
const Detail = React.lazy(() =>
  import(/* webpackChunkName: "analysisDetail" */ './Detail'),
);
const List = React.lazy(() => import(/* webpackChunkName: "analysisList" */ './List'));

const AnalysisRouter = () => {
  return (
    <React.Suspense fallback={<Loader />}>
      <Switch>
        <Route path='/analysis/compare' component={Compare} />
        <Route path='/analysis/:id' component={Detail} />
        <Route exact path='/analysis' component={List} />
      </Switch>
    </React.Suspense>
  );
};

export { AnalysisRouter as default };
