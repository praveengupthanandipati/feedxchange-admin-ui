import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getFirebaseBackend } from "../../../helpers/firebase_helper"
import { postFakeForgetPwd, postJwtForgetPwd } from "../../../helpers/fakebackend_helper"

const fireBaseBackend = getFirebaseBackend()

const SUCCESS_MSG = "Reset link are sended to your mailbox, check there first"

const forgetPasswordThunk = createAsyncThunk("forgetPassword/forgetUser", async ({ user }, { rejectWithValue }) => {
  try {
    let response
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      response = await fireBaseBackend.forgetPassword(user.email)
    } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      response = await postJwtForgetPwd("/jwt-forget-pwd", { email: user.email })
    } else {
      response = await postFakeForgetPwd("/fake-forget-pwd", { email: user.email })
    }
    if (response) return SUCCESS_MSG
  } catch (error) {
    return rejectWithValue(error.message || String(error))
  }
})

const forgetPasswordSlice = createSlice({
  name: "forgetPassword",
  initialState: { forgetSuccessMsg: null, forgetError: null },
  reducers: {
    userForgetPasswordSuccess: (state, action) => {
      state.forgetSuccessMsg = action.payload
    },
    userForgetPasswordError: (state, action) => {
      state.forgetError = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(forgetPasswordThunk.pending, (state) => {
        state.forgetSuccessMsg = null
        state.forgetError = null
      })
      .addCase(forgetPasswordThunk.fulfilled, (state, action) => {
        state.forgetSuccessMsg = action.payload
      })
      .addCase(forgetPasswordThunk.rejected, (state, action) => {
        state.forgetError = action.payload
      })
  },
})

export const { userForgetPasswordSuccess, userForgetPasswordError } = forgetPasswordSlice.actions
export const userForgetPassword = (user, history) => forgetPasswordThunk({ user, history })
export default forgetPasswordSlice.reducer
