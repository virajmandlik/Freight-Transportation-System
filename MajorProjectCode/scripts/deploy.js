async function main() {
  const FreightContract = await ethers.getContractFactory("Freight");

  // Deploy contract
  const freight = await FreightContract.deploy();
  console.log("Contract deployed at:", freight.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
      console.error(error);
      process.exit(1);
  });
