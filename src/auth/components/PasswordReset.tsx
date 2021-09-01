/*
Expects an url like:
https://yoursite.co/reset-password?token=jwt.goes.here
*/

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { getUrlParameter } from "../../utils/utils";
import { passwordReset } from "../communication/authentication";

const PasswordReset: React.FC = (props) => {
    const [token, setToken] = useState<string | null>("");
    const [formState, setFormState] = useState<
        | "retrievingToken"
        | "tokenError"
        | "passwords"
        | "passwordsWaiting"
        | "success"
        | "error"
    >("retrievingToken");
    const [passwordShown, setPasswordShown] = useState(false);

    // React hook form.
    const {
        register,
        handleSubmit,
        clearErrors,
        setError,
        getValues,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        if (
            getUrlParameter("token") !== null &&
            getUrlParameter("token") !== ""
        ) {
            setToken(getUrlParameter("token"));
            setFormState("passwords");
        } else {
            setFormState("tokenError");
        }
    }, []);

    /**
     * Calls the API to reset the user password.
     */
    const onPasswordReset = (data: { password1: string }) => {
        setFormState("passwordsWaiting");
        passwordReset(token!, data.password1)
            .then((response) => {
                if (response && response.data.success === true) {
                    setFormState("success");
                } else {
                    setFormState("error");
                }
            })
            .catch(function (error) {
                console.log("Error while...", error);
                setFormState("error");
                // ! TODO What happens if there's a logout error?
            });
    };

    /**
     * Verifies that the two passwords are matching.
     */
    const verifyPasswords = (password2: string) => {
        if (password2 === getValues("password1")) {
            return true;
        } else {
            return false;
        }
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
            {formState === "retrievingToken" && <>Retrieving token</>}
            {formState === "tokenError" && (
                <>
                    Couldn't retrieve the token, try again to click on the link
                    in the email
                    <br />
                    Go Back to home
                </>
            )}
            {formState === "passwords" && (
                <>
                    <p>Reset your password</p>
                    <form onSubmit={handleSubmit(onPasswordReset)}>
                        <label className="" htmlFor="password1_field">
                            Password
                        </label>
                        <br />
                        <input
                            id="password1_field"
                            type={passwordShown ? "text" : "password"}
                            autoComplete="password"
                            placeholder="Password"
                            {...register("password1", {
                                required: true,
                                minLength: 8,
                            })}
                            onChange={() => clearErrors("password1")}
                        />
                        {errors.password1 &&
                            errors.password1.type === "required" && (
                                <p>Please insert the password</p>
                            )}
                        {errors.password1 &&
                            errors.password1.type === "minLength" && (
                                <p>The password seems too short</p>
                            )}
                        <br />
                        <label className="" htmlFor="password2_field">
                            Repeat password
                        </label>
                        <br />
                        <input
                            className=""
                            id="password2_field"
                            autoComplete="password"
                            type={passwordShown ? "text" : "password"}
                            placeholder="Repeat password"
                            {...register("password2", {
                                required: true,
                                minLength: 8,
                                validate: (value) => verifyPasswords(value),
                            })}
                            onChange={() => clearErrors("password")}
                        />
                        <br />
                        <button onClick={togglePasswordVisiblity}>
                            {passwordShown && <>Hide password</>}
                            {!passwordShown && <>Show password</>}
                        </button>
                        {errors.password2 &&
                            errors.password2.type === "required" && (
                                <p>Please insert the missing password</p>
                            )}
                        {errors.password2 &&
                            errors.password2.type === "minLength" && (
                                <p>The password seems too short</p>
                            )}
                        {errors.password2 &&
                            errors.password2.type === "validate" && (
                                <p>
                                    The two provided passwords are not matching
                                </p>
                            )}
                        <button className="">SAVE NEW PASSWORD</button>
                    </form>
                </>
            )}
            {formState === "passwordsWaiting" && <>Changing the password</>}
            {formState === "success" && <>Password successfully changed!</>}
            {formState === "error" && <>Ops there was en error</>}
        </>
    );
};
export default PasswordReset;
