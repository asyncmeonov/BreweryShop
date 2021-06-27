const base = "http://localhost:8080";

async function get<T>(url: string): Promise<T> {
  let headers = new Headers({ "Content-Type": "application/json" });
  headers.append("Authorization", "Bearer " + window.token);

  return await (await fetch(base + url, { headers: headers })).json();
}

//returns a response, should be handled in caller
async function post<T>(url: string, content: any): Promise<T> {
  let headers = new Headers({ "Content-Type": "application/json" });
  headers.append("Authorization", "Bearer " + window.token);

  return await (await fetch(base + url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(content)
  })).json();
}

async function remove<T>(url: string, content: any): Promise<T> {
  let headers = new Headers({ "Content-Type": "application/json" });
  headers.append("Authorization", "Bearer " + window.token);

  return await (await fetch(base + url, {
    method: "DELETE",
    headers: headers,
    body: JSON.stringify(content)
  })).json();
}


export { get, post, remove };