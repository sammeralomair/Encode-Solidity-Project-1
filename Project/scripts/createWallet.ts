import { ethers } from "ethers";
import "dotenv/config";

/** 
 * > createWallet
 * 
 * Create a wallet and output the mnemoic phrase and private key.
 */
async function main() {
    const newWallet = ethers.Wallet.createRandom();
    console.log(newWallet);
    console.log(newWallet.mnemonic);
    console.log(newWallet.privateKey);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});