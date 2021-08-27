import { combineReducers, configureStore } from '@reduxjs/toolkit'

import loginSlice from '../auth/state/loginSlice';

const rootReducer = combineReducers({
    login: loginSlice
});

export const store = configureStore({
    reducer: rootReducer
})

export type RootState = ReturnType<typeof rootReducer>