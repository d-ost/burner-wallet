import React from 'react';
import Select from 'react-select';
import EIP20Token from "./EIP20Token";
import BaseToken from "./BaseToken";



export default class TokenSelector extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedOption: null
    };
  }

  componentDidMount() {
    const options = this.getOptions();
    this.setState({selectedOption: options[0]})
  }

  handleChange = selectedOption => {
    this.setState({ selectedOption });
    if (selectedOption){
      const token = this.props.tokens[selectedOption.value];
      if (token) {
        this.props.tokenChange(token)
      }
    }
  };

  getToken(token){
    console.log('token: ', token);
    if (!token) {
      return ('');
    }
    if (token.type === 'ERC') {
      return (
        <EIP20Token
          metaAccount={this.props.metaAccount}
          state={this.props.state}
          address={this.props.address}
          openScanner={this.props.openScanner.bind(this)}
          buttonStyle={this.props.buttonStyle}
          changeAlert={this.props.changeAlert}
          handleBoost={this.props.handleBoost.bind(this)}
          goBack={this.props.goBack.bind(this)}
          token={token}
        />
      );
    } else if (token.type === 'BASE') {
      return (
        <BaseToken
          metaAccount={this.props.metaAccount}
          state={this.props.state}
          address={this.props.address}
          openScanner={this.props.openScanner.bind(this)}
          buttonStyle={this.props.buttonStyle}
          changeAlert={this.props.changeAlert}
          goBack={this.props.goBack.bind(this)}
          token={token}
        />
      )
      }else {
        return ('')
      }
  }

  getOptions(){
    const options = [];

    this.props.tokens.forEach((token,index)=>{
      options.push({ value: index, label: token.symbol });
    });

    return options;
  }
  render() {
    const { selectedOption } = this.state;
    let token;
    if (selectedOption){
      token = this.props.tokens[selectedOption.value];
    }

    return (
      <div>
        { this.getToken(token) }
        <Select
          value={selectedOption}
          onChange={this.handleChange}
          options={this.getOptions()}
        />
      </div>
    )

  }
}
