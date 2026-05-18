import { createSlice } from "@reduxjs/toolkit"
import {
  layoutTypes,
  layoutModeTypes,
  layoutWidthTypes,
  topBarThemeTypes,
  sidebarSizeTypes,
  leftSideBarThemeTypes,
} from "../../constants/layout"

const INIT_STATE = {
  layoutType: layoutTypes.VERTICAL,
  layoutModeType: layoutModeTypes.LIGHT,
  layoutWidth: layoutWidthTypes.FLUID,
  leftSideBarTheme: leftSideBarThemeTypes.LIGHT,
  topbarTheme: topBarThemeTypes.LIGHT,
  sidebarSizeType: sidebarSizeTypes.ICON,
  isPreloader: false,
  showRightSidebar: false,
  isMobile: false,
  showSidebar: true,
  leftMenu: false,
}

function setBodyAttr(attr, value) {
  if (document.body) document.body.setAttribute(attr, value)
}

function manageBodyClass(cssClass, action = "toggle") {
  if (!document.body) return
  if (action === "add") document.body.classList.add(cssClass)
  else if (action === "remove") document.body.classList.remove(cssClass)
  else document.body.classList.toggle(cssClass)
}

const layoutSlice = createSlice({
  name: "layout",
  initialState: INIT_STATE,
  reducers: {
    setLayoutType: (state, action) => { state.layoutType = action.payload },
    setLayoutMode: (state, action) => { state.layoutModeType = action.payload },
    setLayoutWidth: (state, action) => { state.layoutWidth = action.payload },
    setSidebarTheme: (state, action) => { state.leftSideBarTheme = action.payload },
    setTopbarTheme: (state, action) => { state.topbarTheme = action.payload },
    setSidebarSize: (state, action) => { state.sidebarSizeType = action.payload },
    setShowRightSidebar: (state, action) => { state.showRightSidebar = action.payload },
    changePreloader: (state, action) => { state.isPreloader = action.payload },
    showSidebar: (state, action) => { state.showSidebar = action.payload },
    toggleLeftmenu: (state, action) => { state.leftMenu = action.payload },
  },
})

const {
  setLayoutType,
  setLayoutMode,
  setLayoutWidth,
  setSidebarTheme,
  setTopbarTheme,
  setSidebarSize,
  setShowRightSidebar,
} = layoutSlice.actions

export const { changePreloader, showSidebar, toggleLeftmenu } = layoutSlice.actions

export const changeLayout = (layout) => (dispatch) => {
  if (layout === "horizontal") {
    document.body.removeAttribute("data-sidebar")
    document.body.removeAttribute("data-sidebar-size")
    setBodyAttr("data-topbar", "colored")
    dispatch(setTopbarTheme("colored"))
  } else {
    setBodyAttr("data-topbar", "light")
    dispatch(setTopbarTheme("light"))
  }
  setBodyAttr("data-layout", layout)
  dispatch(setLayoutType(layout))
}

export const changeLayoutMode = (mode) => (dispatch) => {
  setBodyAttr("data-bs-theme", mode)
  if (document.body.getAttribute("data-layout") === "vertical") {
    setBodyAttr("data-sidebar", mode)
    setBodyAttr("data-topbar", mode)
  }
  dispatch(setLayoutMode(mode))
}

export const changeLayoutWidth = (width) => (dispatch) => {
  setBodyAttr("data-layout-size", width === "lg" ? "fluid" : "boxed")
  dispatch(setLayoutWidth(width))
}

export const changeSidebarTheme = (theme) => (dispatch) => {
  setBodyAttr("data-sidebar", theme)
  dispatch(setSidebarTheme(theme))
}

export const changeTopbarTheme = (theme) => (dispatch) => {
  setBodyAttr("data-topbar", theme)
  dispatch(setTopbarTheme(theme))
}

export const changeSidebarSize = (sidebarSizeType) => (dispatch) => {
  const sizeMap = { lg: "lg", small: "small", sm: "sm" }
  setBodyAttr("data-sidebar-size", sizeMap[sidebarSizeType] || "lg")
  dispatch(setSidebarSize(sidebarSizeType))
}

export const showRightSidebarAction = (isopen) => (dispatch) => {
  manageBodyClass("right-bar-enabled", isopen ? "add" : "remove")
  dispatch(setShowRightSidebar(isopen))
}

export default layoutSlice.reducer
