type Headers = Record<string, string>;

interface RequestInput {
    method?: string;
    url: string;
    headers?: Headers;
    body?: BodyInit | Document;
}

export const request = async ({
    method = "GET",
    url,
    headers = {},
    body = "",
}: RequestInput): Promise<unknown> => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        Object.keys(headers).forEach((key) => {
            xhr.setRequestHeader(key, headers[key]);
        });
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
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
