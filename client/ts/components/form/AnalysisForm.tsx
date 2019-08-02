import React from 'react';
import { Dropdown, DropdownOnSearchChangeData, DropdownProps, Form, Segment } from 'semantic-ui-react';

import Analysis from '../../PnApp/model/Analysis';

interface AnalysisFormProps {
  analysesA: Analysis[];
  analysesB: Analysis[];
  dropChangeA?: (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void;
  dropChangeB?: (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void;
}

const AnalysisForm = ({ analysesA, analysesB, dropChangeA, dropChangeB}: AnalysisFormProps) => {
  const inputsA = analysesA.map((value) => {
    return {
      text: value.title,
      value: value.id,
    };
  });
  const inputsB = analysesB.map((value) => {
    return {
      text: value.title,
      value: value.id,
    };
  });

  return (
    <Segment color='teal'>
      <Form>
        <Form.Field>
          <label>比較網路圖</label>
          <Dropdown
            onChange={dropChangeA}
            placeholder={`Please select Report A`}
            fluid
            search
            selection
            options={inputsA}
          />
          <br/>
          <Dropdown
            onChange={dropChangeB}
            placeholder={`Please select Report B`}
            fluid
            search
            selection
            options={inputsB}
          />
        </Form.Field>
      </Form>
    </Segment>
  );
};

export default AnalysisForm;
