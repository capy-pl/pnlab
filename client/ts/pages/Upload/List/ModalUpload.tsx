import React from 'react';
import {
  Form,
  Message,
  Header,
  Icon,
  Modal,
  Segment,
  Button,
  Progress,
} from 'semantic-ui-react';

import { verboseFileSize } from '../../../PnApp/Helper';
import ImportHistory from '../../../PnApp/model/ImportHistory';

interface Props {
  show: boolean;
  close: () => void;
  onSuccess: () => Promise<void>;
}

interface State {
  loading: boolean;
  error: boolean;
  errMessage: string;
  file?: File;
  progress: number;
}

export default class ModalUpload extends React.PureComponent<Props, State> {
  public inputRef: React.RefObject<HTMLInputElement>;
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      error: false,
      errMessage: '',
      progress: 0,
    };
    this.inputRef = React.createRef();
  }

  public clickUploadArea = () => {
    if (this.inputRef && this.inputRef.current) {
      this.inputRef.current.click();
    }
  };

  public handleFile(file: File): void {
    if (file.size > 2 * Math.pow(2, 30)) {
      this.setState({
        error: true,
        errMessage: `${file.name} 超過限制大小2GB，請考慮將檔案切割後再上傳。`,
      });
    } else if (!(file.type == 'text/csv' || file.type == 'application/vnd.ms-excel')) {
      this.setState({
        error: true,
        errMessage: `${file.name} 類型不為csv。`,
      });
    } else {
      this.setState({
        error: false,
        errMessage: '',
        file,
      });
    }
  }

  public preventDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  public onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    if (
      event.dataTransfer &&
      event.dataTransfer.files &&
      event.dataTransfer.files.length
    ) {
      const file = event.dataTransfer.files[0];
      this.handleFile(file);
    }
  };

  public onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length) {
      const file = files[0];
      this.handleFile(file);
    }
  };

  public close = () => {
    this.setState({
      error: false,
      errMessage: '',
      file: undefined,
      loading: false,
    });
    this.props.close();
  };

  public upload = () => {
    if (this.state.file) {
      this.setState(
        {
          loading: true,
          progress: 0,
        },
        async () => {
          try {
            const formData = new FormData();
            formData.append('file', this.state.file as File);
            await ImportHistory.add(formData, {
              onUploadProgress: this.onProgress,
            });
            this.close();
            await this.props.onSuccess();
          } catch (err) {
            if (err.response && err.response.status === 400) {
              this.setState({
                loading: false,
                error: true,
                errMessage: '檔案重複上傳。',
              });
            } else {
              this.setState({
                loading: false,
                error: true,
                errMessage: '上傳錯誤，請重新再試。',
              });
            }
          }
        },
      );
    } else {
      this.setState({
        loading: false,
        progress: 0,
        error: true,
        errMessage: '沒有檔案。',
      });
    }
  };

  public onProgress = (event: ProgressEvent) => {
    if (event.lengthComputable) {
      console.log(Math.ceil((event.loaded / event.total) * 100));
      this.setState({
        progress: Math.ceil((event.loaded / event.total) * 100),
      });
    }
  };

  public getContent = () => {
    if (!this.state.loading) {
      return (
        <Modal.Content>
          <Form error={this.state.error}>
            <Segment
              onDrop={this.onDrop}
              onDragOver={this.preventDragOver}
              onClick={this.clickUploadArea}
              textAlign='center'
              placeholder
              style={{ cursor: 'pointer' }}
            >
              <Header icon>
                <Icon name='file' />
                {this.state.file
                  ? `${this.state.file.name} (${verboseFileSize(this.state.file.size)})`
                  : '拖放檔案或是點擊選擇檔案'}
              </Header>
            </Segment>
            <input
              onChange={this.onChange}
              ref={this.inputRef}
              style={{ display: 'none' }}
              type='file'
            />
            <Message error>{this.state.errMessage}</Message>
          </Form>
        </Modal.Content>
      );
    } else {
      return (
        <Modal.Content>
          <Message info>上傳時請勿關閉視窗，以避免上傳失敗。</Message>
          <Progress
            active
            color='teal'
            progress='percent'
            total={100}
            value={this.state.progress}
          />
        </Modal.Content>
      );
    }
  };

  public render() {
    return (
      <Modal open={this.props.show}>
        {this.getContent()}
        <Modal.Actions>
          <Button
            loading={this.state.loading}
            disabled={this.state.loading}
            onClick={this.close}
            color='red'
          >
            關閉
          </Button>
          <Button
            disabled={this.state.loading}
            onClick={this.upload}
            loading={this.state.loading}
            color='blue'
          >
            上傳
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}
