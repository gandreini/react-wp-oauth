interface ILoginFunction {
    email: string;
    password: string;
    client_id: string;
    client_secret: string;
    response_type: string;
    scope: string;
    redirect_uri: string;
    code_challenge: string;
    code_challenge_method: string;
}

export function AuthCodeExecuteLogin(
    email: string,
    password: string,
    client_id: string,
    client_secret: string,
    response_type: string,
    scope: string,
    redirect_uri: string,
    code_challenge: string,
    code_challenge_method: string
) {
    const loginParameters = {
        client_id: client_id,
        response_type: response_type,
        redirect_uri: redirect_uri,
    };

    // provare a mandare anche le credenziali dell'utente... il sistema lo loggga??????

    fetch(
        "http://mondosurf-be.local.com/oauth/authorize/?" +
            new URLSearchParams({
                ...loginParameters,
            }),
        {
            method: "GET",
            redirect: "follow",
        }
    )
        .then((response) => {
            console.log("response", response);
            if (response.redirected) {
                // window.location.href = response.url;
                window.open(
                    response.url,
                    "_blank" // <- This is what makes it open in a new window.
                );
            }
        })
        .catch(function (err) {
            console.info(err);
        });
}

export function AuthCodeExecuteAccessTokenRequest(
    client_id: string,
    client_secret: string,
    code: string,
    redirect_uri: string
) {
    const data = {
        grant_type: "authorization_code",
        code: code,
        client_id: client_id,
        client_secret: client_secret,
        redirect_uri: redirect_uri,
    };

    return fetch("http://mondosurf-be.local.com/oauth/token/", {
        method: "POST", // or 'PUT'
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Success AuthCodeExecuteAccessTokenRequest:", data);
            return data;
        })
        .catch((error) => {
            console.error("Error:", error);
            return error;
        });
}

export function AuthCodeExecuteMe(accessToken: string) {
    const meParameters = {
        access_token: accessToken,
    };

    fetch(
        "http://mondosurf-be.local.com/oauth/me/?" +
            new URLSearchParams({
                ...meParameters,
            }),
        {
            method: "GET",
        }
    )
        .then((response) => response.json())
        .then((data) => {
            console.log("Success AuthCodeExecuteMe:", data);
        })
        .catch(function (err) {
            console.info(err);
        });
}
