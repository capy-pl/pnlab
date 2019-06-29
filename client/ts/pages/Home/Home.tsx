import React, { PureComponent as PureComponent } from 'react';
import { Route, RouteComponentProps, withRouter } from 'react-router-dom';
import { AnimatedSwitch } from 'react-router-transition';
import { Container, Dimmer, Loader } from 'semantic-ui-react';

import Navbar from '../../components/menu/Navbar';
import { Auth } from '../../PnApp';
import { updateCurrentUser } from '../../PnApp/Helper';

import Setting from '../Setting';
import { ReportList } from '../Report';

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
        <Container>
            <AnimatedSwitch
              atEnter={{ opacity: 0 }}
              atLeave={{ opacity: 0 }}
              atActive={{ opacity: 1 }}
            >
              <Route path='/settings' component={Setting} />
            <Route path='/' component={ReportList} />
            </AnimatedSwitch>
        </Container>
      </div>
    );
  }
}

const HomeComponent = withRouter(Home);
export default HomeComponent;
