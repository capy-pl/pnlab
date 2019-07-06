import React from 'react';
import { Dropdown, Menu } from 'semantic-ui-react';

const DropdownMenu = () => (
  <Menu secondary pointing style={{ width: '95%', margin: '0 auto'}}>
    <Dropdown text='Product Network' pointing className='link item'>
      <Dropdown.Menu>
        <Dropdown.Item>產品排名</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    <Dropdown text='Communities' pointing className='link item'>
      <Dropdown.Menu>
        <Dropdown.Item>Communities排名</Dropdown.Item>
        <Dropdown.Item>Communities角色</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  </Menu>
);

export default DropdownMenu;
