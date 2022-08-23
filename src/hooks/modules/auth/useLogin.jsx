import {
  appSettings,
  useTableIcons,
  useAxios,
  useLocalStorage,
  config,
  Context,
  Strings,
  validator,
} from "@medicorp";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
  const ref = useRef()
  const { parseJwt } = config();
  const { fieldTypes, endpointConfig, statusType } = appSettings;
  const { setAppItem, getAppItem } = useLocalStorage();
  const { tableIcons } = useTableIcons();
  const navigate = useNavigate();
  const [formHeader, setFormHeader] = useState({});
  const [formContent, setFormContent] = useState({});
  const [formActions, setFormActions] = useState([]);
  const [formResetKeys, setFormResetKeys] = useState([]);
  const [formTaskRunning, setFormTaskRunning] = useState(false);
  const [freeAction, setFreeAction] = useState(null);
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [resetPassword, setResetPassword] = useState(false)
  const { logMessage, setToken: setContextToken } = useContext(Context);

  const [userInputData, setUserInputData] = useState()

  const [token, setToken] = useState(getAppItem("token") || null);
  const [statusCode, setstatusCode] = useState();

  const [{ }, forgotPasswordSendOTP] = useAxios(
    {
      url: endpointConfig.password.forgotPassword,
      method: "POST",
    },
    { manual: true })

  const [{ }, handeleResetPassword] = useAxios(
    {
      url: endpointConfig.password.resetPassword,
      method: "POST",
    },
    { manual: true })
  const [{ }, authData] = useAxios(
    {
      url: endpointConfig.authentication.authentication,
      method: "POST",
    },
    { manual: true }
  );

  const handleSubmit = (data) => {
    setFormTaskRunning(true)
    setUserInputData(data)
    isForgotPassword ? forgotPasswordSendOTP({ data })
      .then((res) => {
        if (res?.data?.statusCode === 200) {
          logMessage({
            severity: statusType.success,
            msg: "We Have Sent An OTP On Your Email Address."
          })
          setResetPassword(true)
          setIsForgotPassword(false)
          setFormTaskRunning(false)
        } else {
          logMessage({
            severity: statusType.error,
            msg: "Invalid Email Address!",
          })
          setFormTaskRunning(false)
        }
      })
      .catch((err) => {
        const { msg, errorMessage, message } = err;
        logMessage({
          severity: statusType.error,
          msg: msg ?? errorMessage ?? message ?? Strings.TRY_AGAIN_AFTER_SOME_TIME,
        })
        setFormTaskRunning(false)
      }) :
      (
        resetPassword ? handeleResetPassword({ data }).then((res) => {
          const { msg, errorMessage, message } = res;
          if (res.status === 200) {
            logMessage({
              severity: statusType.success,
              msg: msg ?? "Password Updated Sucessfully.."
            })
            setResetPassword(false)
            setIsForgotPassword(false)
            navigate(`/`)
            setFormTaskRunning(false)
          } else {
            logMessage({
              severity: statusType.error,
              msg: "Invalid Email Address!",
            })
            setFormTaskRunning(false)
          }
        }).catch((err) => {
          const { msg, errorMessage, message } = err;
          logMessage({
            severity: statusType.error,
            msg: msg ?? errorMessage ?? message ?? Strings.TRY_AGAIN_AFTER_SOME_TIME,
          })
          setFormTaskRunning(false)
        }) :
          authData({
            data: {
              userName: data.email,
              password: data.password,
              fcmToken: "",
              organizationId: 1,
            },
          }).then((res) => {
            setstatusCode(res.status);
            if (res.status == 200) {
              setInterval(() => {
                // const useDetails = parseJwt(res.data);
                // console.log(useDetails);
                setFormTaskRunning(false);
              }, 2000);
              setAppItem("token", res.data);
              setContextToken(res.data)
              navigate(`/`);
            } else {
              const { msg, errorMessage, message } = res;
              logMessage({
                severity: statusType.error,
                msg: msg ?? errorMessage ?? message ?? res.data ?? Strings.INVALID_LOGIN_DETAILS,
              });
            }
          }).catch((error) => {
            const { msg, errorMessage, message } = error;
            logMessage({
              severity: statusType.error,
              msg: msg ?? errorMessage ?? message ?? Strings.TRY_AGAIN_AFTER_SOME_TIME,
            });
          }).finally(() => setFormTaskRunning(false)))
  };

  const setLoginFormContent = () => {
    setFormResetKeys([])
    setFormContent(
      isForgotPassword ?
        {
          email: {
            label: Strings.EMAIL,
            type: fieldTypes.text.type,
            size: "small",
            variant: "outlined",
            col: 12,
            validator: validator.emailValidator
          }
        } :
        (resetPassword ?
          {
            email: {
              label: Strings.EMAIL,
              type: fieldTypes.text.type,
              size: "small",
              variant: "outlined",
              col: 12,
              value: userInputData.email,
              disabled: true,
              validator: validator.emailValidator
            },
            otp: {
              label: Strings.OTP,
              type: fieldTypes.text.type,
              size: "small",
              variant: "outlined",
              col: 12,
              value: "",
              validator: validator.numberValidator
            },
            newPassword: {
              label: Strings.NEW_PASSWORD,
              size: "small",
              variant: "outlined",
              col: 12,
              type: fieldTypes.password.type,
              value: "",
              validator: validator.passwordValidator
            },
            confirmPassword: {
              label: Strings.CONFIRM_NEW_PASSWORD,
              size: "small",
              variant: "outlined",
              col: 12,
              type: fieldTypes.password.type,
              value: "",
              match: {
                field: "newPassword",
                errorMsg: "both password are not matching!",
              },
              // validator: validator.confirmPasswordValidator("newPassword")
            },
          } :
          {
            email: {
              label: Strings.EMAIL,
              type: fieldTypes.text.type,
              size: "small",
              variant: "outlined",
              col: 12,
              value: "",
              validator: validator.emailValidator
            },
            password: {
              label: Strings.PASSWORD,
              size: "small",
              variant: "outlined",
              col: 12,
              type: fieldTypes.password.type,
              value: "",
              validator: validator.passwordValidator
            },
          }
        )
    );
    setFormActions([
      {
        label: isForgotPassword ? Strings.SEND_OTP : (resetPassword ? Strings.RESET_PASSWORD : Strings.LOGIN),
        endIcon: (!isForgotPassword && !resetPassword) && tableIcons.Login,
        loadingPosition: "end",
        isSubmit: true,
        color: "primary",
        action: (data) => {
          handleSubmit(data);
        },
        sx: { margin: "10px auto", width: "100%", borderRadius: "23px" },
        cnt_sx: { width: "100%" },
      },
    ]);
  };

  const handleForgotPassword = (val) => {
    setIsForgotPassword(val)
    setResetPassword(val)
  }

  useEffect(() => {
    setLoginFormContent();
  }, [isForgotPassword]);

  return {
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
  };
};

export default useLogin;
