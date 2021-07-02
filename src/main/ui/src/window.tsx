declare global {
  // noinspection JSUnusedGlobalSymbols
  interface Window {
    isAdmin: boolean,
    license: string,
    token: string;
  }
}

const set = (key: string, value: string) => {
  let expiryMinutes = 30;
  let expirationDate = new Date(new Date().getTime() + (60000 * expiryMinutes));
  window.sessionStorage.setItem("expiration_date", expirationDate.toISOString());
  window.sessionStorage.setItem(key, value);
}
const get = (key: string) => {
  let expiryDateStr = window.sessionStorage.getItem("expiration_date");
  let value = window.sessionStorage.getItem(key);
  if (value !== null && expiryDateStr !== null) {
      let expirationDate = new Date(expiryDateStr)
      if (expirationDate > new Date()) {
        return value
      } else {
        window.sessionStorage.removeItem(key)
      }
  }
  return null
}

export const setGlobalToken = (token: string) => set("token", token);
export const getGlobalToken = () => get("token");

export const setGlobalLicense = (license: string) => set("license", license);
export const getGlobalLicense = () => get("license");

export const setGlobalIsAdmin = (isAdmin: boolean) => set("isAdmin", String(isAdmin));

export const getGlobalIsAdmin = () => get("isAdmin") === "true";

export function formatPrice(num: number) { return (num / 100).toFixed(2) }

export { };