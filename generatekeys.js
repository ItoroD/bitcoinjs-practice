import bitcoin from "bitcoinjs-lib";
import ECPairFactory from "ecpair";
import * as ecc from "tiny-secp256k1";

function createAddress() {
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
}

createAddress();

const outputNumber = 0;
const txid = "736884387c55a6c415de583f96b8fe621589dee9944648219a9eef4483ee0804";
const amount = 0.0008913;

const txb = new bitcoin.TransactionBuilder();

txb.network = bitcoin.networks.testnet;
txb.addInput(txid, outputNumber);
const destinationAddress = "mv4rnyY3Su5gjcDNzbMLKBQkBicCtHUtFB";
const minerFee = 10000;

const outputAmount = amount * 1e8 - minerFee;
txb.addOutput(destinationAddress, outputAmount);
txb.sign(0, keypair);
txb.build().toHex();
