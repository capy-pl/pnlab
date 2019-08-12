import React, { PureComponent } from 'react';
import { Message } from 'semantic-ui-react';
import { Edge, Node, SimpleNode } from '../../PnApp/model/Report';

interface ConnectedNodes {
  name: string;
  id: number;
  edgeWeight: number;
}

interface ProductRankProps {
  productRankInfo?: SimpleNode[];
  updateProductGraph: (product: SimpleNode | undefined) => void;
  nodes: Node[];
  edges: Edge[];
  getCurrentContent: (content) => void;
}

interface MessageState {
  visible: boolean;
  clickedProduct?: SimpleNode;
  content: string;
  connectedInfo?: ConnectedNodes[];
}

export default class ProductRank extends PureComponent<ProductRankProps, MessageState> {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      content: 'productRank',
    };
    this.handleDismiss = this.handleDismiss.bind(this);
    this.handleProductClick = this.handleProductClick.bind(this);
    this.backToProductRank = this.backToProductRank.bind(this);
    this.getEdgeWeight = this.getEdgeWeight.bind(this);
  }

  public async handleDismiss() {
    await this.setState({ visible: false, content: '' });
    this.props.getCurrentContent(this.state.content);
  }

  public getEdgeWeight() {
    if (this.state.clickedProduct) {
      let nodeId;
      for (const node of this.props.nodes) {
        if (node.name === this.state.clickedProduct.name) {
          nodeId = node.id;
        }
      }
      const connectedInfo: ConnectedNodes[] = [];
      let connectedNodeId;
      let connectedNodeName;
      for (const edge of this.props.edges) {
        if (edge.from === nodeId || edge.to === nodeId) {
          if (edge.from !== nodeId) {
            connectedNodeId = edge.from;
          } else if (edge.to !== nodeId) {
            connectedNodeId = edge.to;
          }
          for (const node of this.props.nodes) {
            if (node.id === connectedNodeId) {
              connectedNodeName = node.name;
            }
          }
          const connectedNode = {
            name: connectedNodeName,
            id: connectedNodeId,
            edgeWeight: edge.weight,
          };
          connectedInfo.push(connectedNode);
        }
      }
      connectedInfo.sort((a, b) => {
        return b.edgeWeight - a.edgeWeight;
      });
      this.setState({connectedInfo});
    }
  }

  public handleProductClick(product: SimpleNode): () => void {
    return () => {
      this.setState({ clickedProduct: product }, () => {
        this.props.updateProductGraph(this.state.clickedProduct);
        this.getEdgeWeight();
      });
      this.setState({ content: 'productDetail' });
    };
  }

  public backToProductRank() {
    this.setState({content: 'productRank'});
    this.setState({clickedProduct: undefined}, () => {
      this.props.updateProductGraph(this.state.clickedProduct);
    });
  }

  public render() {
    let message: React.ReactChild = <React.Fragment />;
    if (this.props.productRankInfo) {
      if (this.state.content === 'productRank') {
        const productRank = this.props.productRankInfo.map((product, index) => {
          return(
            <tr key={product.name} className='center aligned'>
              <td>{index + 1}</td>
              <td>
                <a onClick={this.handleProductClick(product)} style={{cursor: 'pointer'}}>
                  {product.name}
                </a>
              </td>
              <td>{Math.round(product.weight)}</td>
            </tr>
          );
        });
        message = (
          <React.Fragment>
            <h3 style={{textAlign: 'center'}}>產品排名</h3>
            <table className='ui very basic table'>
              <thead>
                <tr className='center aligned'>
                  <th className='three wide'>排名</th>
                  <th>產品名稱</th>
                  <th>產品權重</th>
                </tr>
              </thead>
              <tbody>
                {productRank}
              </tbody>
            </table>
          </React.Fragment>
        );
      } else if (this.state.content === 'productDetail') {
        if (this.state.clickedProduct && this.state.connectedInfo) {
          const connectedMessage = this.state.connectedInfo.map((node, index) => {
            return (
              <tr key={node.id} className='center aligned'>
                <td>{index + 1}</td>
                <td>{node.name}</td>
                <td>{Math.round(node.edgeWeight)}</td>
              </tr>
            );
          });
          message = (
            <React.Fragment>
              <a onClick={this.backToProductRank} style={{cursor: 'pointer'}}>&lt;&lt; 返回</a>
              <h4 style={{textAlign: 'center'}}>與【{this.state.clickedProduct.name}】相連之產品關聯性排名</h4>
              <table className='ui very basic table'>
                <thead>
                  <tr className='center aligned'>
                    <th className='three wide'>排名</th>
                    <th>產品名稱</th>
                    <th>關聯權重</th>
                  </tr>
                </thead>
                <tbody>
                  {connectedMessage}
                </tbody>
              </table>
            </React.Fragment>
          );
        }
      }
    }

    if (this.state.visible) {
      return (
        <Message className='report-message' onDismiss={this.handleDismiss} style={{ backgroundColor: 'white' }}>
          {message}
        </Message>
      );
    }

    return (
      <React.Fragment />
    );
  }
}
