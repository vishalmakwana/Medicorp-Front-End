import { useLogin, SmartContent, Strings } from "@medicorp";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  Grid,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { Navigate } from "react-router-dom";
import { LockOutlined } from "@mui/icons-material";
import { blue } from "@mui/material/colors";
const Login = () => {
  const {
    formHeader,
    formContent,
    formActions,
    formResetKeys,
    formTaskRunning,
    freeAction,
    token,
    statusCode,
    handleForgotPassword,
    isForgotPassword,
    resetPassword
  } = useLogin();
  return (
    <>
      {token == null ? (
        <Grid
          container
          component="main"
          sx={{ height: "100vh", backgroundColor: blue[600] }}
        >
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage: 'url("../img/medicorplogo.jpg")',
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center center",
              backgroundSize: "cover",
              height: "400px",
              margin: "auto",
            }}
          />
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                margin: "auto",
                padding: "25px",
                width: "65%"
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: blue[500] }}>
                <LockOutlined />
              </Avatar>
              <Typography
                component="h1"
                variant="h5"
                sx={{ fontWeight: "bold" }}
              >
                {!isForgotPassword ? "Login" : "Reset Password"}
              </Typography>
              {/* <Typography
                variant="p"
                color={"#FF3333"}
                sx={{ display: statusCode === 401 ? "block" : "none" }}
                component="h3"
              >
                Invalid Login Details!
              </Typography> */}
              <SmartContent
                formHeader={formHeader}
                formContent={formContent}
                formActions={formActions}
                formResetKeys={formResetKeys}
                formTaskRunning={formTaskRunning}
                freeAction={freeAction}
              />
              <Link onClick={() => {
                !isForgotPassword && handleForgotPassword(!isForgotPassword)
                resetPassword && handleForgotPassword(!resetPassword)
              }}>{(isForgotPassword || resetPassword) ? Strings.BACK_TO_LOGIN : Strings.FORGOT_PASSWORD}</Link>
            </Box>
          </Grid>
        </Grid>
      ) : (
        <Navigate to="/" replace />
      )}
      {/* {token == null ?
                <Grid container spacing={2} sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "-webkit-fill-available"
                }}>
                    <Grid item xs={4} sx={{ margin: "Auto", textAlign: "center" }}>

                    </Grid>
                    <Grid item xs={4} sx={{ margin: "Auto", textAlign: "center" }}>
                        <Typography variant="h4" sx={{ color: "#d67155" }} gutterBottom component="div">
                            MEDICORP
                        </Typography>
                        <SmartContent
                            formHeader={formHeader}
                            formContent={formContent}
                            formActions={formActions}
                            formResetKeys={formResetKeys}
                            formTaskRunning={formTaskRunning}
                            freeAction={freeAction}
                        />
                    </Grid>
                    <Grid item xs={4} sx={{ margin: "Auto" }}>

                    </Grid>
                </Grid>
                : <Navigate to="/" replace />
            } */}
    </>
  );
};

export default Login;
