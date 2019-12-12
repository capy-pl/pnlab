import React, { PureComponent } from 'react';
import { Route, RouteComponentProps, withRouter } from 'react-router-dom';
import { Container, Dimmer, Loader } from 'semantic-ui-react';

import Navbar from 'Component/menu/Navbar';
import { Switch } from 'Component/route';
import { Auth } from '../../PnApp';
import { updateCurrentUser } from '../../PnApp/Helper';
import NotFound from '../NotFound';

const Analysis = React.lazy(() =>
  import(
    /* webpackPreload: true */
    /* webpackChunkName: "analysis" */
    '../Analysis'
  ),
);
const Report = React.lazy(() =>
  import(
    /* webpackPreload: true */
    /* webpackChunkName: "report" */
    '../Report'
  ),
);
const ReportList = React.lazy(() =>
  import(
    /* webpackPreload: true */
    /* webpackChunkName: "reportList" */
    '../Report/List'
  ),
);
const Setting = React.lazy(() =>
  import(
    /* webpackPreload: true */
    /* webpackChunkName: "setting" */ '../Setting'
  ),
);

const Upload = React.lazy(() =>
  import(
    /* webpackPreload: true */
    /* webpackChunkName: "upload" */
    '../Upload'
  ),
);

interface HomeState {
  loading: boolean;
}

class Home extends PureComponent<RouteComponentProps, HomeState> {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  public async componentDidMount() {
    const isValid = await Auth.validate();
    if (isValid) {
      await updateCurrentUser();
      this.setState({ loading: false });
    } else {
      this.props.history.push('/account/login');
    }
  }

  public render() {
    if (this.state.loading) {
      return (
        <div>
          <Container>
            <Dimmer active>
              <Loader size='huge'>Loading...</Loader>
            </Dimmer>
          </Container>
        </div>
      );
    }

    return (
      <div>
        <Navbar />
        <React.Suspense fallback={<Loader />}>
          <Switch>
            <Route path='/report' component={Report} />
            <Route path='/settings' component={Setting} />
            <Route path='/analysis' component={Analysis} />
            <Route path='/upload' component={Upload} />
            <Route exact path='/' component={ReportList} />
            <Route component={NotFound} />
          </Switch>
        </React.Suspense>
      </div>
    );
  }
}

const HomeComponent = withRouter(Home);
export default HomeComponent;
