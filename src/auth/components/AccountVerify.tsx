/*
Expects an url like:
https://yoursite.co/account-verify?token=jwt.goes.here
*/

import { useState } from "react";
import { useEffect } from "react";
import { getUrlParameter } from "../../utils/utils";
import { confirmAccount } from "../communication/authentication";

const AccountVerify: React.FC = (props) => {
    const [token, setToken] = useState<string | null>("");
    const [accountConfirmed, setAccountConfirmed] = useState<
        "waiting" | "yes" | "no" | "alreadyConfirmed"
    >("waiting");

    useEffect(() => {
        if (getUrlParameter("token") !== null) {
            setToken(getUrlParameter("token"));

            // Call the API here!
            confirmAccount(getUrlParameter("token")!)
                .then((response) => {
                    if (
                        response &&
                        response.data.success === true &&
                        response.data.already_confirmed === false
                    ) {
                        setAccountConfirmed("yes");
                    } else if (
                        response &&
                        response.data.success === true &&
                        response.data.already_confirmed === true
                    ) {
                        setAccountConfirmed("alreadyConfirmed");
                    } else {
                        setAccountConfirmed("no");
                    }
                })
                .catch(function (error) {
                    console.log("Error while confirming the account", error);
                    setAccountConfirmed("no");
                });
        } else {
            setToken(null);
        }
    }, []);

    return (
        <>
            {accountConfirmed === "waiting" && token === "" && (
                <>Retrieving token</>
            )}
            {accountConfirmed === "waiting" && token === null && (
                <>
                    Couldn't retrieve the token, try again to click on the link
                    in the email
                    <br />
                    Go Back to home
                </>
            )}
            {accountConfirmed === "waiting" &&
                token !== "" &&
                token !== null && <>Checking the token</>}
            {accountConfirmed === "yes" && (
                <>
                    Account confirmed!
                    <br />
                    Go Back to home
                </>
            )}
            {accountConfirmed === "alreadyConfirmed" && (
                <>
                    Account was already confirmed
                    <br />
                    Go Back to home
                </>
            )}
            {accountConfirmed === "no" && (
                <>
                    Error while confirming the account, try clicking again on
                    the provided link or contact the administrator
                    <br />
                    Go Back to home
                </>
            )}
        </>
    );
};
export default AccountVerify;
