const Web3 = require('web3');
const ostIcon = require('../images/ost.jpg');
const ethereumIcon = require('../images/ethereum.png');

const auxiliaryRPC = 'http://34.243.117.168:41405';
const originRPC = 'http://34.244.36.178:40005';
const web3Origin = new Web3(new Web3.providers.HttpProvider(originRPC));
const web3Auxiliary = new Web3(new Web3.providers.HttpProvider(auxiliaryRPC));

const supportedTokens = [
  {
    type: 'ERC',
    address: '0xd426b22f3960d01189a3d548b45a7202489ff4de',
    logo: ostIcon,
    chain: 'origin',
    web3: web3Origin,
    gatewayAddress: '0xe11e76C1ecA13Ae4ABA871EabDf37C24b8e1928B',
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
  ostComposerAddress: '0xeaa192d486ac5243886a28001e27a68cae5fde4b',
  getSupportedTokens: () => {
    if (supportedTokens) {
      return supportedTokens;
    }
    return [];
  },
  originRPC: originRPC
};
export default Mosaic;
