import { appSettings, Context, format, Strings, useAxios, useLocalStorage, useStyles, useTableIcons, validator } from "@medicorp";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const useHeader = () => {
    const { logMessage, setIsLoading, isLoading } = useContext(Context)
    const [anchorEl, setAnchorEl] = useState(null);

    const [openDialog, setOpenDialog] = useState(false)
    const [modalHeader, setModalHeader] = useState({})
    const [modalContent, setModalContent] = useState({})
    const [modalActions, setModalActions] = useState([])
    const [modalFormResetKeys, setModalFormResetKeys] = useState([])
    const [modalTaskRunning, setModalTaskRunning] = useState(false)

    const [stateData, setStateData] = useState([])
    const [cityData, setCityData] = useState([])

    const classes = useStyles();



    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const { tableIcons } = useTableIcons()
    const { routeConfig, endpointConfig, fieldTypes, statusType } = appSettings;
    const { removeAppItem } = useLocalStorage();
    const navigate = useNavigate();

    const [{ data: countries, loading: countriesLoading }, refetchCountries] = useAxios(endpointConfig.country.getAll)
    const [{ }, stateByCountryId] = useAxios(format(endpointConfig.state.getStateByCountryId), { manual: true })
    const [{ }, cityByStateId] = useAxios(endpointConfig.city.getCityByStateId, { manual: true })

    const [{ }, signOut] = useAxios(
        {
            url: endpointConfig.SignOut.SignOut,
            method: "POST",
        },
        { manual: true }
    )
    const [{ }, changePassword] = useAxios(
        {
            url: endpointConfig.password.changePassword,
            method: "POST",
        },
        { manual: true })

    const [
        { data: userDetails, loading: userDetailsLoading }, refetchUserDetails,
    ] = useAxios(endpointConfig.authentication.getLogedInUserDetail)

    const logout = async (e) => {
        removeAppItem("token")
        signOut()
        navigate(routeConfig.login)
    };

    const [{ }, updateUsers] = useAxios(
        {
            url: endpointConfig.authentication.updateUser,
            method: "PUT"
        },
        { manual: true })


    const handleActionClick = () => {
        setIsLoading(true)
        setTimeout(() => {
            setModalData({}, false, userDetails?.data)
        }, 1000);
    }


    const setModalData = (event, isView = false, rowData = {}) => {
        setIsLoading(false)
        setModalHeader({
            isForm: true,
            title: Strings.EDIT_PROFILE,
            header: Strings.EDIT_THIS_PROFILE,
            modalWidth: 'md'
        })
        setModalContent({
            firstName: {
                label: Strings.COLUMN_FIRST_NAME,
                size: "small",
                variant: "outlined",
                col: 6,
                type: fieldTypes.text.type,
                value: rowData?.firstName ?? "",
                disabled: isView === true,
                validator: validator.nameValidator
            },
            lastName: {
                label: Strings.COLUMN_LAST_NAME,
                size: "small",
                variant: "outlined",
                col: 6,
                type: fieldTypes.text.type,
                value: rowData?.lastName ?? "",
                disabled: isView === true,
                validator: validator.nameValidator
            },
            gender: {
                label: Strings.COLUMN_GENDER,
                size: "small",
                variant: "outlined",
                col: 12,
                type: fieldTypes.radioGroup.type,
                value: rowData?.gender ?? "",
                options: [
                    { text: "Male", val: "Male" },
                    { text: "Female", val: "Female" }
                ],
                alignItems: 'center',
                flexDirection: 'column',
                row: true,
                disabled: isView === true,
                validator: validator.requiredValidator(Strings.USERS_GENDER)
            },
            email: {
                label: Strings.COLUMN_EMAIL,
                size: "small",
                variant: "outlined",
                col: 6,
                type: fieldTypes.text.type,
                value: rowData?.email ?? "",
                disabled: isView === true,
                validator: validator.emailValidator
            },
            MobileNo: {
                label: Strings.COLUMN_PHONE,
                size: "small",
                variant: "outlined",
                col: 6,
                type: fieldTypes.text.type,
                value: rowData?.phoneNumber ?? "",
                disabled: isView === true,
                validator: validator.phoneValidator
            },
            Address: {
                label: Strings.COLUMN_ADDRESS,
                size: "small",
                variant: "outlined",
                col: 12,
                type: fieldTypes.textArea.type,
                value: rowData?.address ?? "",
                disabled: isView === true,
                validator: validator.textAreaValidator
            },
            countryId: {
                label: Strings.COLUMN_COUNTRY,
                type: fieldTypes.autoComplete.type,
                size: "small",
                variant: "outlined",
                col: 4,
                titleProp: "country",
                validator: validator.requiredValidator("Country"),
                value: rowData?.countryId && { label: rowData?.countryName, id: rowData.countryId },
                menuItems: countries?.data ? countries?.data.map(g => ({
                    label: g.countryName,
                    id: g.countryId
                })).sort((a, b) => (a.text ?? "").localeCompare(b.text ?? "")) : [],
                equalityComparer: (option, value) => option.countryId === value,
                onSelectionChange: (id) => { handleSelectionChange(id, "country") }
            },
            stateId: {
                label: Strings.COLUMN_STATE,
                type: fieldTypes.autoComplete.type,
                size: "small",
                variant: "outlined",
                col: 4,
                titleProp: "State",
                validator: validator.requiredValidator("State"),
                value: rowData?.stateId && { label: rowData?.stateName, id: rowData.stateId },
                menuItems: stateData ? stateData.map(g => ({
                    label: g.stateName,
                    id: g.stateId
                })).sort((a, b) => (a.text ?? "").localeCompare(b.text ?? "")) : [],
                equalityComparer: (option, value) => option.stateId === value,
                onSelectionChange: (id) => { handleSelectionChange(id, "state") }
            },
            cityId: {
                label: Strings.COLUMN_CITY,
                type: fieldTypes.autoComplete.type,
                size: "small",
                variant: "outlined",
                col: 4,
                titleProp: "City",
                validator: validator.requiredValidator("City"),
                value: rowData.cityId && { label: rowData?.cityName, id: rowData.cityId },
                menuItems: cityData ? cityData.map(g => ({
                    label: g.cityName,
                    id: g.cityId
                })).sort((a, b) => (a.text ?? "").localeCompare(b.text ?? "")) : [],
                equalityComparer: (option, value) => option.cityId === value,
            },
            // isWebAccesses: {
            //     label: Strings.WEB_ACCESSES,
            //     size: "small",
            //     variant: "outlined",
            //     col: 4,
            //     type: fieldTypes.checkbox.type,
            //     value: rowData?.isWebAccesses ?? false,
            //     disabled: isView === true,
            // },
        })
        setModalActions(isView === true ? [] : [
            {
                label: Strings.UPDATE,
                icon: tableIcons.Edit,
                isSubmit: true,
                action: (data) => handleSubmit(data)
            }
        ])
        setOpenDialog(true)
    }

    const handleSelectionChange = (data, dataType) => {
        const { id } = data
        if (dataType === "country") {
            new Promise((resolve, reject) => {
                stateByCountryId({ url: format(endpointConfig.state.getStateByCountryId, id) })
                    .then((res) => {
                        resolve(res)
                    }).catch((error) => {
                        reject(error)
                        logMessage({
                            severity: statusType.error,
                            msg: Strings.ERROR_GETTING_DATA
                        })
                    })
            }).then((data) => {
                // modalContentDispatch("COUNTRY", data?.data?.data)
                setStateData(data?.data?.data)
            })
        } else if (dataType === "state") {
            new Promise((resolve, reject) => {
                cityByStateId({ url: format(endpointConfig.city.getCityByStateId, id) })
                    .then((res) => {
                        resolve(res)
                    }).catch((error) => {
                        reject(error)
                        logMessage({
                            severity: statusType.error,
                            msg: Strings.ERROR_GETTING_DATA
                        })
                    })
            }).then((data) => {
                // modalContentDispatch("STATE", data?.data?.data)
                setCityData(data?.data?.data)
            })
        }
    }

    const setChangePasswordModalData = (event, isView = false, rowData = {}) => {
        setIsLoading(true)
        console.log(rowData);
        setModalHeader({
            isForm: true,
            title: Strings.EDIT_PROFILE,
            header: Strings.EDIT_THIS_PROFILE,
            modalWidth: 'md'
        })
        setModalContent({
            email: {
                label: Strings.COLUMN_EMAIL,
                size: "small",
                variant: "outlined",
                col: 12,
                type: fieldTypes.text.type,
                value: userDetails?.data?.userName,
                disabled: true,
                validator: validator.emailValidator,
            },
            oldPassword: {
                label: Strings.OLD_PASSWORD,
                size: "small",
                variant: "outlined",
                col: 12,
                type: fieldTypes.password.type,
                value: "",
                validator: validator.requiredValidator(Strings.OLD_PASSWORD),
            },
            newPassword: {
                label: Strings.NEW_PASSWORD,
                size: "small",
                variant: "outlined",
                col: 12,
                type: fieldTypes.password.type,
                value: "",
                validator: validator.passwordValidator,
            },
        })
        setModalActions(isView === true ? [] : [
            {
                label: Strings.UPDATE,
                icon: tableIcons.Edit,
                isSubmit: true,
                action: (data) => handleChangePasswordSubmit(data)
            }
        ])
        setIsLoading(false)
        setOpenDialog(true)
    }

    const handleChangePasswordSubmit = (data) => {
        setModalTaskRunning(true)
        changePassword({ data }).then((res) => {
            const { msg, isError, errorMessage, message, title } = res.data
            if (res.status === 200) {
                handleModalClose()
            }
            logMessage({
                severity: !isError ? statusType.success : statusType.error,
                msg: msg ?? errorMessage ?? message ?? title ?? Strings.DATA_UPDATED_SUCCESSFULLY
            })
        }).catch(err => {
            const { msg, errorMessage, message } = err;
            logMessage({
                severity: statusType.error,
                msg: msg ?? errorMessage ?? message ?? Strings.SOMETHING_WENT_WRONG,
            })
        }).finally(() => setModalTaskRunning(false))
    }
    const handleSubmit = (data) => {
        setModalTaskRunning(true)
        const response = updateUsers({
            data: {
                ...data,
                organizationId: 1,
                cityId: data.cityId.id,
                countryId: data.countryId.id,
                stateId: data.stateId.id,
                isWebAccesses: true,
                isActive: true
            }
        })
        response.then((res) => {
            const { msg, errorMessage, message, title } = res.data
            if (res.status === 200) {
                handleModalClose()
            }
            logMessage({
                severity: res.status === 200 ? statusType.success : statusType.error,
                msg: msg ?? errorMessage ?? message ?? title ?? Strings.DATA_UPDATED_SUCCESSFULLY
            })
        }).catch(err => {
            const { msg, errorMessage, message } = err;
            logMessage({
                severity: statusType.error,
                msg: msg ?? errorMessage ?? message ?? Strings.SOMETHING_WENT_WRONG,
            })
        })
            .finally(() => {
                setModalTaskRunning(false)
                refetchUserDetails()
            })
    }
    const handleModalClose = () => {
        setOpenDialog(false)
        setModalFormResetKeys([])
    }



    useEffect(() => {
        setModalFormResetKeys(["stateId"])
        setModalContent(prevContent => ({
            ...prevContent,
            stateId: {
                ...prevContent["stateId"], menuItems: stateData && stateData.map(g => ({
                    label: g.stateName,
                    id: g.stateId
                })).sort((a, b) => (a.text ?? "").localeCompare(b.text ?? ""))
            }
        }))
    }, [stateData])
    useEffect(() => {
        setModalFormResetKeys(["cityId"])
        setModalContent(prevContent => ({
            ...prevContent,
            cityId: {
                ...prevContent["cityId"], menuItems: cityData && cityData.map(g => ({
                    label: g.cityName,
                    id: g.cityId
                })).sort((a, b) => (a.text ?? "").localeCompare(b.text ?? ""))
            }
        }))
    }, [cityData])



    return {
        anchorEl,
        setAnchorEl,
        handleClick,
        handleClose,
        logout,
        open,
        openDialog,
        handleModalClose,
        modalHeader,
        modalContent,
        modalActions,
        modalFormResetKeys,
        modalTaskRunning,
        handleActionClick,
        userDetails,
        setChangePasswordModalData

    }
}

export default useHeader