import React, { PureComponent } from 'react';
import { Message } from 'semantic-ui-react';

interface ProductRankProps {
  productRankInfo?: {};
}

interface MessageState {
  visible: boolean;
}

export default class ProductRank extends PureComponent<ProductRankProps, MessageState> {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
    };
    this.handleDismiss = this.handleDismiss.bind(this);
  }

  public handleDismiss(): void {
    this.setState({ visible: false });
    setTimeout(() => {
      this.setState({ visible: true });
    }, 2000);
  }

  public render() {
    const productRank = this.props.productRankInfo.map((product) => {
      return(
        <tr key={product.name} className='center aligned'>
          <td>{product.rank}</td>
          <td>{product.name}</td>
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
      <p>
        <br />
        <i>The message will return in 2s</i>
        <br />
        <br />
      </p>
    );
  }
}
