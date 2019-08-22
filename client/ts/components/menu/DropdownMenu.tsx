import React from 'react';
import { Checkbox, Dropdown, Menu } from 'semantic-ui-react';

const style = {
  // tslint:disable-next-line: object-literal-key-quotes
  position: 'absolute',
  zIndex: 100,
};

interface DropdownMenuProps {
  onShowProductNetwork: () => void;
  onShowCommunities: () => void;
  onShowProductRank: (event) => void;
  onShowCommunitiesRank: (event) => void;
  onShowCharacter: (event) => void;
  showCommunity: boolean;
}

const onToggleDisable = () => {
  console.log('a');
};

const DropdownMenu =
({onShowProductNetwork, onShowCommunities, onShowProductRank, onShowCommunitiesRank,
  onShowCharacter, showCommunity}: DropdownMenuProps) => (
  <Menu
    style={style}
    compact
  >
    <Dropdown.Item>
      <Checkbox
        toggle
        label={showCommunity ? '隱藏Community' : '顯示Community'}
        onChange={showCommunity ? onShowProductNetwork : onShowCommunities}
      />
    </Dropdown.Item>
    <Dropdown text='Product Network' className='link item'>
      <Dropdown.Menu>
        <Dropdown.Item onClick={onShowProductRank}>產品排名</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    <Dropdown text='Communities' className='link item'>
      <Dropdown.Menu>
        <Dropdown.Item onClick={onShowCommunitiesRank}>Communities排名</Dropdown.Item>
        <Dropdown.Item onClick={onShowCharacter}>Communities角色</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  </Menu>
);

export default DropdownMenu;
