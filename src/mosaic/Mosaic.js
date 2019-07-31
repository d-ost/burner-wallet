const Web3 = require('web3');
const ostIcon = require('../images/ost.jpg');
const ethereumIcon = require('../images/ethereum.png');

const web3Origin = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:41515'));
const web3Auxiliary = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:41000'));

const supportedTokens = [
  {
    type: 'ERC',
    address: '0x9AC77F4c0ca4D0F2142D7a77175cf4F1295fb2d8',
    logo: ostIcon,
    chain: 'origin',
    web3: web3Origin
  },
  {
    type: 'BASE',
    logo: ethereumIcon,
    chain: 'origin',
    web3: web3Origin,
    symbol: 'ETH'
  },
  {
    type: 'ERC',
    address: '0x19F64B29789F02FFcCE2c37DFB3d65FEaDdea66a',
    logo: ostIcon,
    chain: 'auxiliary',
    web3: web3Auxiliary
  },
  {
    type: 'BASE',
    logo: ostIcon,
    chain: 'auxiliary',
    web3: web3Auxiliary,
    symbol: 'ST Prime'
  }
];
const Mosaic = {
  ostComposerAddress: '0xC0996cF47c33c138b45e9E043F180a5653a752a0',
  getSupportedTokens: () => {
    if (supportedTokens) {
      return supportedTokens;
    }
    return [];
  }
};
export default Mosaic;
