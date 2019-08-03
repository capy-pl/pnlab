import React from 'react';
import { Route } from 'react-router-dom';

import Switch from '../../components/route/Switch';
import Detail from './Detail';
import AnalysisList from './List';

const AnalysisRouter = (props) => {
  return (
    <Switch>
      <Route path='/analysis/:id' component={Detail} />
      <Route exact path='/analysis' component={AnalysisList} />
    </Switch>
  );
};

export {
  AnalysisRouter as default,
  Detail,
  AnalysisList,
};
