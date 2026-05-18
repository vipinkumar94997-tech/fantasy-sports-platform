import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { matchService } from "../../services/matchService";

export const fetchMatches = createAsyncThunk(
  "matches/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const res = await matchService.getAll(params);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export const fetchMatchById = createAsyncThunk(
  "matches/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await matchService.getById(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

const matchSlice = createSlice({
  name: "matches",
  initialState: {
    list: [],
    current: null,
    players: [],
    liveScore: null,
    loading: false,
    error: null,
  },
  reducers: {
    updateLiveScore: (state, action) => {
      state.liveScore = action.payload;
    },
    clearCurrentMatch: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatches.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.matches;
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMatchById.fulfilled, (state, action) => {
        state.current = action.payload.match;
        state.players = action.payload.players || [];
      });
  },
});

export const { updateLiveScore, clearCurrentMatch } = matchSlice.actions;
export default matchSlice.reducer;
