const fs = require('fs')
const { ethers, artifacts } = require('hardhat')

async function main() {
   const [deployer, user1] = await ethers.getSigners()
   const DecentratwitterFactory = await ethers.getContractFactory('Decentratwitter')
   const decentratwitter = await DecentratwitterFactory.deploy()
   const contractDir = __dirname + '/../src/contractsData'

   if (!fs.existsSync(contractDir)) {
      fs.mkdirSync(contractDir)
   }

   fs.writeFileSync(
      contractDir + `/decentratwitter-address.json`,
      JSON.stringify({ address: decentratwitter.address }, undefined, 2)
   )

   const contractArtifact = artifacts.readArtifactSync("Decentratwitter");

   fs.writeFileSync(
      contractDir + `/decentratwitter.json`,
      JSON.stringify(contractArtifact, null, 2)
   )
   console.log("Decentratwitter deployed to:", decentratwitter.address)
}

main()
   .then(() => process.exit(0))
   .catch((error) => {
      console.error(error);
      process.exit(1);
   });