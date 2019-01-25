function defaultHeadersResolver(url, accessToken) {
    const headers = new Headers();

    if (url === '/api/token') {
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
    } else {
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${accessToken}`);
    }

    return headers;
}

function getRequest(url, accessToken, requestMethod, requestBody, headersResolver) {
    const init = {
        body: requestBody ? requestBody : null,
        headers: headersResolver(url, accessToken),
        method: requestMethod,
    };

    return new Request(url, init);
}

export async function requestController(
    url,
    accessToken,
    requestMethod,
    requestBody,
    options) {
    const request = getRequest(url, accessToken, requestMethod, requestBody, options.headersResolver);
    const response = await fetch(request);
    const responseBody = await response.text();
    const responseJson = responseBody ? JSON.parse(responseBody) : {};

    switch (response.status) {
        case 401:
            throw new Error(responseJson && responseJson.error_description ?
                String(responseJson.error_description) :
                'The token is invalid/expired');
        case 200:
        case 204:
            return responseJson;
        case 400:
        case 500:
            return {
                error: responseJson.Message
            };
        case 404:
            return {
                error: responseJson
            };
        default:
            return {
                error: 'Something went wrong, please try again'
            };
    }
}

export function createFetchController(options) {
    options = Object.assign({}, options, {
        headersResolver: defaultHeadersResolver
    });

    return (url, accessToken, requestMethod, requestBody) => requestController(url, accessToken, requestMethod, requestBody, options);
}