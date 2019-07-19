import React from 'react';
import { Dropdown, Menu } from 'semantic-ui-react';
import { urlPrefix } from '../../PnApp/Helper';

// interface DropdownMenuProps {
//   reportId: string;
// }

const DropdownMenu = (props) => (
  <Menu compact>
    <Dropdown onClick={props.onClickP} text='Product Network' className='link item'>
      <Dropdown.Menu>
        <Dropdown.Item onClick={props.onShowProductRank}>產品排名</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    <Dropdown onClick={props.onClickC} text='Communities' className='link item'>
      <Dropdown.Menu>
        <Dropdown.Item onClick={props.onShowCommunities}>Communities排名</Dropdown.Item>
        <Dropdown.Item onClick={props.onShowCharacter}>Communities角色</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  </Menu>
);

export default DropdownMenu;
