import React from 'react';
import { Rnd } from 'react-rnd';
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
      <Rnd
        dragHandleClassName='draggable'
        default={{x: 0, y: 0,  width: '240px', height: '240px'}}
        minHeight={240}
        minWidth={240}
      >
        <div
          ref={this.windowRef}
          style={{ display: this.props.show ? 'inline-block' : 'none', height: '100%', width: '100%' }}
        >
        <Card
          raised={true}
          fluid
          style={{ height: '100%' }}
        >
          <Card.Content
            className='draggable'
            style={{ padding: '5px', flexGrow: 0 }}
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
            <Card.Content style={{ overflow: 'scroll' }}>
            {this.props.children}
          </Card.Content>
        </Card>
        </div>
      </Rnd>
    );
  }
}
