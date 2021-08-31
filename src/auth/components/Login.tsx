import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RootState } from "../../state/store";
import { useSelector } from "react-redux";
import {
    mailCheck,
    auth,
    revoke,
    refreshToken,
    userRegister,
} from "../communication/authentication";
import {
    checkIfEmailIsValid,
    getDeviceId,
    apiErrorsTranslation,
} from "../utils/authUtils";

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
        | "email"
        | "email_waiting"
        | "login"
        | "login_loading"
        | "register"
        | "register_loading"
        | "logged"
    >("email");
    const [userEmail, setUserEmail] = useState<string>("");
    const [passwordShown, setPasswordShown] = useState(false);
    const [deviceId, setDeviceId] = useState<string>("");

    // Redux state.
    const accessToken = useSelector(
        (state: RootState) => state.login.accessToken
    );
    const logged = useSelector((state: RootState) => state.login.logged);
    const userName = useSelector((state: RootState) => state.login.userName);

    useEffect(() => {
        setDeviceId(getDeviceId());
    }, []);

    useEffect(() => {
        if (logged === "yes") setFormState("logged");
    }, [logged]);

    /**
     * First check that verifies if the email exists.
     * If it exists the user is sent to the login form.
     * If it doesn't exist, the user is sent to the signup form.
     */
    const onEmailCheck = (data: { email: string }) => {
        setFormState("email_waiting");
        setUserEmail(data.email);
        mailCheck(data.email)
            .then((response) => {
                if (response && response.data) {
                    setFormState("login");
                } else {
                    setFormState("register");
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
    const onLogin = (data: { email: string; password: string }) => {
        setFormState("login_loading");
        auth(data.email, data.password, deviceId)
            .then((response) => {
                if (response && response.data) {
                    setFormState("logged");
                } else {
                    // ! TODO Error handling here, communicate login error
                }
            })
            .catch(function (error) {
                console.log("error:", error.response.data);
                if (
                    error.response.data.code ===
                        "EMAIL_NOT_CORRESPONDING_TO_USER" ||
                    error.response.data.code === "EMAIL_PASSWORD_NOT_MATCH"
                ) {
                    setError("email", {
                        type: "wrongEmail",
                        message: apiErrorsTranslation(error.response.data.code),
                    });
                }

                // ! TODO Maybe other errors should be handled here
                setFormState("login");
            });
    };

    /**
     * Register a new user.
     */
    const onRegister = (data: {
        name: string;
        email: string;
        password: string;
        termsConditions: boolean;
    }) => {
        setFormState("register_loading");
        userRegister(
            data.name,
            data.email,
            data.password,
            data.termsConditions,
            deviceId
        )
            .then((response) => {
                console.log(response);
                if (response && response.data) {
                    setFormState("logged");
                } else {
                    // ! TODO Error handling here, communicate login error
                }
            })
            .catch(function (error) {
                console.log("error:", error.response.data);
                if (
                    error.response.data.code === "NAME_REQUIRED" ||
                    error.response.data.code === "EMAIL_REQUIRED" ||
                    error.response.data.code === "PASSWORD_REQUIRED" ||
                    error.response.data.code === "EMAIL_ALREADY_EXIST" ||
                    error.response.data.code === "USERNAME_ALREADY_EXIST" ||
                    error.response.data.code === "TERMS_REQUIRED"
                ) {
                    setError("email", {
                        type: "wrongEmail",
                        message: apiErrorsTranslation(error.response.data.code),
                    });
                }

                // ! TODO Maybe other errors should be handled here
                setFormState("register");
            });
    };

    /**
     * Revokes the token and logs out the user.
     */
    const logout = () => {
        revoke(accessToken, deviceId)
            .then((response) => {
                if (response && response.data.success === true) {
                    setFormState("email");
                }
            })
            .catch(function (error) {
                console.log("Error while logging out", error);
                // ! TODO What happens if there's a logout error?
            });
    };

    /**
     * Refreshes the access token.
     */
    const refreshAccessToken = () => {
        refreshToken(accessToken, deviceId)
            .then((response) => {
                if (response && response.data.success !== true) {
                    setFormState("email");
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
            {logged === "checking" && <>Wait dude!</>}
            Access token: {accessToken}
            <br />
            <br />
            {logged === "no" && formState === "email" && (
                <>
                    <p>Insert your email to register or login</p>
                    <form onSubmit={handleSubmit(onEmailCheck)}>
                        <label className="" htmlFor="email_field">
                            Email
                        </label>
                        <br />
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
                        {errors.email && errors.email.type === "required" && (
                            <p>Please insert the email</p>
                        )}
                        {errors.email && errors.email.type === "minLength" && (
                            <p>The email seems too short</p>
                        )}
                        {errors.email && errors.email.type === "validate" && (
                            <p>Please verify the provided email</p>
                        )}
                        <br />
                        <button className="">NEXT</button>
                    </form>
                </>
            )}
            {logged === "no" && formState === "email_waiting" && (
                <>Checking email</>
            )}
            {logged === "no" && formState === "login" && (
                <>
                    <p>Insert your password</p>
                    <form onSubmit={handleSubmit(onLogin)}>
                        <label className="" htmlFor="email_field">
                            Email
                        </label>
                        <br />
                        <input
                            id="email_field"
                            type="email"
                            autoComplete="email"
                            defaultValue={userEmail}
                            placeholder="Email"
                            {...register("email", {
                                required: true,
                                minLength: 6,
                                validate: (value) => checkIfEmailIsValid(value),
                            })}
                            onChange={() => clearErrors("email")}
                        />
                        {errors.email && errors.email.type === "required" && (
                            <p>Please insert the email</p>
                        )}
                        {errors.email && errors.email.type === "minLength" && (
                            <p>The email seems too short</p>
                        )}
                        {errors.email && errors.email.type === "validate" && (
                            <p>Please verify the provided email</p>
                        )}
                        {errors.email && errors.email.type === "wrongEmail" && (
                            <p>{errors.email.message}</p>
                        )}
                        <br />
                        <label className="" htmlFor="password_field">
                            Password
                        </label>
                        <br />
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
                        <br />
                        <button onClick={togglePasswordVisiblity}>
                            {passwordShown && <>Hide password</>}
                            {!passwordShown && <>Show password</>}
                        </button>
                        {errors.password &&
                            errors.password.type === "required" && (
                                <p>Please insert the password</p>
                            )}
                        {errors.password &&
                            errors.password.type === "minLength" && (
                                <p>The password seems too short</p>
                            )}
                        {errors.password &&
                            errors.password.type === "wrongPassword" && (
                                <p>{errors.password.message}</p>
                            )}
                        <button className="">LOGIN</button>
                    </form>
                    <br />
                    <button
                        className=""
                        onClick={() => {
                            setFormState("email");
                        }}
                    >
                        BACK
                    </button>
                </>
            )}
            {logged === "no" && formState === "login_loading" && (
                <>Logging in</>
            )}
            {logged === "no" && formState === "register" && (
                <>
                    Register new account
                    <br />
                    <p>Insert the missing data</p>
                    <form onSubmit={handleSubmit(onRegister)}>
                        <label className="" htmlFor="name_field">
                            Name
                        </label>
                        <br />
                        <input
                            className=""
                            id="name_field"
                            autoComplete="name"
                            type="text"
                            placeholder="How shall we call you"
                            {...register("name", {
                                required: true,
                                minLength: 2,
                            })}
                            onChange={() => clearErrors("name")}
                        />
                        {errors.name && errors.name.type === "required" && (
                            <p>Please insert your name</p>
                        )}
                        {errors.name && errors.name.type === "minLength" && (
                            <p>The name is too short</p>
                        )}
                        <br />
                        <label className="" htmlFor="email_field">
                            Email
                        </label>
                        <br />
                        <input
                            id="email_field"
                            type="email"
                            autoComplete="email"
                            defaultValue={userEmail}
                            placeholder="Your email"
                            {...register("email", {
                                required: true,
                                minLength: 6,
                                validate: (value) => checkIfEmailIsValid(value),
                            })}
                            onChange={() => clearErrors("email")}
                        />
                        {errors.email && errors.email.type === "required" && (
                            <p>Please insert the email</p>
                        )}
                        {errors.email && errors.email.type === "minLength" && (
                            <p>The email seems too short</p>
                        )}
                        {errors.email && errors.email.type === "validate" && (
                            <p>Please verify the provided email</p>
                        )}
                        {errors.email && errors.email.type === "wrongEmail" && (
                            <p>{errors.email.message}</p>
                        )}
                        <br />
                        <label className="" htmlFor="password_field">
                            Password
                        </label>
                        <br />
                        <input
                            className=""
                            id="password_field"
                            autoComplete="current-password"
                            type={passwordShown ? "text" : "password"}
                            placeholder="Choose a password"
                            {...register("password", {
                                required: true,
                                minLength: 8,
                            })}
                            onChange={() => clearErrors("password")}
                        />
                        <br />
                        <button onClick={togglePasswordVisiblity}>
                            {passwordShown && <>Hide password</>}
                            {!passwordShown && <>Show password</>}
                        </button>
                        {errors.password &&
                            errors.password.type === "required" && (
                                <p>Please insert the password</p>
                            )}
                        {errors.password &&
                            errors.password.type === "minLength" && (
                                <p>The password seems too short</p>
                            )}
                        {errors.password &&
                            errors.password.type === "wrongPassword" && (
                                <p>{errors.password.message}</p>
                            )}
                        <br />
                        <input
                            className=""
                            id="terms_conditions_field"
                            type="checkbox"
                            {...register("termsConditions", {
                                required: true,
                            })}
                        />
                        <label className="" htmlFor="terms_conditions_field">
                            Accept Terms and Conditions
                        </label>
                        {errors.termsConditions &&
                            errors.termsConditions.type === "required" && (
                                <p>
                                    You must accept the Terms and Conditions to
                                    register.
                                </p>
                            )}
                        <br />
                        <button className="">REGISTER</button>
                    </form>
                    <button
                        className=""
                        onClick={() => {
                            setFormState("email");
                        }}
                    >
                        BACK
                    </button>
                </>
            )}
            {logged === "no" && formState === "register_loading" && (
                <>Registering...</>
            )}
            {logged === "yes" && formState === "logged" && (
                <>
                    Welcome back to Mondo Surf, {userName}!
                    <br />
                    <button className="" onClick={logout}>
                        LOGOUT
                    </button>
                    <button className="" onClick={refreshAccessToken}>
                        REFRESH ACCESS TOKEN
                    </button>
                </>
            )}
        </>
    );
};
export default Login;
