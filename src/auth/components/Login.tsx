import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
    setLogin,
    setUserId,
    setUserName,
    setAccessToken,
    logOut,
} from "../state/loginSlice";
import { RootState } from "../../state/store";
import { useDispatch, useSelector } from "react-redux";
import {
    mailCheck,
    auth,
    revoke,
    refreshToken,
} from "../communication/authentication";
import { checkIfEmailIsValid, getDeviceId } from "../utils/authUtils";

const Login: React.FC = (props) => {
    // React hook form.
    const {
        register,
        handleSubmit,
        clearErrors,
        setError,
        formState: { errors },
    } = useForm();

    const [formState, setFormState] = useState<
        | "login1"
        | "login1_loading"
        | "login2"
        | "login2_loading"
        | "login_completed"
        | "register1"
        | "register2"
    >("login1");
    const [userEmail, setUserEmail] = useState<string>("");
    const [userPassword, setUserPassword] = useState<string>("");
    const [passwordShown, setPasswordShown] = useState(false);
    const [deviceId, setDeviceId] = useState<string>("");

    // Redux state.
    const accessToken = useSelector(
        (state: RootState) => state.login.accessToken
    );
    const logged = useSelector((state: RootState) => state.login.logged);
    const userId = useSelector((state: RootState) => state.login.userId);

    useEffect(() => {
        setDeviceId(getDeviceId());
    }, []);

    useEffect(() => {
        if (logged === true) setFormState("login_completed");
    }, [logged]);

    /**
     * First check that verifies if the email exists.
     * If it exists the user is sent to the login form.
     * If it doesn't exist, the user is sent to the signup form.
     */
    const onEmailCheck = (data: { email: string }) => {
        setFormState("login1_loading");
        setUserEmail(data.email);
        mailCheck(data.email)
            .then((response) => {
                if (response && response.data) {
                    setFormState("login2");
                } else {
                    setFormState("register2");
                }
            })
            .catch(function (error) {
                console.log(error);
                // ! TODO Handle error.
            });
    };

    /**
     * Login request is sent to the "auth" endpoint.
     */
    const onLogin = (data: { password: string }) => {
        setFormState("login2_loading");
        setUserPassword(data.password);
        auth(userEmail, data.password, deviceId)
            .then((response) => {
                if (response && response.data) {
                    setFormState("login_completed");
                } else {
                    // ! TODO Error handling here, communicate login error
                }
            })
            .catch(function (error) {
                console.log("error:", error);
                // What is this?
                setError("password", {
                    type: "wrongPassword",
                    message: "Please try another password!",
                });
                setFormState("login2");
            });
    };

    /**
     * Revokes the token and logs out the user.
     */
    const logout = () => {
        revoke(accessToken, deviceId)
            .then((response) => {
                if (response && response.data.success === true) {
                    setFormState("login1");
                }
            })
            .catch(function (error) {
                console.log("Error while logging out", error);
            });
    };

    /**
     * Refreshes the access token.
     */
    const refreshAccessToken = () => {
        refreshToken(accessToken, deviceId)
            .then((response) => {
                if (response && response.data.success !== true) {
                    setFormState("login1");
                }
            })
            .catch(function (error) {
                console.log("Error while refreshing the token", error);
            });
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
            Access token: {accessToken}
            <br />
            <br />
            {(formState === "login1" || formState === "login1_loading") && (
                <>
                    <p>Insert your email to register or login</p>
                    <form onSubmit={handleSubmit(onEmailCheck)}>
                        <label className="" htmlFor="email_field">
                            Email
                        </label>
                        <input
                            className=""
                            id="email_field"
                            type="email"
                            autoComplete="email"
                            placeholder="Email"
                            {...register("email", {
                                required: true,
                                minLength: 6,
                                validate: (value) => checkIfEmailIsValid(value),
                            })}
                            onChange={() => clearErrors("email")}
                        />
                        {errors.email && (
                            <p>Please verify the provided email</p>
                        )}
                        <button
                            className=""
                            disabled={formState === "login1_loading"}
                        >
                            NEXT
                        </button>
                    </form>
                </>
            )}
            {(formState === "login2" || formState === "login2_loading") && (
                <>
                    <p>Insert your password</p>
                    <form onSubmit={handleSubmit(onLogin)}>
                        <label className="" htmlFor="password_field">
                            Password
                        </label>
                        <input
                            id="email_field"
                            type="email"
                            autoComplete="email"
                            value={userEmail}
                            placeholder="Email"
                            {...register("email", {
                                required: true,
                                minLength: 6,
                                validate: (value) => checkIfEmailIsValid(value),
                            })}
                            onChange={() => clearErrors("email")}
                        />
                        <input
                            className=""
                            id="password_field"
                            autoComplete="current-password"
                            type={passwordShown ? "text" : "password"}
                            placeholder="password"
                            {...register("password", {
                                required: true,
                                minLength: 8,
                            })}
                            onChange={() => clearErrors("password")}
                        />
                        <button onClick={togglePasswordVisiblity}>
                            Show/Hide password
                        </button>
                        {errors.password && console.log(errors)}
                        {errors.password &&
                            errors.password.type === "minLength" && (
                                <p>The password seems too short</p>
                            )}
                        {errors.password &&
                            errors.password.type === "wrongPassword" && (
                                <p>{errors.password.message}</p>
                            )}
                        <button
                            className=""
                            disabled={formState === "login2_loading"}
                        >
                            LOGIN
                        </button>
                    </form>
                    <button
                        className=""
                        onClick={() => {
                            setFormState("login1");
                        }}
                    >
                        BACK
                    </button>
                </>
            )}
            {formState === "register2" && <>Register new account</>}
            {formState === "login_completed" && (
                <>Welcome back to Mondo Surf!</>
            )}
            <br />
            <br />
            <button className="" onClick={logout}>
                LOGOUT
            </button>
            <button className="" onClick={refreshAccessToken}>
                REFRESH ACCESS TOKEN
            </button>
        </>
    );
};
export default Login;
