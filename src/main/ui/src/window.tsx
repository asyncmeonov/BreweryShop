declare global {
  // noinspection JSUnusedGlobalSymbols
  interface Window {
    isAdmin: boolean,
    license: string,
    token: string;
  }
}

export function formatPrice(num: number) { return (num / 100).toFixed(2)} 

export {};