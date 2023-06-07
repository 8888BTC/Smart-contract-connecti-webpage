import { ethers } from "./ethers-5.6.esm.min.js";

import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("Connect");
const fundButton = document.getElementById("fund");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");
connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;
async function connect() {
  if (typeof window.ethereum) {
    await window.ethereum.request({ method: "eth_requestAccounts" });

    connectButton.innerHTML = "Connect😄";
  } else {
    fundButton.innerHTML = "😭😭😭";
  }
}
async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    console.log(ethers.utils.formatEther(balance));
  }
}

async function fund() {
  const ethAmount = document.getElementById("ethAmount").value;
  console.log(`Funding with ${ethAmount}`);
  if (typeof window.ethereum !== "undefined") {
    //provide / connection to the blockchain
    //signer/ wallet/ someone with some gas
    //contract that we are interacting with
    // ABI & Address
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // 获取从提供商连接的任何钱包
    const signer = provider.getSigner();
    console.log(signer);

    const contract = new ethers.Contract(contractAddress, abi, signer);

    // const nonce = await provider.getTransactionCount(
    //   signer.getAddress(),
    //   "pending"
    // );
    // console.log(`Current nonce: ${nonce}`);
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
        //   nonce: nonce,
      });
      await listenForTransactionMine(transactionResponse, provider);
      console.log("Done");
    } catch (error) {
      console.log(error);
    }
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`);
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionResponse) => {
      console.log(
        `Completed with ${transactionResponse.confirmations} confirmations`
      );
      resolve();
    });
  });
}

// withdraw
async function withdraw() {
  if (typeof window.ethereum !== "undefined") {
    console.log("Withdrawing");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // 获取从提供商连接的任何钱包
    const signer = provider.getSigner();
    console.log(signer);

    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.withdraw();

      await listenForTransactionMine(transactionResponse, provider);
    } catch (e) {
      console.log(e);
    }
  }
}
