import React from 'react';
import { Dropdown, DropdownProps, Form, Segment } from 'semantic-ui-react';

import { AnalysisPreview } from '../../PnApp/model/Analysis';

interface FormAnalysisProps {
  analysesA: AnalysisPreview[];
  analysesB: AnalysisPreview[];
  dropChangeA?: (
    event: React.SyntheticEvent<HTMLElement, Event>,
    data: DropdownProps,
  ) => void;
  dropChangeB?: (
    event: React.SyntheticEvent<HTMLElement, Event>,
    data: DropdownProps,
  ) => void;
}

const FormAnalysis = ({
  analysesA,
  analysesB,
  dropChangeA,
  dropChangeB,
}: FormAnalysisProps) => {
  const inputsA = analysesA.map((value) => {
    return {
      text: value.title,
      value: value._id,
    };
  });
  const inputsB = analysesB.map((value) => {
    return {
      text: value.title,
      value: value._id,
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
          <br />
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

export default FormAnalysis;
