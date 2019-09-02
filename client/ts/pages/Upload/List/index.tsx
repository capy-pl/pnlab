import React from 'react';
import {
  Container,
  Dropdown,
  DropdownProps,
  Icon,
  Segment,
  Table,
  Button,
  Menu,
} from 'semantic-ui-react';
import { RouteComponentProps } from 'react-router-dom';

import Pager, { PagerState } from '../../../PnApp/Pager';
import { verboseFileSize } from '../../../PnApp/Helper';
import ImportHistory from '../../../PnApp/model/ImportHistory';
import { StatusIcon } from 'Component/icon';
import ModalUpload from './ModalUpload';

interface State extends PagerState {
  loading: boolean;
  histories: ImportHistory[];
  showUploadModal: boolean;
}

export default class List extends React.PureComponent<RouteComponentProps, State> {
  public pager: Pager;
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      histories: [],
      showUploadModal: false,
      currentPage: 1,
      startPage: 1,
      pageLimit: 10,
      limit: 15,
    };
    this.pager = new Pager(`/api/upload/page`, this.state.pageLimit, this.state.limit);
  }

  public load = async () => {
    const histories = await ImportHistory.getAll({
      limit: this.state.limit,
      page: this.state.currentPage,
    });
    this.setState({ histories, loading: false });
  };

  public async componentDidMount() {
    await this.load();
  }

  public nextPages = async () => {
    this.setState(
      {
        loading: true,
      },
      async () => {
        await this.setStartPage(this.state.startPage + this.state.pageLimit);
      },
    );
  };

  public previousPages = async () => {
    this.setState(
      {
        loading: true,
      },
      async () => {
        await this.setStartPage(this.state.startPage - this.state.pageLimit);
      },
    );
  };

  public setStartPage = async (start: number) => {
    await this.pager.setStartPage(start);
    this.setState(
      {
        hasNext: this.pager.hasNext,
        leftNumber: !this.pager.hasNext ? this.pager.leftNumber : undefined,
        startPage: start,
        currentPage: start,
      },
      async () => {
        await this.load();
      },
    );
  };

  public getPageItems(): JSX.Element[] {
    const items: JSX.Element[] = [];
    const max: number = this.state.hasNext
      ? this.state.startPage + this.state.pageLimit
      : this.state.startPage + (this.state.leftNumber as number);
    for (let i = this.state.startPage; i < max; i++) {
      items.push(
        <Menu.Item
          key={i}
          active={this.state.currentPage === i}
          onClick={this.changePage(i)}
          as='a'
        >
          {i}
        </Menu.Item>,
      );
    }
    return items;
  }

  public getHistoryItemList(): JSX.Element[] {
    return this.state.histories.map((history) => (
      <Table.Row key={history.id}>
        <Table.Cell textAlign='center'>
          <StatusIcon status={history.status} />
        </Table.Cell>
        <Table.Cell textAlign='center'>{history.originFilename}</Table.Cell>
        <Table.Cell textAlign='center'>{verboseFileSize(history.fileSize)}</Table.Cell>
        <Table.Cell textAlign='center'>{history.created.toLocaleString()}</Table.Cell>
      </Table.Row>
    ));
  }

  public changePage(page: number): () => Promise<void> {
    return async () => {
      this.setState(
        {
          loading: true,
          currentPage: page,
        },
        async () => {
          await this.load();
        },
      );
    };
  }

  public toggleshowUploadModal = () => {
    this.setState({
      showUploadModal: !this.state.showUploadModal,
    });
  };

  public getPageOptions = () => {
    return [15, 25, 50].map((value) => ({
      key: value,
      text: value.toString(),
      value,
    }));
  };

  public changeLimit = (e, data: DropdownProps) => {
    const { value } = data;
    this.setState(
      {
        loading: true,
      },
      async () => {
        await this.setLimit(value as number);
      },
    );
  };

  public setLimit = async (limit: number) => {
    await this.pager.setLimit(limit);
    this.setState(
      {
        hasNext: this.pager.hasNext,
        leftNumber: !this.pager.hasNext ? this.pager.leftNumber : undefined,
        startPage: 1,
        currentPage: 1,
        limit,
      },
      async () => {
        await this.load();
      },
    );
  };

  render() {
    return (
      <Container>
        <ModalUpload
          onSuccess={this.load}
          close={this.toggleshowUploadModal}
          show={this.state.showUploadModal}
        />
        <Segment loading={this.state.loading}>
          <Button
            labelPosition='right'
            icon
            color='green'
            floated='right'
            onClick={this.toggleshowUploadModal}
            style={{ marginBottom: '1rem' }}
          >
            <Icon name='cloud upload' />
            上傳檔案
          </Button>
          <Table padded='very'>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell textAlign='right' colSpan='16'>
                  每頁顯示
                  <Dropdown
                    inline
                    onChange={this.changeLimit}
                    options={this.getPageOptions()}
                    text={`${this.state.limit}`}
                    value={this.state.limit}
                  />
                  筆資料
                </Table.HeaderCell>
              </Table.Row>
              <Table.Row>
                <Table.HeaderCell textAlign='center'>狀態</Table.HeaderCell>
                <Table.HeaderCell textAlign='center'>檔案名稱</Table.HeaderCell>
                <Table.HeaderCell textAlign='center'>檔案大小</Table.HeaderCell>
                <Table.HeaderCell textAlign='center'>上傳時間</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>{this.getHistoryItemList()}</Table.Body>
            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell colSpan='16'>
                  <Menu floated='right' pagination>
                    <Menu.Item
                      as='a'
                      onClick={this.previousPages}
                      icon
                      disabled={this.state.startPage === 1}
                    >
                      <Icon name='chevron left' />
                    </Menu.Item>
                    {this.getPageItems()}
                    <Menu.Item
                      as='a'
                      onClick={this.nextPages}
                      icon
                      disabled={!this.state.hasNext}
                    >
                      <Icon name='chevron right' />
                    </Menu.Item>
                  </Menu>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        </Segment>
      </Container>
    );
  }
}
