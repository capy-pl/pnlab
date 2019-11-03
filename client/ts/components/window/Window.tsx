import React from 'react';
import { Rnd } from 'react-rnd';
import { Card, Icon } from 'semantic-ui-react';

interface WindowProps {
  title: string;
  children?: JSX.Element | JSX.Element[];
  show?: boolean;
  defaultX?: number;
  defaultY?: number;
  defaultWidth?: number | string;
  defaultHeight?: number | string;
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
  public windowRef: React.RefObject<HTMLDivElement> = React.createRef();
  public state: WindowState = {
    focus: true,
    zIndex: 199,
  };

  public isInsideCurrentWindow = (e: MouseEvent) => {
    const { top, left, right, bottom } = (this.windowRef
      .current as HTMLDivElement).getBoundingClientRect();
    const { clientX, clientY } = e;
    return clientX <= right && clientX >= left && (clientY >= top && clientY <= bottom);
  };

  public focusWindow = (e: MouseEvent) => {
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
  };

  public componentDidMount(): void {
    document.addEventListener('mousedown', this.focusWindow);
  }

  public componentWillUnmount(): void {
    document.removeEventListener('mousedown', this.focusWindow);
  }

  public render() {
    const rndDefaultStyle = {
      x: this.props.defaultX || 0,
      y: this.props.defaultY || 0,
      width: this.props.defaultWidth || '240px',
      height: this.props.defaultHeight || '240px',
    };
    return (
      <Rnd
        dragHandleClassName='draggable'
        default={rndDefaultStyle}
        minHeight={240}
        minWidth={240}
        style={{
          zIndex: this.state.zIndex,
          display: 'inline-block',
        }}
      >
        <div
          ref={this.windowRef}
          style={{
            display: 'inline-block',
            height: '100%',
            width: '100%',
          }}
        >
          <Card raised={this.state.focus} fluid style={{ height: '100%' }}>
            <Card.Content className='draggable' style={{ padding: '5px', flexGrow: 0 }}>
              <Card.Description textAlign='center'>
                {this.props.title}
                <Icon name='x' style={closeIconStyle} onClick={this.props.onClickX} />
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
