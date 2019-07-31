import React from 'react';
import { Scaler } from "dapparatus";
export default class BaseToken extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      balance: 0,
    }
  }

  componentDidMount(){
    console.log("EIP20Token MODULE MOUNTED",);
    this.props.token.web3.eth.getBalance(this.props.address).then((balance)=>{
      this.setState({
        balance: this.props.token.web3.utils.fromWei(""+balance,'ether')
      },()=>{
      })
    });

    setInterval(this.pollInterval.bind(this),2500);
    setTimeout(this.pollInterval.bind(this),30);
  }

  async pollInterval(){
    let balance = await this.props.token.web3.eth.getBalance(this.props.address);
    balance = this.props.token.web3.utils.fromWei(""+balance,'ether')
    this.setState({balance})
  }

  clicked(name){
    console.log("secondary button "+name+" was clicked")

  }

  render(){
    let opacity = 0.95;
    let iconDisplay = <img src={this.props.token.logo} style={{maxWidth:50,maxHeight:50}}/>

    return (
      <div className="balance row" style={{opacity,paddingBottom:0,paddingLeft:20}}>
        <div className="avatar col p-0">
          {iconDisplay}
          <div style={{position:'absolute',left:60,top:12,fontSize:14,opacity:0.77, whiteSpace: 'nowrap'}}>
            {this.props.token.symbol}
          </div>
        </div>
        <div style={{marginRight:25, marginLeft: 'auto'}}>
          <Scaler config={{startZoomAt:400,origin:"200px 30px",adjustedZoom:1}} style={{    display: 'inlineBlock',
            verticalAlign: 'middle',
            marginLeft: '15px'}}>
            <div style={{fontSize:40,letterSpacing:-2}}>
              {this.state.balance.toString(10).slice(0,8)}
            </div>
          </Scaler>
        </div>
      </div>
    )
  }
}
