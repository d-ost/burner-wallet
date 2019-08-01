import React from 'react';
import axios from 'axios';
import { Scaler } from "dapparatus";
const abi = require("../mosaic-abi/EIP20.abi");

export default class EIP20Token extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      EIP20Token: false,
      EIP20TokenBalance: 0,
    }
  }


  componentDidMount(){

    const EIP20Token = new this.props.token.web3.eth.Contract(abi,this.props.token.address);

    this.setState({
      EIP20Token: EIP20Token,
      logo: this.props.token.logo,
      eip20TokenBalance: this.props.token.web3.utils.fromWei(""+0,'ether'),
    },()=>{
    })

    EIP20Token.methods.symbol().call().then((symbol)=>{
      this.setState({
        eip20TokenSymbol: symbol
      },()=>{
        this.props.token.symbol = symbol;
      })
    });

    setInterval(this.pollInterval.bind(this),2500)
    setTimeout(this.pollInterval.bind(this),30)
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

  async pollInterval(){

    if(this.state && this.state.EIP20Token){
      let eip20TokenBalance = await this.state.EIP20Token.methods.balanceOf(this.props.address).call()
      this.props.token.eip20TokenBalance = eip20TokenBalance;
      let balance = await this.props.token.web3.eth.getBalance(this.props.address);
      this.props.token.balance = balance;
      eip20TokenBalance = this.props.token.web3.utils.fromWei(""+eip20TokenBalance,'ether')
      this.setState({eip20TokenBalance})

    }
  }

  clicked(name){
    console.log("secondary button "+name+" was clicked")
    // /*
    // Time to make a transaction with EIP20Token!
    // */
    // this.props.tx(this.state.EIP20Token.updateVar(name),120000,0,0,(result)=>{
    //   console.log(result)
    // })

  }

  canBoost() {
    return this.props.token.type === 'ERC'
      && this.props.token.chain !== 'auxiliary' &&
      this.state.eip20TokenBalance !== '0'
  }

  getSymbol() {
    let symbol = this.state.eip20TokenSymbol;
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
              balance:this.state.eip20TokenBalance,
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

    console.log('can boost erc20', this.canBoost());
    if(!this.state.EIP20Token){
      return (
        <div>
          LOADING EIP20Token...
        </div>
      )
    }

    let opacity = 0.95;
    let iconDisplay = <img src={this.state.logo} style={{maxWidth:50,maxHeight:50}}/>

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
              {this.state.eip20TokenBalance.toString(10).slice(0,8)}
            </div>
          </Scaler>
        </div>
      </div>
    )
  }

}
