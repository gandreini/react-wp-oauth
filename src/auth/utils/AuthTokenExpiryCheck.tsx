import { refreshToken } from "../communication/authentication";
import { RootState } from "../../state/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import jwt_decode from "jwt-decode";
import IAccessToken from "../model/iAccessToken";
import { getDeviceId } from "../utils/authUtils";

const AuthTokenExpiryCheck: React.FC = (props) => {
    const tokenRefreshInterval: number =
        parseInt(process.env.REACT_APP_REFRESH_TOKEN_INTERVAL_MINUTES!) *
        1000 *
        60;
    const logged = useSelector((state: RootState) => state.login.logged);
    const userId = useSelector((state: RootState) => state.login.userId);
    const accessToken = useSelector(
        (state: RootState) => state.login.accessToken
    );
    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        if (accessToken && logged) {
            const timer = setTimeout(() => {
                setCount((c) => c + 1);
                checkToken();
            }, tokenRefreshInterval);
        }
        // return () => clearTimeout(timer);
    }, [count, logged]);

    const checkToken = () => {
        if (accessToken && logged) {
            const decodedToken: IAccessToken = jwt_decode(accessToken);
            if (Math.floor(Date.now() / 1000) > decodedToken.exp) {
                refreshToken(accessToken, getDeviceId());
            }
        }
    };

    return <></>;
};
export default AuthTokenExpiryCheck;
