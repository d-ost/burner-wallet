import React from 'react';
import axios from 'axios';
import { Scaler } from "dapparatus";
const abi = require("../mosaic-abi/EIP20.abi");

export default class EIP20Token extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      EIP20Token: false
    }
  }


  componentDidMount(){
    const EIP20Token = new this.props.token.web3.eth.Contract(abi,this.props.token.address);

    EIP20Token.methods.symbol().call().then((symbol)=>{
      this.props.token.symbol = symbol;
    });
    this.setState({
      EIP20Token: EIP20Token
    },()=>{
    })
  }

  async fundFromFaucet() {
    console.log('Funding for faucet ');
    const {faucetURL, chainId} = this.props.token;
    const beneficiary = this.props.metaAccount.address;

    console.log('faucetURL ', faucetURL, 'chainId ',chainId,'beneficiary ',beneficiary );
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

  async getBalance(){

    if(this.state && this.state.EIP20Token){
      this.props.token.eip20TokenBalance = await this.state.EIP20Token.methods.balanceOf(this.props.address).call()
      this.props.token.balance = await this.props.token.web3.eth.getBalance(this.props.address);
    }
  }

  canBoost() {
    return this.props.token.type === 'ERC'
      && this.props.token.chain !== 'auxiliary' &&
      this.props.token.eip20TokenBalance !== '0'
  }

  getSymbol() {
    let symbol = this.props.token.symbol;
    if (symbol === undefined) {
      return 'loading...';
    }
    if (this.props.token.chain === 'auxiliary') {
      symbol = symbol+' 💪';
    }
    return symbol;
  }

  getBoostButton() {
      return (
        <button style={{marginRight: '15px',
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
          onClick={() => this.props.handleBoost({
              token: this.props.token,
              balance:this.props.token.eip20TokenBalance,
              metaAccount: this.props.metaAccount
            }
            )}
        >
          Boost
        </button>
      );
  }

  getFaucetButton() {
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

  render(){
    this.getBalance();

    if(!this.state.EIP20Token){
      return (
        <div>
          LOADING EIP20Token...
        </div>
      )
    }

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
          {this.canBoost() ? this.getBoostButton() : this.getFaucetButton()}
          <Scaler config={{startZoomAt:400,origin:"200px 30px",adjustedZoom:1}} style={{    display: 'inlineBlock',
            verticalAlign: 'middle',
            marginLeft: '15px'}}>
            <div style={{fontSize:40,letterSpacing:-2}}>
              {this.props.token.web3.utils.fromWei(this.props.token.eip20TokenBalance,'ether').toString(10).slice(0,8)}
            </div>
          </Scaler>
        </div>
      </div>
    )
  }

}
