import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getFirebaseBackend } from "../../../helpers/firebase_helper"
import { postFakeProfile, postJwtProfile } from "../../../helpers/fakebackend_helper"

const fireBaseBackend = getFirebaseBackend()

const editProfileThunk = createAsyncThunk("profile/editProfile", async ({ user }, { rejectWithValue }) => {
  try {
    let response
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      response = await fireBaseBackend.editProfileAPI(user.username, user.idx)
    } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      response = await postJwtProfile("/post-jwt-profile", { username: user.username, idx: user.idx })
    } else {
      response = await postFakeProfile({ username: user.username, idx: user.idx })
    }
    return response
  } catch (error) {
    return rejectWithValue(error.message || String(error))
  }
})

const profileSlice = createSlice({
  name: "profile",
  initialState: { error: "", success: "" },
  reducers: {
    resetProfileFlag: (state) => {
      state.success = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(editProfileThunk.fulfilled, (state, action) => {
        state.success = action.payload
      })
      .addCase(editProfileThunk.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export const { resetProfileFlag } = profileSlice.actions
export const editProfile = (user) => editProfileThunk({ user })
export default profileSlice.reducer
