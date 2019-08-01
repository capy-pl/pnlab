import React from 'react';
import { Dropdown, DropdownOnSearchChangeData, DropdownProps, Form, Segment } from 'semantic-ui-react';

interface AnalysisFormProps {
  analysesA: string[];
  analysesB: string[];
  dropChangeA?: (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void;
  dropChangeB?: (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void;
  onSearchChangeA?: (event: React.SyntheticEvent<HTMLElement>, data: DropdownOnSearchChangeData) => void;
  onSearchChangeB?: (event: React.SyntheticEvent<HTMLElement>, data: DropdownOnSearchChangeData) => void;
}

const AnalysisForm = ({ analysesA, analysesB, dropChangeA, dropChangeB, onSearchChangeA, 
  onSearchChangeB }: AnalysisFormProps) => {
  const inputsA = analysesA.map((value) => {
    return {
      text: value,
      value,
    };
  });
  const inputsB = analysesB.map((value) => {
    return {
      text: value,
      value,
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
            multiple
            search
            selection
            options={inputsA}
            onSearchChange={onSearchChangeA}
          />
          <br/>
          <Dropdown
            onChange={dropChangeB}
            placeholder={`Please select Report B`}
            fluid
            multiple
            search
            selection
            options={inputsB}
            onSearchChange={onSearchChangeB}
          />
        </Form.Field>
      </Form>
    </Segment>
  );
};

export default AnalysisForm;
