import axios from "axios";
import formurlencoded from "form-urlencoded";

export function jwtExecuteAuthentication(email: string, password: string) {
    return axios({
        method: "post",
        url: process.env.REACT_APP_JWT_API_URL! + "auth",
        data: formurlencoded({
            email: email,
            password: password,
        }),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
        .then((response) => {
            if (response.status === 200) {
                return response;
            }
        })
        .catch(function (error) {
            return error;
        });
}

export function jwtExecuteLogin(jwtToken: string, authCode: string) {
    return axios({
        method: "get",
        url: process.env.REACT_APP_API_URL!,
        params: {
            rest_route: "/mondo-surf-jwt-auth/v1/autologin",
            AUTH_KEY: authCode,
        },
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Bearer " + jwtToken,
        },
    })
        .then((response) => {
            if (response.status === 200) {
                console.log(response);
                return response;
            }
        })
        .catch(function (error) {
            console.log(error);
            return error;
        });
}

export function jwtExecuteRegistration(
    name: string,
    email: string,
    password: string,
    authCode: string
) {
    return axios({
        method: "post",
        url: process.env.REACT_APP_JWT_API_URL! + "users",
        data: formurlencoded({
            AUTH_KEY: authCode,
            email: email,
            password: password,
            first_name: name,
        }),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    })
        .then((response) => {
            if (response.status === 200) {
                console.log(response);
                return response;
            }
        })
        .catch(function (error) {
            console.log(error);
            return error;
        });
}

export function jwtRevokeToken(jwtToken: string) {
    return axios({
        method: "post",
        url:
            process.env.REACT_APP_JWT_API_URL! + "auth/revoke/?jwt=" + jwtToken,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    })
        .then((response) => {
            if (response.status === 200) {
                console.log(response);
                return response;
            }
        })
        .catch(function (error) {
            console.log(error);
            return error;
        });
}
