import { ArweaveWebWallet } from 'arweave-wallet-connector'

const wallet = new ArweaveWebWallet({ // Initialize the wallet as soon as possible to get instant auto reconnect
  name: 'Permeaemail',
  logo: 'https://arweave.net/aQwuIBqt4Iz5n837EMzor_lIaNl8lBBsRb_Yqup0xQI'
})

wallet.setUrl('arweave.app')
export default wallet;

