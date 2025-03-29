const { ethers } = require("ethers");
require("dotenv").config();

// Use the deployed contract address from your .env file.
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

// Minimal ABI for our contract function.
const resumeHashAbi = [
  "function recordHash(string resumeId, string hashValue) public"
];

async function recordResumeHash(resumeId, hashValue) {
  // Connect to the Sepolia network.
  const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, resumeHashAbi, wallet);

  // Send transaction to record the hash.
  const tx = await contract.recordHash(resumeId, hashValue);
  await tx.wait();
  console.log("Hash recorded on-chain, transaction hash:", tx.hash);
  return tx.hash;
}

// Allow standalone usage.
if (require.main === module) {
  const resumeId = process.argv[2];
  const hashValue = process.argv[3];
  if (!resumeId || !hashValue) {
    console.log("Usage: node recordHash.js <resumeId> <hashValue>");
    process.exit(1);
  }
  recordResumeHash(resumeId, hashValue)
    .then(() => process.exit(0))
    .catch(err => { console.error(err); process.exit(1); });
}

module.exports = { recordResumeHash };
