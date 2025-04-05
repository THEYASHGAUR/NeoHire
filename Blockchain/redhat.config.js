require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  defaultNetwork: "sepolia",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL, // Your Sepolia RPC URL from an RPC provider
      accounts: [process.env.PRIVATE_KEY] // Your private key for deployment
    }
  },
  solidity: "0.8.17"
};
