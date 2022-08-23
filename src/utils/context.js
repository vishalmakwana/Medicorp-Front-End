import React, { createContext, useState, useEffect } from "react";
import { configure, axios, appSettings, useLocalStorage } from "@medicorp";

const Context = createContext();

function ContextProvider(props) {
  const { axiosConfig, defaultSnackContent } = appSettings;
  const [snak_open, setSnackOpen] = useState(false);
  const [snackContent, setSnackContent] = useState(defaultSnackContent);
  const [jobName, setJobName] = useState("");
  const [isManipulation, setIsManipulation] = useState(false);
  const [menus, setMenus] = useState([])
  const { getAppItem } = useLocalStorage();

  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState(getAppItem("token"));
  //#region axios interceptors
  // axios.interceptors.request.use(
  //     async (config) => {
  //         config.headers = {
  //             Authorization: `Bearer ${token}`
  //         }
  //     },
  //     (error) => Promise.reject(error)
  // )

  // response interceptor intercepting 401 responses, refreshing token and retrying the request
  axios.defaults.baseURL = `${axiosConfig.baseURL}`
  axios.defaults.headers = { Authorization: `Bearer ${token}` }

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const config = error.config

      if (error.response.status === 401 && !config._retry) {
        config._retry = true;
        return axios(config);
      }

      return Promise.reject(error);
    }
  );
  //#endregion

  useEffect(() => {
    configure({
      axios: axios.create({
        ...axiosConfig,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (snak_open === false) setSnackContent(defaultSnackContent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snak_open]);

  const logMessage = ({ msg, severity }) => {
    setSnackContent({ msg, severity });
    setSnackOpen(msg && Object.keys(msg).length > 0 ? true : false);
  };
  return (
    <Context.Provider
      value={{
        snak_open,
        setSnackOpen,
        logMessage,
        snackContent,
        jobName,
        menus,
        setMenus,
        setJobName,
        isManipulation,
        setIsManipulation,
        setToken,
        setIsLoading,
        isLoading
      }}
    >
      {props.children}
    </Context.Provider>
  );
}

export { ContextProvider, Context };
