import axios from "axios";
import formurlencoded from "form-urlencoded";
import {
    setLogin,
    setUserId,
    setUserName,
    setAccessToken,
    logOut,
} from "../state/loginSlice";
import { RootState, store } from "../../state/store";
import { useDispatch, useSelector } from "react-redux";
import { getDeviceId } from "../utils/authUtils";

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
            throw error;
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
        withCredentials: true, // ! TODO Verify when needed
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    })
        .then((response) => {
            if (response.status === 200) {
                store.dispatch(setAccessToken(response.data.access_token)); // To redux state
                store.dispatch(setUserId(response.data.user_id)); // To redux state
                store.dispatch(setUserName(response.data.user_name)); // To redux state
                store.dispatch(setLogin("yes"));
                return response;
            } else {
                store.dispatch(setLogin("no"));
            }
        })
        .catch(function (error) {
            store.dispatch(setLogin("no"));
            throw error;
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
        withCredentials: true, // ! TODO Verify when needed
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
                store.dispatch(logOut()); // To redux state
                return response;
            }
        })
        .catch(function (error) {
            throw error;
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
    console.log("refreshToken");
    return axios({
        method: "post",
        url: process.env.REACT_APP_JWT_API_URL! + "refresh-token",
        withCredentials: true, // ! TODO Verify when needed
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
                if (response && response.data.success === true) {
                    store.dispatch(setAccessToken(response.data.access_token)); // To redux state
                } else {
                    store.dispatch(logOut()); // To redux state
                }
                return response;
            }
        })
        .catch(function (error) {
            throw error;
        });
}

/**
 * Checks if the user is already logged into the application
 * at applications startup.
 * This is needed to keep the user logged also when the app is
 * closed and then reopened.
 *
 * @param accessToken string refresh token
 * @param deviceId string device id
 *
 * @returns void. Doesn't returns nothing, just updates the Redux status for the user.
 */
export function checkIfAppIsLoggedOnOpen() {
    const deviceId = getDeviceId();
    axios({
        method: "post",
        url: process.env.REACT_APP_JWT_API_URL! + "re-auth",
        withCredentials: true, // ! TODO Verify when needed
        data: formurlencoded({
            device_id: deviceId,
        }),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    })
        .then((response) => {
            if (response.status === 200 && response.data.success === true) {
                store.dispatch(setAccessToken(response.data.access_token)); // To redux state
                store.dispatch(setUserId(response.data.user_id)); // To redux state
                store.dispatch(setUserName(response.data.user_name)); // To redux state
                store.dispatch(setLogin("yes"));
            } else {
                store.dispatch(setLogin("no"));
            }
        })
        .catch(function (error) {
            store.dispatch(setLogin("no"));
            // console.log(error);
            // throw new Error(error);
        });
}
