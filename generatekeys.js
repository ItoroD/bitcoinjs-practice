import bitcoin from "bitcoinjs-lib";
import ECPairFactory from "ecpair";
import * as ecc from "tiny-secp256k1";
import prompt from "prompt-sync";
import readline from "node:readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function createAddress() {
  //const prompt = require("prompt-sync")({ sigint: true });
  //const readline = require("readline");
  // const rl = readline.createInterface({
  //   input: process.stdin,
  //   output: process.stdout,
  // });
  // let txid;
  // rl.question("What is your transactionId? ", function (val) {
  //   console.log(`Transaction ID is ${val}`);
  //   txid = val;
  //   //console.log(txid);
  //   rl.close();
  // });

  const network = bitcoin.networks.testnet;
  console.log(network);
  const ECPair = ECPairFactory.ECPairFactory(ecc);
  const keyPair = ECPair.makeRandom({ network });
  //console.log(keyPair);
  const { address } = bitcoin.payments.p2pkh({
    pubkey: keyPair.publicKey,
    network: network,
  });
  console.log(address);
  console.log(keyPair);
  return keyPair;
}

function question(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function sendFunds() {
  const keyPair = createAddress();

  const txid = await question("What is your transactionId? ");
  const amount = await question("How much do you have? ");
  const destinationAddress = await question(
    "What address are you sending to? "
  );
  const outputNumber = await question("What is the output number?");

  console.log(`txid:  ${txid}!`);
  console.log(`Amount: ${amount}!`);

  // const outputNumber = 0;
  // const txid = "736884387c55a6c415de583f96b8fe621589dee9944648219a9eef4483ee0804";
  // const amount = 0.0008913;

  const txb = new bitcoin.Psbt();

  txb.network = bitcoin.networks.testnet;
  txb.addInput(txid, outputNumber);
  //const destinationAddress = "mv4rnyY3Su5gjcDNzbMLKBQkBicCtHUtFB";
  const minerFee = 10000;

  const outputAmount = amount * 1e8 - minerFee;
  txb.addOutput(destinationAddress, outputAmount);
  txb.signInput(outputNumber, keyPair);
  console.log(txb.build().toHex());
  rl.close();
}

sendFunds();
