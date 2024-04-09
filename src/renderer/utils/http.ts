type Headers = Record<string, string>;

interface RequestInput {
  body?: BodyInit | Document;
  headers?: Headers;
  method?: string;
  url: string;
}

export const request = async <T>({ method = "GET", url, headers = {}, body = "" }: RequestInput): Promise<T> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    Object.keys(headers).forEach(key => {
      xhr.setRequestHeader(key, headers[key]);
    });
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response as T);
      } else {
        reject(xhr.statusText);
      }
    };
    xhr.onerror = () => {
      reject(xhr.statusText);
    };
    xhr.send(body as Document);
  });
};
