/// <reference types="vite/client" />
/// <reference types="arconnect" />
import { MetaMaskInpageProvider } from '@metamask/providers';

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}
