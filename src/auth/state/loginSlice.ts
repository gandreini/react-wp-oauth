import { createSlice } from '@reduxjs/toolkit'

export interface ILoginSliceValue {
    logged: 'yes' | 'no' | 'checking';
    userId: number;
    userName: string;
    accessToken: string;
}

const initialState: ILoginSliceValue = {
    logged: 'checking',
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
        logOut: (state) => {
            return {
                ...state,
                logged: 'no',
                userId: -1,
                userName: "",
                accessToken: ""
            }
        }
    }
})

export const { setLogin, setUserId, setUserName, setAccessToken, logOut } = loginSlice.actions;
export default loginSlice.reducer;