import axios from "axios";
import { store } from "../state/store";
import { useDispatch, useSelector } from "react-redux";
import { setLogin } from "../state/loginSlice";
import formurlencoded from "form-urlencoded";

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

/**
 * Kicks off authentication.
 */
export function ucExecuteLogin(
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
        grant_type: "password",
        username: email,
        password: password,
        client_id: client_id,
        client_secret: client_secret,
    };

    // provare a mandare anche le credenziali dell'utente... il sistema lo loggga??????

    axios
        .post(
            "http://mondosurf-be.local.com/oauth/token",
            {
                ...loginParameters,
            },
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        )
        .then((response) => {
            console.log("response", response);
        })
        .catch(function (error) {
            console.log("error", error);
        });
}
