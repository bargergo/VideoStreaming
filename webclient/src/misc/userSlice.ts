import { createSlice } from "@reduxjs/toolkit"

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: null,
    name: null
  },
  reducers: {
    loginAction: (state, action: {type: string, payload: {token: string, name: string}}) => {
      state.token = action.payload.token;
      state.name = action.payload.name;
    },
    logoutAction: (state) => {
      state.token = null;
      state.name = null;
    }
  },
})

// Action creators are generated for each case reducer function
export const { loginAction, logoutAction } = userSlice.actions

export default userSlice.reducer;