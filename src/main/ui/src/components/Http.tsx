const base = "http://localhost:8080";

async function get<T>(url: string): Promise<T> {
  let headers = new Headers({ "Content-Type": "application/json" });
  headers.append("Authorization", "Bearer " + window.token);

  return await (await fetch(base + url, { headers: headers })).json();
}

//returns a response, should be handled in caller
async function post(url: string, content: any): Promise<Response> {
  let headers = new Headers({ "Content-Type": "application/json" });
  headers.append("Authorization", "Bearer " + window.token);

  return await (await fetch(base + url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(content)
  }));
}

async function remove(url: string, content: any): Promise<Response> {
  let headers = new Headers({ "Content-Type": "application/json" });
  headers.append("Authorization", "Bearer " + window.token);

  return await (await fetch(base + url, {
    method: "DELETE",
    headers: headers,
    body: JSON.stringify(content)
  }));
}


export { get, post, remove };