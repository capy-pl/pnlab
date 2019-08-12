import React from 'react';
import Draggable from 'react-draggable';
import {
  Card,
  Icon,
} from 'semantic-ui-react';

interface WindowProps {
  title: string;
  children?: React.ReactChild;
  show?: boolean;
  onClickX?: (e: React.SyntheticEvent<MouseEvent>) => void;
}

interface WindowState {
  focus: boolean;
}

const style: React.CSSProperties = {
  resize: 'both',
  overflowY: 'scroll',
  overflowX: 'auto',
  display: 'inline-block',
  minWidth: '240px',
  minHeight: '240px',
};

const closeIconStyle: React.CSSProperties = {
  float: 'right',
  cursor: 'pointer',
};

export default class Window extends React.PureComponent<WindowProps, WindowState> {
  public windowRef: React.RefObject<HTMLDivElement>;
  constructor(props: WindowProps) {
    super(props);
    this.state = {
      focus: true,
    };

    this.windowRef = React.createRef();
  }

  public captureClick(): void {

  }

  public componentDidMount(): void {
    
  }

  public render() {
    return (
      <Draggable
        allowAnyClick={false}
        handle='.draggable'
      >
        <div
          ref={this.windowRef}
          style={{ display: this.props.show ? 'inline-block' : 'none' }}
        >
        <Card
          style={style}
          raised={this.state.focus}
        >
          <Card.Content
            className='draggable'
            style={{ padding: '5px' }}
          >
            <Card.Description
              textAlign='center'
            >
              {this.props.title}
              <Icon
                name='x'
                style={closeIconStyle}
                onClick={this.props.onClickX}
              />
            </Card.Description>
          </Card.Content>
          <Card.Content>
            {this.props.children}
          </Card.Content>
        </Card>
        </div>
      </Draggable>
    );
  }
}
