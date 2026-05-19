import { createSlice } from "@reduxjs/toolkit";

const teamSlice = createSlice({
  name: "team",
  initialState: { selected: [], captain: null, viceCaptain: null },
  reducers: {
    resetTeam: (state) => {
      state.selected = [];
      state.captain = null;
      state.viceCaptain = null;
    },
  },
});

export const { resetTeam } = teamSlice.actions;
export default teamSlice.reducer;
