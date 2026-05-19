import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import matchReducer from "./slices/matchSlice";
import walletReducer from "./slices/walletSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    matches: matchReducer,
    wallet: walletReducer,
  },
});

export default store;
