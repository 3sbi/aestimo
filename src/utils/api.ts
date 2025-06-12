// API for easier API calls on the client
class API {
  private async request(
    method: "GET" | "POST" | "PATCH" | "DELETE",
    url: string,
    body?: Record<string, unknown> | string
  ) {
    const init: RequestInit = {
      method,
      headers: { "Content-Type": "application/json;charset=utf-8" },
    };
    if (body) {
      init.body = JSON.stringify(body);
    }
    return fetch(url, init);
  }

  get(url: string) {
    return this.request("GET", url);
  }

  post(url: string, body?: Record<string, unknown> | string) {
    return this.request("POST", url, body);
  }

  patch(url: string, body?: Record<string, unknown> | string) {
    return this.request("PATCH", url, body);
  }

  delete(url: string, body?: Record<string, unknown> | string) {
    return this.request("DELETE", url, body);
  }
}

const api = new API();

export { api };
