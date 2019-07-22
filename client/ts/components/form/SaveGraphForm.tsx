import React, { PureComponent } from 'react';
import { Form } from 'semantic-ui-react';

interface FormSaveState {
  // visible: boolean;
  name: string;
  note: string;
}
export default class SaveGraphForm extends PureComponent<{}, FormSaveState> {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      note: '',
    };
    this.handleChange = this.handleChange.bind(this);

  }
  public handleChange(keyName: 'name' | 'note', value: string): void {
    if (keyName === 'name') {
      this.setState({ name: value });
    } else {
      this.setState({ note: value });
    }
  }

  public render() {
    const { name, note } = this.state;

    return (
      <div style={{backgroundColor: 'white', padding: '20px'}}>
        <Form>
          <Form.Input
            required
            label='圖片名稱'
            placeholder='圖片名稱'
            name='name'
            value={name}
            onChange={(e, { value }) => { this.handleChange('name', value as string); }}
          />
          <Form.TextArea
            label='圖片註解'
            placeholder='圖片註解'
            name='note'
            value={note}
            onChange={(e, { value }) => { this.handleChange('note', value as string); }}
          />
        </Form>
      </div>
    );
  }
}
{/* <Form.Group >
            <Form.Button secondary content='取消' onClick={this.handleHideClick}/>
            <Form.Button primary content='確定儲存' />
          </Form.Group>
        </Form>
        <div>
          <strong style={{color:'black'}}>onChange:</strong>
          <pre style={{color:'black'}}>{JSON.stringify({ name, note }, null, 2)}</pre>
        </div>
      </div> */}

// const SaveNetwork = ({ visible, name, note, handleShowClick,
//   handleSidebarHide, handleHideClick, handleChange, children }: SaveNetworkProps) => {
//   return (
//     <React.Fragment>
//       {children}
//       <Sidebar
//         as={Menu}
//         animation='overlay'
//         icon='labeled'
//         direction='right'
//         onHide={handleSidebarHide}
//         vertical
//         visible={visible}
//         width='wide'
//       >

//         {/* <Form onSubmit={this.handleSubmit}> */}
//         <Form>
//             <Form.Input required
//               label='圖片名稱'
//               placeholder='圖片名稱'
//               name='name'
//               value={name}
//               onChange={(e, { value }) => { handleChange('name', value as string); }}
//             />
//             <Form.TextArea
//               label='圖片註解'
//               placeholder='圖片註解'
//               name='note'
//               value={note}
//               onChange={(e, { value }) => { handleChange('note', value as string); }}
//             />
//             <Form.Group >
//               <Form.Button primary content='確認儲存' />
//               <Form.Button secondary content='取消' disabled={!visible} onClick={handleHideClick}/>
//             </Form.Group>
//         </Form>
//         <strong>onChange:</strong>
//         <pre>{JSON.stringify({ name, note }, null, 2)}</pre>
//         {/* <strong>onSubmit:</strong>
//         <pre>{JSON.stringify({ graphName, graphNote }, null, 2)}</pre> */}
//         {/* <Button content='取消' disabled={!visible} onClick={this.handleHideClick}/> */}
//       </Sidebar>
//     </React.Fragment>);
// };

// export default SaveNetwork;
