import React from 'react';
import { Checkbox } from 'semantic-ui-react';

const CommunitiesCheckbox = (props) => (
  <Checkbox label={<label>{props.communityRank} <a onClick={props.onClick}>{props.communityName}</a></label>} />
);

export default CommunitiesCheckbox;
