import React from 'react';
import { Tab } from 'semantic-ui-react';

const TabPanel = (props) => {
  const cores = props.coreInfo.map((data) => {
    return(
      <tr key={data.community} className='center aligned'>
        <td>{data.community}</td>
        <td>{data.core}</td>
      </tr>
    );
  });
  const hooks = props.hookInfo.map((data) => {
    return(
      <tr key={data} className='center aligned'>
        <td>{data}</td>
      </tr>
    );
  });

  const panes = [
    { menuItem: 'Core', render: () => {
        return(
          <Tab.Pane>
            <table className='ui very basic table'>
              <thead>
                <tr className='center aligned'>
                  <th className='six wide'>Community</th>
                  <th>Core</th>
                </tr>
              </thead>
              <tbody>
                {cores}
              </tbody>
            </table>
          </Tab.Pane>
        );
      },
    },
    { menuItem: 'Hook', render: () => {
        return(
          <Tab.Pane>
            <table className='ui very basic table'>
              <thead>
                <tr className='center aligned'>
                  <th>Possible Hooks</th>
                </tr>
              </thead>
              <tbody>
                {hooks}
              </tbody>
            </table>
          </Tab.Pane>
        );
      },
    },
    { menuItem: 'Add-on', render: () => <Tab.Pane>Tab 3 Content</Tab.Pane> },
  ];
  return(
    <Tab panes={panes} />
  );
};

export default TabPanel;
