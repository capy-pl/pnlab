import React from 'react';
import { Route } from 'react-router-dom';

import Switch from '../../components/route/Switch';
import AnalysisCompare from './Compare';
import AnalysisDetail from './Detail';
import AnalysisList from './List';

const AnalysisRouter = () => {
  return (
    <Switch>
      <Route path='/analysis/compare' component={AnalysisCompare} />
      <Route path='/analysis/:id' component={AnalysisDetail} />
      <Route exact path='/analysis' component={AnalysisList} />
    </Switch>
  );
};

export { AnalysisRouter as default, AnalysisCompare, AnalysisDetail, AnalysisList };
