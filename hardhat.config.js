require("@nomicfoundation/hardhat-toolbox");
require("dotenv/config")
//var HardhatUserConfig = require("hardhat/config").HardhatUserConfig;

/** @type import('hardhat/config').HardhatUserConfig */

const privateKey= process?.env?.PRIVATE_KEY?.trim() ?? "";
const polygonScanApiKey = process?.env?.POLYGON_SCAN_API_KEY?.trim() ?? "";
module.exports = {
  solidity: {
    version: "0.8.20"
  },
  networks: {
    mumbai: {
      accounts: [privateKey],
      url: "https://rpc-mumbai.maticvigil.com"
    }
  },
  etherscan: {
    apiKey: {
      polygonMumbai: polygonScanApiKey
    }
  }

};


/*
deploy.setDescription("Deploys counter contacts to the network");

const config: HardhatUserConfig = {

}
*/
