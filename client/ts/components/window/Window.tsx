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
  zIndex: number;
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
      zIndex: 199,
    };

    this.windowRef = React.createRef();
    this.isInsideCurrentWindow = this.isInsideCurrentWindow.bind(this);
  }

  public isInsideCurrentWindow(e: MouseEvent): boolean {
    const { top, left, right, bottom } = (this.windowRef.current as HTMLDivElement).getBoundingClientRect();
    const { clientX, clientY } = e;
    return (clientX <= right && clientX >= left) && (clientY >= top && clientY <= bottom);
  }

  public componentDidMount(): void {
    document.addEventListener('mousedown', (e) => {
      if (this.isInsideCurrentWindow(e)) {
        this.setState({
          focus: true,
          zIndex: 200,
        });
      } else {
        this.setState({
          focus: false,
          zIndex: 199,
        });
      }
    });
  }

  public render() {
    return (
      <Rnd
        dragHandleClassName='draggable'
        default={{x: 0, y: 0,  width: '240px', height: '240px'}}
        minHeight={240}
        minWidth={240}
        style={{ zIndex: this.state.zIndex }}
      >
        <div
          ref={this.windowRef}
          style={{ display: this.props.show ? 'inline-block' : 'none', height: '100%', width: '100%' }}
        >
        <Card
          raised={this.state.focus}
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
