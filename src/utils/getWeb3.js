import Web3 from 'web3'
import HDWalletProvider from 'truffle-hdwallet-provider';
//0x22c57F0537414FD95b9f0f08f1E51d8b96F14029
const mnemonic = "drill hunt food team moment mistake bird attitude tunnel ecology sister resist";
let provider = new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/a49073200d6d4eeb8665b9a9ec2f73c5");




let getWeb3 = new Promise(function (resolve, reject) {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener('load', function () {
        var results
        var web3 = window.web3

        // Checking if Web3 has been injected by the browser (Mist/MetaMask)
        if (typeof web3 !== 'undefined') {
            // Use Mist/MetaMask's provider.
            web3 = new Web3(web3.currentProvider)
            // web3 = new Web3(provider)

            results = {
                web3: web3
            }

            console.log('Injected web3 detected.');

            resolve(results)
        } else {
            // Fallback to localhost if no web3 injection. We've configured this to
            // use the development console's port by default.
            // var provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545')

            // web3 = new Web3(provider)
            web3 = new Web3(provider)

            results = {
                web3: web3
            }

            console.log('No web3 instance injected, using Local web3.');

            resolve(results)
        }
    })
})

export default getWeb3
