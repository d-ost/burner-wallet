import React from 'react';
import Ruler from "./Ruler";
import Balance from "./Balance";
import cookie from 'react-cookies'
import {CopyToClipboard} from "react-copy-to-clipboard";
import Blockies from 'react-blockies';
import {scroller} from 'react-scroll'
import i18n from '../i18n';
import EIP20ABI from '../mosaic-abi/EIP20.abi';
import OSTComposerABI from '../mosaic-abi/OSTComposer.abi';
import GatewayABI from '../mosaic-abi/Gateway.abi';
import Web3 from 'web3';

const queryString = require('query-string');

export default class Boost extends React.Component {

  constructor(props) {
    super(props);
    let initialState = {
      amount: '',
      beneficiary: '',
      canSend: false,
    };
    this.state = initialState;
    this.boost = this.boost.bind(this);

  }

  componentDidMount() {
    this.setState({canSend: this.canSend()});
    setTimeout(() => {
      if (!this.state.beneficiary && this.addressInput) {
        this.addressInput.focus();
      } else if (!this.state.amount && this.amountInput) {
        this.amountInput.focus();
      } else
        setTimeout(() => {
          this.scrollToBottom()
        }, 30)
    }, 350)
  }

  canSend() {
    return (this.state.beneficiary && this.state.beneficiary.length === 42 && (this.state.amount > 0))
  }

  scrollToBottom() {
    console.log("scrolling to bottom")
    scroller.scrollTo('theVeryBottom', {
      duration: 500,
      delay: 30,
      smooth: "easeInOutCubic",
    })
  }

  boost = async () => {
    if (!this.state.canSend) {
      return false;
    }

    const {web3, ostComposerAddress, valueTokenAddress, gatewayAddress, metaAccount} = this.props;
    const eip20Contract = new web3.eth.Contract(EIP20ABI, valueTokenAddress);

    let privateKey = metaAccount.privateKey;
    let from = web3.utils.toChecksumAddress(metaAccount.address);
    console.log('this.state.amount ',this.state.amount);
    let methodCall = eip20Contract.methods.approve(ostComposerAddress, this.state.amount);
    let receipt = await this.sendTransaction(
      methodCall,
      valueTokenAddress,
      from,
      web3,
      privateKey,
      'Approved Token for boost'
    );
    console.log("Approve RECEIPT", receipt)

    console.log('ost composer transactions');
    const ostComposer = new web3.eth.Contract(OSTComposerABI, ostComposerAddress);
    console.log('interact generation')
    const stakerProxy = await ostComposer.methods.stakerProxies(from).call();
    console.log('staker proxy  ',stakerProxy);
    let nonce = 1;
    if (stakerProxy !== '0x0000000000000000000000000000000000000000') {
      const gateway = new web3.eth.Contract(GatewayABI, gatewayAddress);
      console.log('Getting nonce from  ', nonce);
      nonce = await gateway.methods.getNonce(stakerProxy).call();
    }
    console.log('nonce  ', nonce);
    console.log('staker proxy ', stakerProxy);
   console.log('this.state  ', this.state);
   const allowance = await eip20Contract.methods.allowance(from, ostComposerAddress).call();
   console.log('allowance  ' ,allowance);
    const balance = await eip20Contract.methods.balanceOf(from).call();
   console.log('balance  ' ,balance);
    methodCall = ostComposer.methods.requestStake(
      this.state.amount,
      this.state.beneficiary,
      0, // Gasprice
      0, // Gas limit
      nonce ,
      gatewayAddress,
    );
     receipt = await this.sendTransaction(
      methodCall,
      ostComposerAddress,
      from,
      web3,
      privateKey,
      'Initiated token boosting, you should see boosted token in sometime'
    );
    console.log("Request stake RECEIPT", receipt);
    console.log('this.state ', this.state);
  };

  async sendTransaction(methodCall, to, from, web3, privateKey, message) {
    console.log('estimating transaction');
    let estimatedGas ='3700724';// await methodCall.estimateGas();
    console.log('estimatedGas  ', estimatedGas);
    let tx = {
      data: methodCall.encodeABI(),
      to: to,
      value: 0,
      from: from,
      gas: estimatedGas,
      gasPrice: 0x2540BE400 //10 gwei
    };
    const signedApproveTransaction = await web3.eth.accounts.signTransaction(tx, privateKey);
    console.log('signedApproveTransaction  ', signedApproveTransaction);
    const receipt = await web3.eth.sendSignedTransaction(signedApproveTransaction.rawTransaction);
    console.log('receipt  ', receipt);
    this.props.changeAlert({
      type: 'success', message: message
    });
    return receipt;
  }

  updateState = (key, value) => {
    this.setState({[key]: value}, () => {
      this.setState({canSend: this.canSend()}, () => {
        if (key != "message") {
          this.bounceToAmountIfReady()
        }
      })
    });
  };

  handlerError = (error) => {
    console.log("Error ", error)
    let errorString = error.toString()
    if (errorString.indexOf("have enough funds") >= 0) {
      this.props.changeAlert({
        type: 'danger', message: 'Not enough funds' +
          ' to' +
          ' send message.'
      })
    } else {
      this.props.changeAlert({type: 'danger', message: errorString})
    }
  }

  bounceToAmountIfReady() {
    if (this.state.toAddress && this.state.toAddress.length === 42) {
      this.amountInput.focus();
    }
  }

  render() {
    let {beneficiary, canSend} = this.state;

    let amountInputDisplay = (
      <input type="number" className="form-control" placeholder="0.00"
             value={this.state.amount}
             ref={(input) => {
               this.amountInput = input;
             }}
             onChange={event => this.updateState('amount', event.target.value)}/>
    );

    return (
      <div>
        <div className="content row">
          <div className="form-group w-100">
            <div className="form-group w-100">
              <label
                htmlFor="amount_input">{i18n.t('boost.beneficiary')}</label>
              <div className="input-group">
                <input type="text" className="form-control" placeholder="0x..."
                       value={this.state.toAddress}
                       ref={(input) => {
                         this.addressInput = input;
                       }}
                       onChange={event => this.updateState('beneficiary', event.target.value)}/>
              </div>
            </div>
            <div>  {this.state.beneficiary && this.state.beneficiary.length === 42 &&
            <CopyToClipboard text={beneficiary.toLowerCase()}>
              <div style={{cursor: "pointer"}}
                   onClick={() => this.props.changeAlert({
                     type: 'success',
                     message: beneficiary.toLowerCase() + ' copied to clipboard'
                   })}>
                <div style={{opacity: 0.33}}>{this.state.fromEns}</div>
                <Blockies seed={beneficiary.toLowerCase()} scale={10}/>
              </div>
            </CopyToClipboard>
            }</div>
            <label htmlFor="amount_input">{i18n.t('boost.amount')}</label>
            <div className="input-group">

              {amountInputDisplay}
            </div>
          </div>
          <button name="theVeryBottom"
                  className={`btn btn-lg w-100 ${canSend ? '' : 'disabled'}`}
                  style={this.props.buttonStyle.primary}
                  onClick={this.boost}>
            Boost
          </button>
        </div>
      </div>
    )
  }
}
