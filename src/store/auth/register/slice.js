import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getFirebaseBackend } from "../../../helpers/firebase_helper"
import { postFakeRegister, postJwtRegister } from "../../../helpers/fakebackend_helper"

const fireBaseBackend = getFirebaseBackend()

const registerUserThunk = createAsyncThunk("account/registerUser", async ({ user }, { rejectWithValue }) => {
  try {
    let response
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      response = await fireBaseBackend.registerUser(user.email, user.password)
    } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      response = await postJwtRegister("/post-jwt-register", user)
    } else {
      response = await postFakeRegister(user)
    }
    return response
  } catch (error) {
    return rejectWithValue(error.message || String(error))
  }
})

const accountSlice = createSlice({
  name: "account",
  initialState: { registrationError: null, message: null, loading: false, user: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUserThunk.pending, (state) => {
        state.loading = true
        state.registrationError = null
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.registrationError = null
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.loading = false
        state.user = null
        state.registrationError = action.payload
      })
  },
})

export const registerUser = (user) => registerUserThunk({ user })
export default accountSlice.reducer
