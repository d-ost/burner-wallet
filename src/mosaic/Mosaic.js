const Web3 = require('web3');
const ostIcon = require('../images/ost.jpg');
const ethereumIcon = require('../images/ethereum.png');

const auxiliaryRPC = 'http://127.0.0.1:41000';
const originRPC = 'http://127.0.0.1:41515';
const web3Origin = new Web3(new Web3.providers.HttpProvider(originRPC));
const web3Auxiliary = new Web3(new Web3.providers.HttpProvider(auxiliaryRPC));

const supportedTokens = [
  {
    type: 'ERC',
    address: '0x9AC77F4c0ca4D0F2142D7a77175cf4F1295fb2d8',
    logo: ostIcon,
    chain: 'origin',
    web3: web3Origin,
    gatewayAddress: '0xA7f056b1320fE619571849f138Cd1Ae2f2e64179',
    faucetURL:'',
    chainId:'',
  },
  {
    type: 'BASE',
    logo: ethereumIcon,
    chain: 'origin',
    web3: web3Origin,
    symbol: 'ETH',
    faucetURL:'',
    chainId:'',
  },
  // {
  //   type: 'ERC',
  //   address: '0x19F64B29789F02FFcCE2c37DFB3d65FEaDdea66a',
  //   logo: ostIcon,
  //   chain: 'auxiliary',
  //   web3: web3Auxiliary
  // },
  {
    type: 'BASE',
    logo: ostIcon,
    chain: 'auxiliary',
    web3: web3Auxiliary,
    symbol: 'dOST',
    faucetURL:'',
    chainId:''
  }
];
const Mosaic = {
  ostComposerAddress: '0xC0996cF47c33c138b45e9E043F180a5653a752a0',
  getSupportedTokens: () => {
    if (supportedTokens) {
      return supportedTokens;
    }
    return [];
  },
  originRPC: originRPC
};
export default Mosaic;
