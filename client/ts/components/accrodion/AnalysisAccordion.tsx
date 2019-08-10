import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { Accordion, AccordionTitleProps, Menu } from 'semantic-ui-react';

interface AnalysisAccordionState {
  activeItem?: number | undefined;
}

interface AnalysisAccordionProps {
  description?: string;
}

const sidebarStyle: React.CSSProperties = {
  zIndex: 100,
  height: '100%',
  width: '15%',
  position: 'absolute',
  left: 0,
};

export default class AnalysisAccordion extends PureComponent<AnalysisAccordionProps, AnalysisAccordionState> {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: -1,
    };
    this.onClick = this.onClick.bind(this);
  }

  public onClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>, { index }: AccordionTitleProps): void {
    const activeIndex = this.state.activeItem
    const newIndex = activeIndex === index ? -1 : index
    this.setState({ activeItem: newIndex });
    }

  public render() {
    return (
      <Accordion as={Menu} vertical>
        <Menu.Item>
          <Accordion.Title
            active={this.state.activeItem === 0}
            content='Description'
            index={0}
            onClick={this.onClick}
          />
          <Accordion.Content active={this.state.activeItem === 0} content={this.state.description} />
        </Menu.Item>

        <Menu.Item>
          <Accordion.Title
            active={this.state.activeItem === 1}
            content='Comments'
            index={1}
            onClick={this.onClick}
          />
          <Accordion.Content active={this.state.activeItem === 1} content={'Comments'} />
        </Menu.Item>
      </Accordion>
    );
  }
}
