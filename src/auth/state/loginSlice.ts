import { createSlice } from '@reduxjs/toolkit'

export interface ILoginSliceValue {
    logged: boolean;
    userId: number;
    userName: string;
    accessToken: string;
}

const initialState: ILoginSliceValue = {
    logged: false,
    userId: -1,
    userName: "",
    accessToken: "",
};

export const loginSlice = createSlice({
    name: "login ",
    initialState,
    reducers: {
        setLogin: (state, action) => {
            return { ...state, logged: action.payload };
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
        logOut: () => {
            return initialState;
        }
    }
})

export const { setLogin, setUserId, setUserName, setAccessToken, logOut } = loginSlice.actions;
export default loginSlice.reducer;