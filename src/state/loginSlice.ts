import { createSlice } from '@reduxjs/toolkit'

export interface ILoginSliceValue {
    logged: boolean;
    authCode: string;
    accessToken: string;
    refreshToken: string;
    pkce: {
        code_challenge: string;
        code_verifier: string;
    };
}

const initialState: ILoginSliceValue = {
    logged: false,
    authCode: "",
    accessToken: "",
    refreshToken: "",
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
        setAccessToken: (state, action) => {
            return { ...state, accessToken: action.payload };
        },
        setRefreshToken: (state, action) => {
            return { ...state, refreshToken: action.payload };
        },
        setPkce: (state, action) => {
            return { ...state, pkce: action.payload };
        }
    }
})

export const { setLogin, setPkce, setAuthCode, setAccessToken, setRefreshToken } = loginSlice.actions;
export default loginSlice.reducer;