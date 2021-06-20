import { createSlice } from '@reduxjs/toolkit'

export interface ILoginSliceValue {
    logged: boolean;
    userId: number;
    userName: string;
    authCode: string;
    accessToken: string;
    refreshToken: string;
    jwtToken: string;
    pkce: {
        code_challenge: string;
        code_verifier: string;
    };
}

const initialState: ILoginSliceValue = {
    logged: false,
    userId: -1,
    userName: "",
    authCode: "",
    accessToken: "",
    refreshToken: "",
    jwtToken: "",
    pkce: { code_challenge: "", code_verifier: "" }
};

export const loginSlice = createSlice({
    name: "login ",
    initialState,
    reducers: {
        setLogin: (state, action) => {
            return { ...state, logged: action.payload };
        },
        setAuthCode: (state, action) => {
            return { ...state, authCode: action.payload };
        },
        setUserId: (state, action) => {
            return { ...state, userId: action.payload };
        },
        setUserName: (state, action) => {
            return { ...state, userName: action.payload };
        },
        setAccessToken: (state, action) => {
            return { ...state, accessToken: action.payload };
        },
        setRefreshToken: (state, action) => {
            return { ...state, refreshToken: action.payload };
        },
        setJwtToken: (state, action) => {
            return { ...state, jwtToken: action.payload };
        },
        setPkce: (state, action) => {
            return { ...state, pkce: action.payload };
        }
    }
})

export const { setLogin, setPkce, setAuthCode, setAccessToken, setRefreshToken, setJwtToken, setUserId } = loginSlice.actions;
export default loginSlice.reducer;