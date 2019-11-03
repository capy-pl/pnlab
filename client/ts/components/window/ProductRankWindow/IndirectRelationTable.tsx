import React from 'react';
import { Button, Loader, List, Table, Popup } from 'semantic-ui-react';

import { Report } from '../../../PnApp/model';

interface Props {
  selectedProduct: number;
  model: Report;
  back: () => void;
}

interface State {
  loading: boolean;
  nodes?: IndirectNode[];
}

interface IndirectNode {
  id: number;
  name: string;
  distance: number;
  distanceWeight: number;
  nodesOnPath: string[];
}

export default class IndirectRelationTalbe extends React.PureComponent<Props, State> {
  public state: State = {
    loading: true,
  };

  public getNodeOnPaths(previous: Map<number, number>, start: number): string[] {
    let temp = start;
    const nodes: string[] = [this.props.model.graph.getNode(start).name as string];
    while (temp !== this.props.selectedProduct) {
      const id = previous.get(temp) as number;
      const node = this.props.model.graph.getNode(id).name as string;
      nodes.unshift(node);
      temp = id;
    }
    return nodes;
  }

  public componentDidMount() {
    const {
      previous,
      distance,
      weightedDistance,
    } = this.props.model.graph.shortestPathTree(this.props.selectedProduct, true);
    const nodes: IndirectNode[] = Array.from(previous.keys())
      .filter((id) => ((distance as Map<number, number>).get(id) as number) > 1)
      .map((id) => {
        const node = this.props.model.graph.getNode(id);
        return {
          id,
          name: node.name as string,
          distance: (distance as Map<number, number>).get(id) as number,
          distanceWeight: (weightedDistance as Map<number, number>).get(id) as number,
          nodesOnPath: this.getNodeOnPaths(previous, id),
        };
      });
    this.setState({
      loading: false,
      nodes,
    });
  }

  public getNodesPathList(list: string[]): JSX.Element {
    return (
      <List ordered>
        {list.map((node) => (
          <List.Item key={node}>{node}</List.Item>
        ))}
      </List>
    );
  }

  public getCells(): JSX.Element[] {
    return (this.state.nodes as IndirectNode[]).map((node) => (
      <Table.Row key={node.id}>
        <Table.Cell textAlign='center'>{node.name}</Table.Cell>
        <Table.Cell textAlign='center'>{node.distance}</Table.Cell>
        <Table.Cell textAlign='center'>{Math.round(node.distanceWeight)}</Table.Cell>
        <Table.Cell textAlign='right'>
          <Popup
            hoverable
            position='top center'
            trigger={<Button basic>顯示最短路徑</Button>}
          >
            {this.getNodesPathList(node.nodesOnPath)}
          </Popup>
        </Table.Cell>
      </Table.Row>
    ));
  }

  public render() {
    if (this.state.loading) {
      return (
        <Loader active indeterminate>
          計算中...
        </Loader>
      );
    }
    return (
      <React.Fragment>
        <a onClick={this.props.back}> &lt;&lt; 返回</a>
        <Table selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textAlign='center'>產品名稱</Table.HeaderCell>
              <Table.HeaderCell textAlign='center'>產品距離</Table.HeaderCell>
              <Table.HeaderCell textAlign='center'>產品權重距離</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>
          <Table.Body>{this.getCells()}</Table.Body>
        </Table>
      </React.Fragment>
    );
  }
}
