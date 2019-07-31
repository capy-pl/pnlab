import React from 'react';
import { Dropdown, Menu } from 'semantic-ui-react';

const style = {
  // tslint:disable-next-line: object-literal-key-quotes
  position: 'absolute',
  zIndex: 100,
};

const DropdownMenu = (props) => (
  <Menu
    style={style}
    compact
  >
    <Dropdown onClick={props.onShowProductNetwork} text='Product Network' className='link item'>
      <Dropdown.Menu>
        <Dropdown.Item onClick={props.onShowProductRank}>產品排名</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    <Dropdown onClick={props.onShowCommunities} text='Communities' className='link item'>
      <Dropdown.Menu>
        <Dropdown.Item onClick={props.onShowCommunitiesRank}>Communities排名</Dropdown.Item>
        <Dropdown.Item onClick={props.onShowCharacter}>Communities角色</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  </Menu>
);

export default DropdownMenu;
