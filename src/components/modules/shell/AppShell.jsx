import React, { useContext, useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { Box, Snackbar, Slide, Alert } from "@mui/material"
import {
  useStyles,
  useMenuState,
  Header,
  Flyout,
  Main,
  appSettings,
  Context,
  useLocalStorage,
  getAppMenus,
  mainMenuItems,
  Footer
} from "@medicorp"

const AppShell = () => {
  const { getAppItem } = useLocalStorage()
  const { setMenus } = useContext(Context)
  const { mobileOpen, handleDrawerToggle, open } = useMenuState()
  const classes = useStyles()
  const { routeConfig } = appSettings
  const [token, setToken] = useState(getAppItem("token") || null)

  useEffect(() => {
    if (token)
      setMenus(getAppMenus(mainMenuItems))

  }, [])
  return (
    <>
      {

        token !== null ?
          <>
            <Box component="div" sx={classes.root}>
              <Header handleDrawerToggle={handleDrawerToggle} mainClass={open === true ? classes.appBar : classes.appBarShift} />
              <Flyout menuObj={{ mobileOpen, handleDrawerToggle, open }} />
              {window.innerWidth <= 600 &&
                <Box component="div" sx={[classes.mainRoot, classes.smUp]}>
                  <Main mainClassName={classes.content} />
                </Box>
              }
              {window.innerWidth > 600 &&
                <Box component="div" sx={[classes.mainRoot, classes.smDown]}>
                  <Main mainClassName={open === true ? classes.content : classes.contentShift} />
                </Box>}
            </Box>
            <Footer mainClass={open === true ? classes.appBar : classes.appBarShift} />
          </>

          : <Navigate to={routeConfig.login} replace />

      }

    </>
  )
}
export default AppShell
