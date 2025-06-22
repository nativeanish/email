/// <reference types="vite/client" />
/// <reference types="arconnect" />
import { MetaMaskInpageProvider } from '@metamask/providers';

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}
declare module 'vite-plugin-node-stdlib-browser' {
  const plugin: any;
  export default plugin;
}