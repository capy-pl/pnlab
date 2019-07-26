import React, { PureComponent } from 'react';
import { Message } from 'semantic-ui-react';

interface ProductRankProps {
  productRankInfo?: [];
  updateProductGraph: (productName) => void;
}

interface MessageState {
  visible: boolean;
  clickedProduct?: {};
  content: string;
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
  }

  public handleDismiss() {
    this.setState({ visible: false });
  }

  public handleProductClick(product) {
    this.setState({clickedProduct: product}, () => {
      this.props.updateProductGraph(this.state.clickedProduct);
    });
    this.setState({content: 'productDetail'});
  }

  public backToProductRank() {
    this.setState({content: 'productRank'});
    this.setState({clickedProduct: {}}, () => {
      this.props.updateProductGraph(this.state.clickedProduct);
    });
  }

  public render() {
    let message;
    if (this.state.content === 'productRank') {
      const productRank = this.props.productRankInfo.map((product, index) => {
        return(
          <tr key={product.name} className='center aligned'>
            <td>{index + 1}</td>
            <td><a onClick={() => this.handleProductClick(product)} style={{cursor: 'pointer'}}>{product.name}</a></td>
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
      message = (
        <React.Fragment>
          <a onClick={this.backToProductRank} style={{cursor: 'pointer'}}>&lt;&lt; 返回</a>
          <h4 style={{textAlign: 'center'}}>與【{this.state.clickedProduct.name}】相連之產品排名</h4>
        </React.Fragment>
      );
    }

    if (this.state.visible) {
      return (
        <Message onDismiss={this.handleDismiss} style={{ backgroundColor: 'white' }}>
          {message}
        </Message>
      );
    }

    return (
      <p />
    );
  }
}
