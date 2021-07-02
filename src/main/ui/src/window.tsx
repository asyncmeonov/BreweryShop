declare global {
  // noinspection JSUnusedGlobalSymbols
  interface Window {
    isAdmin: boolean,
    license: string,
    token: string;
  }
}

const set = (key: string, value: string) => window.sessionStorage.setItem(key, value);
const get = (key: string) => window.sessionStorage.getItem(key);

export const setGlobalToken = (token: string) => set("token", token);
export const getGlobalToken = () => get("token");

export const setGlobalLicense = (license: string) => set("license", license);
export const getGlobalLicense = () => get("license");

export const setGlobalIsAdmin = (isAdmin: boolean) => set("isAdmin", String(isAdmin));

export const getGlobalIsAdmin = () => get("isAdmin") === "true";

export function formatPrice(num: number) { return (num / 100).toFixed(2)} 

export {};