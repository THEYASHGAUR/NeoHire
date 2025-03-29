async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);
  
    const ResumeHash = await ethers.getContractFactory("ResumeHash");
    const resumeHash = await ResumeHash.deploy();
    await resumeHash.deployed();
  
    console.log("ResumeHash deployed to:", resumeHash.address);
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  