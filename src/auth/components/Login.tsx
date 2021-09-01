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
    requestPasswordResetEmail,
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
        | "request_password_reset"
        | "request_password_reset_waiting"
        | "request_password_reset_sent"
        | "request_password_reset_error"
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
    const onLogin = (data: { loginEmail: string; loginPassword: string }) => {
        setFormState("login_loading");
        auth(data.loginEmail, data.loginPassword, deviceId)
            .then((response) => {
                if (response && response.data) {
                    setFormState("logged");
                } else {
                    setError("loginForm", {
                        type: "wrongLoginForm",
                        message: "There was an error during login",
                    });
                }
            })
            .catch(function (error) {
                console.log("error:", error.response.data);
                if (
                    error.response.data.code ===
                        "EMAIL_NOT_CORRESPONDING_TO_USER" ||
                    error.response.data.code === "EMAIL_REQUIRED"
                ) {
                    setError("loginEmail", {
                        type: "wrongEmail",
                        message: apiErrorsTranslation(error.response.data.code),
                    });
                } else if (
                    error.response.data.code === "PASSWORD_REQUIRED" ||
                    error.response.data.code === "EMAIL_PASSWORD_NOT_MATCH"
                ) {
                    setError("loginPassword", {
                        type: "wrongPassword",
                        message: apiErrorsTranslation(error.response.data.code),
                    });
                } else {
                    setError("loginForm", {
                        type: "wrongLoginForm",
                        message: "There was an error during login",
                    });
                }
                setFormState("login");
            });
    };

    /**
     * Register a new user.
     */
    const onRegister = (data: {
        registerName: string;
        registerEmail: string;
        registerPassword: string;
        registerTermsConditions: boolean;
    }) => {
        setFormState("register_loading");
        userRegister(
            data.registerName,
            data.registerEmail,
            data.registerPassword,
            data.registerTermsConditions,
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
    const onLogout = () => {
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
    const onRefreshAccessToken = () => {
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
     * Sends the password reset email to the user.
     */
    const onRequestPasswordReset = (data: {
        requestPasswordResetEmail: string;
    }) => {
        setFormState("request_password_reset_waiting");
        console.log(
            "data.requestPasswordResetEmail",
            data.requestPasswordResetEmail
        );
        requestPasswordResetEmail(data.requestPasswordResetEmail)
            .then((response) => {
                console.log(response);
                if (response && response.data.success === true) {
                    setFormState("request_password_reset_sent");
                } else {
                    setFormState("request_password_reset_error");
                }
            })
            .catch(function (error) {
                console.log(error);
                setFormState("request_password_reset_error");
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
                    <button
                        className=""
                        onClick={() => {
                            setFormState("request_password_reset");
                        }}
                    >
                        Forgot password
                    </button>
                </>
            )}
            {logged === "no" && formState === "email_waiting" && (
                <>Checking email</>
            )}
            {logged === "no" && formState === "login" && (
                <>
                    <p>Insert your password</p>
                    <form onSubmit={handleSubmit(onLogin)}>
                        {errors.loginForm &&
                            errors.loginForm.type === "wrongLoginForm" && (
                                <p>{errors.loginForm.message}</p>
                            )}
                        <label className="" htmlFor="login_email_field">
                            Email
                        </label>
                        <br />
                        <input
                            id="login_email_field"
                            type="email"
                            autoComplete="email"
                            defaultValue={userEmail}
                            placeholder="Email"
                            {...register("loginEmail", {
                                required: true,
                                minLength: 6,
                                validate: (value) => checkIfEmailIsValid(value),
                            })}
                            onChange={() => clearErrors("loginEmail")}
                        />
                        {errors.loginEmail &&
                            errors.loginEmail.type === "required" && (
                                <p>Please insert the email</p>
                            )}
                        {errors.loginEmail &&
                            errors.loginEmail.type === "minLength" && (
                                <p>The email seems too short</p>
                            )}
                        {errors.loginEmail &&
                            errors.loginEmail.type === "validate" && (
                                <p>Please verify the provided email</p>
                            )}
                        {errors.loginEmail &&
                            errors.loginEmail.type === "wrongEmail" && (
                                <p>{errors.loginEmail.message}</p>
                            )}
                        <br />
                        <label className="" htmlFor="login_password_field">
                            Password
                        </label>
                        <br />
                        <input
                            className=""
                            id="login_password_field"
                            autoComplete="current-password"
                            type={passwordShown ? "text" : "password"}
                            placeholder="Password"
                            {...register("loginPassword", {
                                required: true,
                                minLength: 8,
                            })}
                            onChange={() => clearErrors("loginPassword")}
                        />
                        <br />
                        <button onClick={togglePasswordVisiblity}>
                            {passwordShown && <>Hide password</>}
                            {!passwordShown && <>Show password</>}
                        </button>
                        {errors.loginPassword &&
                            errors.loginPassword.type === "required" && (
                                <p>Please insert the password</p>
                            )}
                        {errors.loginPassword &&
                            errors.loginPassword.type === "minLength" && (
                                <p>The password seems too short</p>
                            )}
                        {errors.loginPassword &&
                            errors.loginPassword.type === "wrongPassword" && (
                                <p>{errors.loginPassword.message}</p>
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
                        <label className="" htmlFor="register_name_field">
                            Name
                        </label>
                        <br />
                        <input
                            className=""
                            id="register_name_field"
                            autoComplete="name"
                            type="text"
                            placeholder="How shall we call you"
                            {...register("registerName", {
                                required: true,
                                minLength: 2,
                            })}
                            onChange={() => clearErrors("registerName")}
                        />
                        {errors.registerName &&
                            errors.registerName.type === "required" && (
                                <p>Please insert your name</p>
                            )}
                        {errors.registerName &&
                            errors.registerName.type === "minLength" && (
                                <p>The name is too short</p>
                            )}
                        <br />
                        <label className="" htmlFor="register_email_field">
                            Email
                        </label>
                        <br />
                        <input
                            id="register_email_field"
                            type="email"
                            autoComplete="email"
                            defaultValue={userEmail}
                            placeholder="Your email"
                            {...register("registerEmail", {
                                required: true,
                                minLength: 6,
                                validate: (value) => checkIfEmailIsValid(value),
                            })}
                            onChange={() => clearErrors("registerEmail")}
                        />
                        {errors.registerEmail &&
                            errors.registerEmail.type === "required" && (
                                <p>Please insert the email</p>
                            )}
                        {errors.registerEmail &&
                            errors.registerEmail.type === "minLength" && (
                                <p>The email seems too short</p>
                            )}
                        {errors.registerEmail &&
                            errors.registerEmail.type === "validate" && (
                                <p>Please verify the provided email</p>
                            )}
                        {errors.registerEmail &&
                            errors.registerEmail.type === "wrongEmail" && (
                                <p>{errors.registerEmail.message}</p>
                            )}
                        <br />
                        <label className="" htmlFor="register_password_field">
                            Password
                        </label>
                        <br />
                        <input
                            className=""
                            id="register_password_field"
                            autoComplete="current-password"
                            type={passwordShown ? "text" : "password"}
                            placeholder="Choose a password"
                            {...register("registerPassword", {
                                required: true,
                                minLength: 8,
                            })}
                            onChange={() => clearErrors("registerPassword")}
                        />
                        <br />
                        <button onClick={togglePasswordVisiblity}>
                            {passwordShown && <>Hide password</>}
                            {!passwordShown && <>Show password</>}
                        </button>
                        {errors.registerPassword &&
                            errors.registerPassword.type === "required" && (
                                <p>Please insert the password</p>
                            )}
                        {errors.registerPassword &&
                            errors.registerPassword.type === "minLength" && (
                                <p>The password seems too short</p>
                            )}
                        {errors.registerPassword &&
                            errors.registerPassword.type ===
                                "wrongPassword" && (
                                <p>{errors.registerPassword.message}</p>
                            )}
                        <br />
                        <input
                            className=""
                            id="register_terms_conditions_field"
                            type="checkbox"
                            {...register("registerTermsConditions", {
                                required: true,
                            })}
                        />
                        <label
                            className=""
                            htmlFor="register_terms_conditions_field"
                        >
                            Accept Terms and Conditions
                        </label>
                        {errors.registerTermsConditions &&
                            errors.registerTermsConditions.type ===
                                "required" && (
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
            {logged === "no" && formState === "request_password_reset" && (
                <>
                    <p>Insert your email to create a new password</p>
                    <form onSubmit={handleSubmit(onRequestPasswordReset)}>
                        <label
                            className=""
                            htmlFor="request_password_reset_email"
                        >
                            Your email
                        </label>
                        <br />
                        <input
                            className=""
                            id="request_password_reset_email"
                            type="email"
                            autoComplete="email"
                            placeholder="Email"
                            {...register("requestPasswordResetEmail", {
                                required: true,
                                minLength: 6,
                                validate: (value) => checkIfEmailIsValid(value),
                            })}
                            onChange={() =>
                                clearErrors("requestPasswordResetEmail")
                            }
                        />
                        {errors.requestPasswordResetEmail &&
                            errors.requestPasswordResetEmail.type ===
                                "required" && <p>Please insert the email</p>}
                        {errors.requestPasswordResetEmail &&
                            errors.requestPasswordResetEmail.type ===
                                "minLength" && <p>The email seems too short</p>}
                        {errors.requestPasswordResetEmail &&
                            errors.requestPasswordResetEmail.type ===
                                "validate" && (
                                <p>Please verify the provided email</p>
                            )}
                        <br />
                        <button className="">SEND PASSWORD RESET EMAIL</button>
                    </form>

                    <button
                        className=""
                        onClick={() => {
                            setFormState("email");
                        }}
                    >
                        Login or signup
                    </button>
                </>
            )}
            {logged === "no" &&
                formState === "request_password_reset_waiting" && <>Wait....</>}
            {logged === "no" && formState === "request_password_reset_sent" && (
                <>
                    Request sent!
                    <br />
                    <button
                        className=""
                        onClick={() => {
                            setFormState("email");
                        }}
                    >
                        Login or signup
                    </button>
                </>
            )}
            {logged === "no" && formState === "request_password_reset_error" && (
                <>
                    Sorry there was an error
                    <br />
                    <button
                        className=""
                        onClick={() => {
                            setFormState("email");
                        }}
                    >
                        Login or signup
                    </button>
                </>
            )}
            {logged === "yes" && formState === "logged" && (
                <>
                    Welcome back to Mondo Surf, {userName}!
                    <br />
                    <button className="" onClick={onLogout}>
                        LOGOUT
                    </button>
                    <button className="" onClick={onRefreshAccessToken}>
                        REFRESH ACCESS TOKEN
                    </button>
                </>
            )}
        </>
    );
};
export default Login;
