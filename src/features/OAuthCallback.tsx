import { getUrlParameter } from "../utils/utils";

const OAuthCallback: React.FC = (props) => {
    // Get parameter "code".
    const code = getUrlParameter("code");
    if (window.opener) {
        window.opener.postMessage(
            { code: code, type: "authCode" },
            "http://localhost:3000/login"
        );
        window.close();
    }

    return <></>;
};
export default OAuthCallback;
