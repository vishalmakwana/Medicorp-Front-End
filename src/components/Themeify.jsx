import React from "react";
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
  StyledEngineProvider,
} from "@mui/material/styles";
import { appSettings } from "@medicorp";
import { blue, grey } from "@mui/material/colors";

const Themeify = (props) => {
  const { colors } = appSettings.calendarConfig;
  const theme = createTheme({
    palette: {
      mode: "light",
      primary: {
        dark: blue[600],
        main: blue[500],
        contrastText: "#fff",
      },
      secondary: {
        dark: blue[600],
        main: blue[500],
        light: blue[500],
        contrastText: "#fff",
      },
      text: {
        primary: "rgba(0, 0, 0, 0.87)",
        secondary: "rgba(0, 0, 0, 0.87)",
      },
    },
    // MuiButtonBase: {
    //   root: {
    //     MuiTableSortLabel: {
    //       root: {
    //         "&.Mui-focused, &.Mui-active , &.Mui-active .Mui-focused": {
    //           colors: "#FFF",
    //         },
    //       },
    //     },
    //   },
    // },
    components: {
      MuiAppBar: {
        styleOverrides: {
          colorDefault: {
            backgroundColor: grey[800],
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          size: "small",
        },
      },
      MuiSelect: {
        defaultProps: {
          size: "small",
        },
      },

      MuiCssBaseline: {
        styleOverrides: `
                  .calendar{
                    height: 100% !important;
                    overflow:hidden;
                  }
                  .calendar table.month td.day.disabled .day-content{
                    background: ${colors.Weekend};
                    color: black;
                    border-radius: 0px;
                    
                  }
                  .calendar table.month td.disabled .day-content:hover{
                    background: ${colors.Weekend} !important;
                  }
                  .calendar .months-container .month-container {
                    margin-bottom: 28px;
                  }
                  tbody tr:nth-of-type(even){
                    background: #f6f6f6;
                  }
                `,
      },
    },
  });
  const responsiveTheme = responsiveFontSizes(theme);
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={responsiveTheme}>{props.children}</ThemeProvider>
    </StyledEngineProvider>
  );
};
export default Themeify;
