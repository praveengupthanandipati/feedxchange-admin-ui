import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getFirebaseBackend } from "../../../helpers/firebase_helper"
import { postFakeLogin, postJwtLogin, postSocialLogin } from "../../../helpers/fakebackend_helper"

const fireBaseBackend = getFirebaseBackend()

const loginUserThunk = createAsyncThunk("login/loginUser", async ({ user, history }, { rejectWithValue }) => {
  try {
    let response
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      response = await fireBaseBackend.loginUser(user.email, user.password)
    } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      response = await postJwtLogin({ email: user.email, password: user.password })
      localStorage.setItem("authUser", JSON.stringify(response))
    } else {
      response = await postFakeLogin({ email: user.email, password: user.password })
      localStorage.setItem("authUser", JSON.stringify(response))
    }
    history("/dashboard")
    return response
  } catch (error) {
    return rejectWithValue(error.message || String(error))
  }
})

const logoutUserThunk = createAsyncThunk("login/logoutUser", async (history, { rejectWithValue }) => {
  try {
    localStorage.removeItem("authUser")
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      await fireBaseBackend.logout()
    }
    history("/login")
  } catch (error) {
    return rejectWithValue(error.message || String(error))
  }
})

const socialLoginThunk = createAsyncThunk("login/socialLogin", async ({ data, history, type }, { rejectWithValue }) => {
  try {
    let response
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      response = await fireBaseBackend.socialLoginUser(data, type)
      localStorage.setItem("authUser", JSON.stringify(response))
    } else {
      response = await postSocialLogin(data)
      localStorage.setItem("authUser", JSON.stringify(response))
    }
    history("/dashboard")
    return response
  } catch (error) {
    return rejectWithValue(error.message || String(error))
  }
})

const loginSlice = createSlice({
  name: "login",
  initialState: { error: "", loading: false },
  reducers: {
    apiError: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true
        state.error = ""
      })
      .addCase(loginUserThunk.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(logoutUserThunk.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(socialLoginThunk.pending, (state) => {
        state.loading = true
      })
      .addCase(socialLoginThunk.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(socialLoginThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { apiError } = loginSlice.actions
export const loginUser = (user, history) => loginUserThunk({ user, history })
export const logoutUser = (history) => logoutUserThunk(history)
export const socialLogin = (data, history, type) => socialLoginThunk({ data, history, type })
export default loginSlice.reducer
