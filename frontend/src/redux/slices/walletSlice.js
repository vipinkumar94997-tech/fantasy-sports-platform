import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { walletService } from "../../services/walletService";

export const fetchWallet = createAsyncThunk(
  "wallet/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await walletService.getBalance();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    balance: 0,
    bonusBalance: 0,
    transactions: [],
    loading: false,
    error: null,
  },
  reducers: {
    updateBalance: (state, action) => {
      state.balance = action.payload.balance;
      state.bonusBalance = action.payload.bonusBalance;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWallet.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.balance;
        state.bonusBalance = action.payload.bonusBalance;
      })
      .addCase(fetchWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateBalance } = walletSlice.actions;
export default walletSlice.reducer;
