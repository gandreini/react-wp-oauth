import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import pkceChallenge from "pkce-challenge";

import {
    setPkce,
    setAuthCode,
    setAccessToken,
    setRefreshToken,
} from "../state/loginSlice";
import { RootState } from "../state/store";
import { useDispatch, useSelector } from "react-redux";
// import { ucExecuteLogin as ExecuteLogin } from "../grant-types/ucAuthentication";
import {
    AuthCodeExecuteLogin as ExecuteLogin,
    AuthCodeExecuteAccessTokenRequest as ExecuteAccessTokenRequest,
    AuthCodeExecuteMe as ExecuteMe,
} from "../grant-types/AuthCodeAuthentication";

const Login: React.FC = (props) => {
    // React hook form.
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    // Parameters
    const email = "test@test.com";
    const password = "test";
    const client_id = process.env.REACT_APP_CLIENT_ID;
    const client_secret = process.env.REACT_APP_CLIENT_SECRET;
    const response_type = "code";
    const scope = "basic";
    const redirect_uri = process.env.REACT_APP_URL + "oauth_callback";
    const codeChallengeMethod = "s256";

    // Redux state.
    const loginPkce = useSelector((state: RootState) => state.login.pkce);
    const authCode = useSelector((state: RootState) => state.login.authCode);
    const codeChallenge = useSelector(
        (state: RootState) => state.login.pkce.code_challenge
    );
    const accessToken = useSelector(
        (state: RootState) => state.login.accessToken
    );
    const dispatch = useDispatch();

    // Handles the messages coming from the pop-up window with the login.
    useEffect(() => {
        window.addEventListener("message", setCode, false);

        return () => {
            window.removeEventListener("message", setCode, false);
        };
    }, []);

    // Sets the auth code in the Redux state.
    function setCode(event: MessageEvent) {
        if (
            event.origin === "http://localhost:3000" &&
            event.data.type === "authCode"
        ) {
            dispatch(setAuthCode(event.data.code)); // To redux state:
            console.log("event.data.code", event.data.code);
            return;
        } else {
            return;
        }
        // event.source is popup
        // event.data is "hi there yourself!  the secret response is: rheeeeet!"
    }

    // PKCE codes generation.
    if (loginPkce.code_challenge === "" && loginPkce.code_verifier === "") {
        const pkce = pkceChallenge();
        dispatch(setPkce({ pkce: pkce })); // To redux state:
    }

    const onLoginSubmit = (data: any) => {
        if (client_id && client_secret) {
            ExecuteLogin(
                data.email,
                data.password,
                client_id,
                client_secret,
                response_type,
                scope,
                redirect_uri,
                codeChallenge,
                codeChallengeMethod
            );
        }
    };

    const getAccessToken = () => {
        if (client_id && client_secret) {
            ExecuteAccessTokenRequest(
                client_id,
                client_secret,
                authCode,
                "http://localhost:3000/oauth_callback"
            )
                .then((data) => {
                    dispatch(setAccessToken(data.access_token)); // To redux state:
                    dispatch(setRefreshToken(data.refresh_token)); // To redux state:
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }
    };

    const getMe = () => {
        ExecuteMe(accessToken);
    };

    return (
        <>
            <form onSubmit={handleSubmit(onLoginSubmit)}>
                <input
                    type="email"
                    placeholder="email"
                    value={email}
                    {...register("email", {})}
                />
                <input
                    type="text"
                    placeholder="password"
                    value={password}
                    {...register("password", { required: true, min: 6 })}
                />
                <input type="submit" />
            </form>
            <button onClick={getAccessToken}>Second call (token)</button>
            <button onClick={getMe}>Third call (me)</button>
        </>
    );
};
export default Login;
