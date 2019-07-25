import React, { PureComponent } from 'react';
import { Message } from 'semantic-ui-react';

interface ProductRankProps {
  productRankInfo?: [];
  updateProductGraph: (productName) => void;
}

interface MessageState {
  visible: boolean;
  clickedProduct?: string;
}

export default class ProductRank extends PureComponent<ProductRankProps, MessageState> {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
    };
    this.handleDismiss = this.handleDismiss.bind(this);
    this.handleProductClick = this.handleProductClick.bind(this);
  }

  public handleDismiss(): void {
    this.setState({ visible: false });
  }

  public handleProductClick(product): void {
    this.setState({clickedProduct: product});
    this.props.updateProductGraph(product);
  }

  public render() {
    const productRank = this.props.productRankInfo.map((product, index) => {
      return(
        <tr key={product.name} className='center aligned'>
          <td>{index + 1}</td>
          <td><a onClick={() => this.handleProductClick(product)} style={{cursor: 'pointer'}}>{product.name}</a></td>
          <td>{Math.round(product.weight)}</td>
        </tr>
      );
    });

    if (this.state.visible) {
      return (
        <Message onDismiss={this.handleDismiss} style={{ backgroundColor: 'white' }}>
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
        </Message>
      );
    }

    return (
      <p />
    );
  }
}
