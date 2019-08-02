import React from 'react';
import { Checkbox, Dropdown, Menu } from 'semantic-ui-react';

const style = {
  // tslint:disable-next-line: object-literal-key-quotes
  position: 'absolute',
  zIndex: 100,
};

interface DropdownMenu {
  // @TODO: Add props here.
}

const DropdownMenu = (props) => (
  <Menu
    style={style}
    compact
  >
    <Dropdown.Item>
      <Checkbox
        toggle
        label={props.showCommunity ? '隱藏Community' : '顯示Community'}
        onChange={props.showCommunity ? props.onShowProductNetwork : props.onShowCommunities}
      />
    </Dropdown.Item>
    <Dropdown text='Product Network' className='link item'>
      <Dropdown.Menu>
        <Dropdown.Item onClick={props.onShowProductRank}>產品排名</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    <Dropdown text='Communities' className='link item'>
      <Dropdown.Menu>
        <Dropdown.Item onClick={props.onShowCommunitiesRank}>Communities排名</Dropdown.Item>
        <Dropdown.Item onClick={props.onShowCharacter}>Communities角色</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  </Menu>
);

export default DropdownMenu;
