import { configureStore } from "@reduxjs/toolkit"
import loginReducer from "./auth/login/reducer"
import accountReducer from "./auth/register/reducer"
import forgetPasswordReducer from "./auth/forgetpwd/reducer"
import profileReducer from "./auth/profile/reducer"
import layoutReducer from "./layout/reducer"

const store = configureStore({
  reducer: {
    Login: loginReducer,
    Account: accountReducer,
    ForgetPassword: forgetPasswordReducer,
    Profile: profileReducer,
    Layout: layoutReducer,
  },
})

export default store
