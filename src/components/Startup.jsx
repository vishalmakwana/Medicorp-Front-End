import React, { useContext } from "react"
import { Route, useNavigate, Routes } from "react-router-dom"
import {
  Login,
  Provider,
  AppShell,
  appSettings,
  Context,
  useStyles
} from "@medicorp"
import { Alert, Slide, Snackbar } from "@mui/material"
import { ClipLoader } from "react-spinners"

const Startup = () => {
  const navigate = useNavigate()
  const { spinnerContainer, spinnerMain } = useStyles()
  const { snak_open, setSnackOpen, snackContent, isLoading } = useContext(Context)
  const { defaultDuration, statusType } = appSettings
  const { login } = appSettings.routeConfig
  return (
    <>
      <Routes>
        <Route path={login} element={<Login />} />
        <Route path="*" element={<AppShell />} />
      </Routes>
      <Snackbar
        open={snak_open}
        autoHideDuration={defaultDuration}
        onClose={() => setSnackOpen(false)}
        TransitionComponent={(props) => (
          <Slide {...props} direction="right" />
        )}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert severity={snackContent.severity ?? statusType.default} variant="filled">
          {snackContent.msg}
        </Alert>
      </Snackbar>

      {isLoading && <div style={spinnerContainer}><ClipLoader cssOverride={spinnerMain} /></div>}
    </>
  )
}
export default Startup
