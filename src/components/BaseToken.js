import React from 'react';
import axios from "axios";
import { Scaler } from "dapparatus";
export default class BaseToken extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount(){
    this.props.token.web3.eth.getBalance(this.props.address).then((balance)=>{
      this.props.token.balance = balance;
    });
  }

  getSymbol() {
    let symbol = this.props.token.symbol;
    if (this.props.token.chain === 'auxiliary') {
      symbol = symbol + ' 💪';
    }
    return symbol;
  }

  async fundFromFaucet() {
    const {faucetURL, chainId} = this.props.token;
    const beneficiary = this.props.metaAccount.address;

    const response = await axios.post(faucetURL, {
        beneficiary: `${beneficiary}@${chainId}`,
      }
    );

    console.log('transaction hash ', response.data.txHash);
    this.props.changeAlert({
      type: 'success',
      message: 'Funding from faucet, transaction hash ' + response.data.txHash
    });
  }


  getFaucetButton() {
    console.log('this.props.token  ', this.props.token);
    console.log('base token this.state.balance ', this.props.token.balance);
    console.log('base token this.state.balance ', typeof this.props.token.balance);
    console.log("this.state.balance === '0' ", this.props.token.balance === 0);

    if ("" + this.props.token.balance === '0' && this.props.token.chain === 'origin') {
      return (
        <button style={{
          marginRight: '15px',
          backgroundImage: 'linear-gradient(rgb(250, 125, 54), rgb(247, 107, 28))',
          backgroundColor: 'rgb(247, 107, 28)',
          color: 'rgb(255, 255, 255)',
          whiteSpace: 'nowrap',
          cursor: 'pointer',
          paddingLeft: '15px',
          paddingRight: '15px',
          border: "none",
          borderRadius: 3,
          fontWeight: 300,
          fontSize: '1rem',
        }}
                onClick={() => this.fundFromFaucet()}
        >
          Faucet
        </button>
      );
    }
    return ('');
  }

  async getBalance(){
    this.props.token.balance = await this.props.token.web3.eth.getBalance(this.props.address);
  }

  render(){
    this.getBalance();

    let opacity = 0.95;
    let iconDisplay = <img src={this.props.token.logo} style={{maxWidth:50,maxHeight:50}}/>

    return (
      <div className="balance row" style={{opacity,paddingBottom:0,paddingLeft:20}}>
        <div className="avatar col p-0">
          {iconDisplay}
          <div style={{position:'absolute',left:60,top:12,fontSize:14,opacity:0.77, whiteSpace: 'nowrap'}}>
            {this.getSymbol()}
          </div>
        </div>
        <div style={{marginRight:25, marginLeft: 'auto'}}>
          {this.getFaucetButton()}
          <Scaler config={{startZoomAt:400,origin:"200px 30px",adjustedZoom:1}} style={{    display: 'inlineBlock',
            verticalAlign: 'middle',
            marginLeft: '15px'}}>
            <div style={{fontSize:40,letterSpacing:-2}}>
              {this.props.token.web3.utils.fromWei(""+this.props.token.balance,'ether').toString(10).slice(0,8)}
            </div>
          </Scaler>
        </div>
      </div>
    )
  }
}
