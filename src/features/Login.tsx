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
// import { ucExecuteLogin as ExecuteLogin } from "../auth/ucAuthentication";
import {
    AuthCodeExecuteLogin as ExecuteLogin,
    AuthCodeExecuteAccessTokenRequest as ExecuteAccessTokenRequest,
    AuthCodeExecuteMe as ExecuteMe,
} from "../auth/AuthCodeAuthentication";

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
    const client_id = "Wbl1EicdRchQu9PGq7y2UreQhPoEf0bPZNe2pEm8";
    const client_secret = "l65zRugOX5KLcgOPZ3ObIkkaRgKpglEulsDR3bMA";
    const response_type = "code";
    const scope = "basic";
    const redirect_uri = "http://localhost:3000/oauth_callback";
    const code_challenge_method = "s256";

    // Redux state.
    const loginState = useSelector((state: RootState) => state.login);
    const authCode = useSelector((state: RootState) => state.login.authCode);
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

    if (
        loginState.pkce.code_challenge === "" &&
        loginState.pkce.code_verifier === ""
    ) {
        const pkce = pkceChallenge();
        dispatch(setPkce({ pkce: pkce })); // To redux state:
    }

    const onLoginSubmit = (data: any) => {
        // jwtExecuteLogin(data.email, data.password);
        ExecuteLogin(
            data.email,
            data.password,
            data.client_id,
            data.client_secret,
            data.response_type,
            data.scope,
            data.redirect_uri,
            data.code_challenge,
            data.code_challenge_method
        );
    };

    const getAccessToken = () => {
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
                <input
                    type="text"
                    placeholder="client_id"
                    value={client_id}
                    {...register("client_id")}
                />
                <input
                    type="text"
                    placeholder="client_secret"
                    value={client_secret}
                    {...register("client_secret")}
                />
                <input
                    type="text"
                    placeholder="response_type"
                    value={response_type}
                    {...register("response_type")}
                />
                <input
                    type="text"
                    placeholder="scope"
                    value={scope}
                    {...register("scope")}
                />
                <input
                    type="text"
                    placeholder="redirect_uri"
                    value={redirect_uri}
                    {...register("redirect_uri")}
                />
                <input
                    type="text"
                    placeholder="code_challenge"
                    value={loginState.pkce.code_challenge}
                    {...register("code_challenge")}
                />
                <input
                    type="text"
                    placeholder="code_challenge_method"
                    value={code_challenge_method}
                    {...register("code_challenge_method")}
                />

                <input type="submit" />
            </form>
            <button onClick={getAccessToken}>Second call (token)</button>
            <button onClick={getMe}>Third call (me)</button>
        </>
    );
};
export default Login;
