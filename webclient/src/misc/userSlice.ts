import { createSlice } from "@reduxjs/toolkit"

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: null,
    name: null,
    roles: []
  },
  reducers: {
    loginAction: (state, action: {type: string, payload: {token: string, name: string, roles: string[]}}) => {
      return {
        ...state,
        token: action.payload.token,
        name: action.payload.name,
        roles: action.payload.roles
      };
    },
    logoutAction: (state) => {
      return {
        ...state,
        token: null,
        name: null,
        roles: []
      };
    }
  },
})

// Action creators are generated for each case reducer function
export const { loginAction, logoutAction } = userSlice.actions

export default userSlice.reducer;