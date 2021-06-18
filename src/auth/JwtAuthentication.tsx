import axios from "axios";
import { store } from "../state/store";
import { useDispatch, useSelector } from "react-redux";
import { setLogin } from "../state/loginSlice";
import formurlencoded from "form-urlencoded";

/**
 * Kicks off authentication.
 */
export function jwtInit() {
    if (localStorage.getItem("token") === null) {
        console.log("logged out...");
    } else {
        console.log("logged in...");
    }
}
export function jwtExecuteLogin(username: String, password: String) {
    const cred = {
        username: username,
        password: password,
    };

    axios({
        method: "post",
        url: "http://mondosurf-be.local.com/wp-json/jwt-auth/v1/token",
        data: formurlencoded(cred),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
        .then((response) => {
            if (response.status === 200) {
                store.dispatch(setLogin(true));
                localStorage.setItem("token", response.data.token);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

export function jwtExecuteLogut() {
    localStorage.removeItem("token");
    store.dispatch(setLogin(false));
}
