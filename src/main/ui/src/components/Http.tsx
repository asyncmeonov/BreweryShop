import { getGlobalToken } from "../window";

const base = "";

async function get<T>(url: string): Promise<T> {
  let headers = new Headers({ "Content-Type": "application/json" });
  headers.append("Authorization", "Bearer " + getGlobalToken());

  return await (await fetch(base + url, { headers: headers })).json();
}

//returns a response, should be handled in caller
async function post(url: string, content: any): Promise<Response> {
  let headers = new Headers({ "Content-Type": "application/json" });
  headers.append("Authorization", "Bearer " + getGlobalToken());

  return (await fetch(base + url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(content)
  }));
}

async function remove(url: string, content: any): Promise<Response> {
  let headers = new Headers({ "Content-Type": "application/json" });
  headers.append("Authorization", "Bearer " + getGlobalToken());

  return (await fetch(base + url, {
    method: "DELETE",
    headers: headers,
    body: JSON.stringify(content)
  }));
}

async function put(url: string, content: any): Promise<Response> {
  let headers = new Headers({ "Content-Type": "application/json" });
  headers.append("Authorization", "Bearer " + getGlobalToken());

  return (await fetch(base + url, {
    method: "PUT",
    headers: headers,
    body: JSON.stringify(content)
  }));
}

export { get, post, remove, put };