import axios from "axios";
import formurlencoded from "form-urlencoded";

/**
 * Calls the API to check if the sent email is existing or not.
 * If it is existing the user wants to login.
 * It it is not existing the user wants to register.
 *
 * @param email
 * @returns a promise. Response is true if the mail exists, false if it doesn't exist.
 */
export function mailCheck(email: string) {
    return axios({
        method: "post",
        url: process.env.REACT_APP_JWT_API_URL! + "mail-check",
        data: formurlencoded({
            email: email,
        }),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    })
        .then((response) => {
            if (response.status === 200) {
                return response;
            }
        })
        .catch(function (error) {
            console.log(error);
            throw new Error(error);
        });
}

/**
 * Calls the API to authorize the user, creating the auth and refresh tokens.
 *
 * @param email
 * @param password
 * @param deviceId
 *
 * @returns a promise. Response is true if the mail exists, false if it doesn't exist.
 */
export function auth(email: string, password: string, deviceId: string) {
    return axios({
        method: "post",
        url: process.env.REACT_APP_JWT_API_URL! + "auth",
        data: formurlencoded({
            email: email,
            password: password,
            device_id: deviceId,
        }),
        withCredentials: true,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    })
        .then((response) => {
            if (response.status === 200) {
                return response;
            }
        })
        .catch(function (error) {
            console.log(error);
            throw new Error(error);
        });
}

/**
 * Revokes the user authentication corresponding to the provided refresh token n and devide id.
 *
 * @param accessToken refresh token
 * @param deviceId device id
 *
 * @returns a promise. Response is true if the mail exists, false if it doesn't exist.
 */
export function revoke(accessToken: string, deviceId: string) {
    return axios({
        method: "post",
        url: process.env.REACT_APP_JWT_API_URL! + "revoke",
        withCredentials: true,
        data: formurlencoded({
            access_token: accessToken,
            device_id: deviceId,
        }),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    })
        .then((response) => {
            if (response.status === 200) {
                return response;
            }
        })
        .catch(function (error) {
            console.log(error);
            throw new Error(error);
        });
}

/**
 * Refreshes the access and refresh token.
 *
 * @param accessToken refresh token
 * @param deviceId device id
 *
 * @returns a promise. Response is the new accessToken if it was refreshed, ? if there was en error.
 */
export function refreshToken(accessToken: string, deviceId: string) {
    return axios({
        method: "post",
        url: process.env.REACT_APP_JWT_API_URL! + "refresh-token",
        withCredentials: true,
        data: formurlencoded({
            access_token: accessToken,
            device_id: deviceId,
        }),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    })
        .then((response) => {
            if (response.status === 200) {
                return response;
            }
        })
        .catch(function (error) {
            console.log(error);
            throw new Error(error);
        });
}
