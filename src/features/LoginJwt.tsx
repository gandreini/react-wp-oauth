import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RootState } from "../state/store";
import { useDispatch, useSelector } from "react-redux";
import {
    jwtExecuteAuthentication as executeAuthentication,
    jwtExecuteLogin as executeLogin,
    jwtExecuteRegistration as executeRegistration,
    jwtRevokeToken as revokeToken,
} from "../grant-types/JwtAuthentication";
import { setJwtToken, setLogin, setUserId } from "../state/loginSlice";
import jwt_decode from "jwt-decode";

interface IDecodedJwt {
    email: string;
    exp: number;
    iat: number;
    id: number;
}

const LoginJwt: React.FC = (props) => {
    // React hook form.
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    // Use effects variables.
    const [mode, setMode] = useState<"login" | "register">("login");
    const [passwordShown, setPasswordShown] = useState(false);

    // ! TODO to be removed.
    const email = "test@test.com";
    const password = "test";

    // Redux state.
    const logged = useSelector((state: RootState) => state.login.logged);
    const jwtToken = useSelector((state: RootState) => state.login.jwtToken);
    const dispatch = useDispatch();

    /**
     * Called when the user click on the submit of the login form.
     *
     * @param data Fields of the form.
     */
    const onLoginSubmit = (data: { email: string; password: string }) => {
        authenticateUser(data.email, data.password);
    };

    /**
     * Called when the user click on the submit of the registration form.
     *
     * @param data Fields of the form.
     */
    const onRegistrationSubmit = (data: any) => {
        executeRegistration(
            data.name_register,
            data.email_register,
            data.password_register,
            process.env.REACT_APP_AUTH_CODE!
        )
            .then((response) => {
                if (response.data.success === true) {
                    authenticateUser(
                        data.email_register,
                        data.password_register
                    );
                }
            })
            .catch(function (error) {
                console.log("Error while registration", error);
            });
    };

    /**
     * Function that authenticates the user.
     *
     * @param email
     * @param password
     */
    const authenticateUser = (email: string, password: string) => {
        executeAuthentication(email, password)
            .then((response) => {
                if (response.data.success === true) {
                    const decodedJwt: IDecodedJwt = jwt_decode(
                        response.data.data.jwt
                    );
                    dispatch(setUserId(decodedJwt.id)); // To redux state
                    dispatch(setLogin(true)); // To redux state:
                    dispatch(setJwtToken(response.data.data.jwt)); // To redux state
                }
            })
            .catch(function (error) {
                console.log("Error while authentication", error);
            });
    };

    /**
     * Revokes the token and logs out the user.
     */
    const logout = () => {
        revokeToken(jwtToken)
            .then((response) => {
                if (response.data.success === true) {
                    dispatch(setUserId(-1)); // To redux state
                    dispatch(setLogin(false)); // To redux state:
                    dispatch(setJwtToken("")); // To redux state
                }
            })
            .catch(function (error) {
                console.log("Error while logging out", error);
            });
    };

    /* const loginAfterAuth = (jwt: string, code: string) => {
        executeLogin(jwt, code)
            .then((response) => {
                dispatch(setLogin(true)); // To redux state:
            })
            .catch((error) => {
                console.log("Error while loggin in", error);
            });
    }; */

    /**
     * Toggles the form between login and registration.
     */
    const toggleMode = () => {
        if (mode === "login") setMode("register");
        if (mode === "register") setMode("login");
    };

    /**
     * Toggles password visibility in the password field.
     * @param e React.MouseEvent
     */
    const togglePasswordVisiblity = (e: React.MouseEvent) => {
        setPasswordShown(passwordShown ? false : true);
        e.preventDefault();
    };

    return (
        <>
            {logged === false && <>User is not logged</>}
            {logged === true && <>User is logged</>}

            {mode === "login" && (
                <section>
                    <form onSubmit={handleSubmit(onLoginSubmit)}>
                        <input
                            type="email"
                            placeholder="email"
                            value={email}
                            {...register("email", {})}
                        />
                        <br />
                        <input
                            type={passwordShown ? "text" : "password"}
                            placeholder="password"
                            value={password}
                            {...register("password", {
                                required: true,
                                min: 6,
                            })}
                        />
                        <button onClick={togglePasswordVisiblity}>
                            Show/Hide password
                        </button>
                        <br />
                        <input type="submit" />
                    </form>
                    <br />
                    You don't have an account?
                    <br />
                    <button onClick={toggleMode}>Register</button>
                </section>
            )}

            {mode === "register" && (
                <section>
                    <form onSubmit={handleSubmit(onRegistrationSubmit)}>
                        <input
                            type="text"
                            placeholder="Your name"
                            {...register("name_register", {
                                required: true,
                                min: 3,
                            })}
                        />
                        <br />
                        <input
                            type="text"
                            placeholder="Your email"
                            {...register("email_register", {
                                required: true,
                                pattern: /^\S+@\S+$/i,
                            })}
                        />
                        <br />
                        <input
                            type={passwordShown ? "text" : "password"}
                            placeholder="Set a password"
                            {...register("password_register", {
                                required: true,
                            })}
                        />
                        <button onClick={togglePasswordVisiblity}>
                            Show/Hide password
                        </button>
                        <br />
                        <input type="submit" />
                    </form>
                    <br />
                    Already have an account?
                    <br />
                    <button onClick={toggleMode}>Register</button>
                </section>
            )}
            <br />
            <button onClick={logout}>LOGOUT</button>
        </>
    );
};
export default LoginJwt;
