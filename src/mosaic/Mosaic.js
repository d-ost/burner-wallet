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
    faucetURL:'http://3.248.54.171:60502',
    chainId:'5',
    balance:'0',
    eip20TokenBalance:'0',
  },
  {
    type: 'ERC',
    address: '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6',
    logo: ethereumIcon,
    chain: 'origin',
    web3: web3Origin,
    gatewayAddress: '0x6649c6FF3629aE875b91B6C1551139c9feaA2514',
    faucetURL:'http://3.248.54.171:60501',
    chainId:'5',
    balance:'0',
    eip20TokenBalance:'0',
  },
  {
    type: 'BASE',
    logo: ethereumIcon,
    chain: 'origin',
    web3: web3Origin,
    symbol: 'ETH',
    faucetURL:'http://3.248.54.171:60500',
    chainId:'5',
    balance:'0',
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
    chainId:'',
    balance:'0',
  }
];
const Mosaic = {
  ostComposerAddress: '0xEAA192D486ac5243886a28001E27A68caE5FDE4B',
  getSupportedTokens: () => {
    if (supportedTokens) {
      return supportedTokens;
    }
    return [];
  },
  originRPC: originRPC
};
export default Mosaic;
