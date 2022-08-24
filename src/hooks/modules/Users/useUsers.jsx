import { useState, useContext } from 'react'
import { Context, useTableIcons, appSettings, useAxios, useConfirm, format, validator, usersDataColumn, Strings } from "@medicorp"
import { useEffect } from 'react'
const useUsers = () => {
    const { logMessage } = useContext(Context)
    const { endpointConfig, fieldTypes, statusType } = appSettings
    const { tableIcons } = useTableIcons()
    const confirm = useConfirm()

    const [openDialog, setOpenDialog] = useState(false)
    const [modalHeader, setModalHeader] = useState({})
    const [modalContent, setModalContent] = useState({})
    const [modalActions, setModalActions] = useState([])
    const [modalFormResetKeys, setModalFormResetKeys] = useState([])
    const [modalTaskRunning, setModalTaskRunning] = useState(false)
    const [stateData, setStateData] = useState([])
    const [cityData, setCityData] = useState([])


    const [{ data: users, loading: usersLoading }, refetchUsers] = useAxios(endpointConfig.users.getAll)
    const [{ data: countries, loading: countriesLoading }, refetchCountries] = useAxios(endpointConfig.country.getAll)
    const [{ }, refetchUsersById] = useAxios(endpointConfig.users.getUsersById, { manual: true })
    const [{ }, stateByCountryId] = useAxios(format(endpointConfig.state.getStateByCountryId), { manual: true })
    const [{ }, cityByStateId] = useAxios(endpointConfig.city.getCityByStateId, { manual: true })
    const [{ }, saveUsers] = useAxios(
        {
            url: endpointConfig.register.register,
            method: "POST"
        },
        { manual: true })
    const [{ }, updateUsers] = useAxios(
        {
            url: endpointConfig.users.updateUsers,
            method: "PUT"
        },
        { manual: true })
    const [{ }, deleteUser] = useAxios(
        {
            url: endpointConfig.users.deleteUsersById,
            method: "DELETE"
        },
        { manual: true })


    users?.data && users?.data.map(
        async (data) => {
            Object.assign(data, { fullName: `${data.firstName} ${data.lastName}` })
            return data
        })


    const actions = [
        {
            icon: tableIcons.Add,
            tooltip: "Add User",
            isFreeAction: true,
            onClick: (event, rowData) => handleActionClick(event, false, false, {})
        },
        // {
        //     icon: tableIcons.Edit,
        //     tooltip: "Edit Product",
        //     onClick: (event, rowData) =>
        //         new Promise((resolve) => {
        //             console.log(rowData);
        //             setModalFormResetKeys([]);
        //             refetchUsersById({
        //                 url: format(
        //                     endpointConfig.users.getUsersById,
        //                     rowData.id
        //                 ),
        //             }).then((res) => {
        //                 if (res.status === 200) {
        //                     resolve(res.data);
        //                 }
        //             }).catch((err) => err);
        //         }).then((data) => handleActionClick(event, true, false, data.data)),
        // },
        {
            icon: tableIcons.Delete,
            tooltip: "Delete Product",
            onClick: (event, rowData) =>
                new Promise((resolve) => {
                    confirm({ description: Strings.DELETE_CONFIRM }).then(
                        () => {
                            setModalFormResetKeys([]);
                            deleteUser({
                                url: format(
                                    endpointConfig.users.deleteUsersById,
                                    rowData.id
                                ),
                            }).then((res) => {
                                if (res.status === 200) {
                                    refetchUsers();
                                    logMessage({
                                        severity:
                                            statusType.success,
                                        msg: Strings.DELETED_SUCCESSFULLY
                                    })
                                    resolve(res.data);
                                }
                            }).catch((err) => {
                                logMessage({
                                    severity:
                                        statusType.error,
                                    msg: Strings.ERROR_DELETING
                                })
                            });
                        }
                    );
                }),
        },

    ]

    // const editable = {
    //     onRowUpdate: (newData, oldData) =>
    //         new Promise((resolve, reject) => {
    //             setTimeout(() => {
    //                 handleSubmit(newData, true)
    //                 resolve();
    //             }, 1000)
    //         }),
    //     onRowDelete: oldData =>
    //         new Promise((resolve, reject) => {
    //             setTimeout(() => {
    //                 deleteUser({ url: format(endpointConfig.users.deleteUsersById, oldData.id) })
    //                     .then((res) => {
    //                         if (res.status === 200) {
    //                             refetchUsers()
    //                             resolve(res.data)
    //                         }
    //                     })
    //                     .catch(err => {
    //                         console.log(err)
    //                         logMessage({
    //                             severity:
    //                                 statusType.error,
    //                             msg: "Error Deleting User!"
    //                         })
    //                     })
    //             }, 1000)
    //         }),
    // }


    const user = [
        { id: "1", firstName: "vishal", lastName: "makavana", gender: "male", email: "vishal@gmail.com", phone: "9033179395" },
        { id: "2", firstName: "makavana", lastName: "makavana", gender: "male", email: "makavana@gmail.com", phone: "9033179395" },
    ]

    const handleActionClick = (event, isEdit = false, isView = false, rowData = {}) => {

        setModalHeader({
            isForm: true,
            title: isEdit === true ? Strings.EDIT_USERS : Strings.ADD_USERS,
            header: isEdit === true ? Strings.EDIT_IN_EXISTING_USERS : Strings.CREATE_A_NEW_USERS,
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
                value: rowData?.gender ?? "Male",
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
            mobileNo: {
                label: Strings.COLUMN_PHONE,
                size: "small",
                variant: "outlined",
                col: 6,
                type: fieldTypes.text.type,
                value: rowData?.phoneNumber ?? "",
                disabled: isView === true,
                validator: validator.phoneValidator
            },
            Password: {
                label: Strings.NEW_PASSWORD,
                size: "small",
                variant: "outlined",
                col: 6,
                type: fieldTypes.password.type,
                value: "",
                validator: validator.passwordValidator
            },
            confirmPassword: {
                label: Strings.CONFIRM_NEW_PASSWORD,
                size: "small",
                variant: "outlined",
                col: 6,
                type: fieldTypes.password.type,
                value: "",
                match: {
                    field: "Password",
                    errorMsg: "both password are not matching!",
                },
                // validator: validator.confirmPasswordValidator("newPassword")
            },
            countryId: {
                label: Strings.COLUMN_COUNTRY,
                type: fieldTypes.autoComplete.type,
                size: "small",
                variant: "outlined",
                col: 4,
                titleProp: "country",
                validator: validator.requiredValidator("Country"),
                value: rowData?.countryId && { label: rowData?.countryName, id: rowData?.countryId },
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
                value: rowData?.stateId && { label: rowData?.stateName, id: rowData?.stateId },
                menuItems: stateData ? stateData.map(g => ({
                    label: g.stateName,
                    id: g.stateId
                })).sort((a, b) => (a.text ?? "").localeCompare(b.text ?? "")) : [],
                equalityComparer: (option, value) => option.stateId === value,
                onSelectionChange: (id) => { handleSelectionChange(id, "state") },
                disabled: stateData.length == 0 ? true : false
            },
            cityId: {
                label: Strings.COLUMN_CITY,
                type: fieldTypes.autoComplete.type,
                size: "small",
                variant: "outlined",
                col: 4,
                titleProp: "City",
                validator: validator.requiredValidator("City"),
                value: rowData?.cityId && { label: rowData?.cityName, id: rowData?.cityId },
                menuItems: cityData ? cityData.map(g => ({
                    label: g?.cityName,
                    id: g?.cityId
                })).sort((a, b) => (a.text ?? "").localeCompare(b.text ?? "")) : [],
                equalityComparer: (option, value) => option.cityId === value,
                disabled: cityData.length == 0 ? true : false
            },
            Address: {
                label: Strings.COLUMN_ADDRESS,
                size: "small",
                variant: "outlined",
                col: 12,
                type: fieldTypes.textArea.type,
                value: rowData?.addresses ?? "",
                disabled: isView === true,
                validator: validator.textAreaValidator
            },
            isActive: {
                label: Strings.COLUMN_USERS_IS_ACTIVE,
                size: "small",
                variant: "outlined",
                col: 12,
                type: fieldTypes.checkbox.type,
                value: rowData?.isActive ?? true,
                disabled: isView === true,
            },
        })
        setModalActions(isView === true ? [] : [
            {
                label: isEdit === true ? Strings.UPDATE : Strings.SAVE,
                icon: isEdit === true ? tableIcons.Edit : tableIcons.Save,
                isSubmit: true,
                action: isEdit === true ? (data) => handleSubmit(data, true, rowData?.id) : (data) => handleSubmit(data, false)
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

    const handleSubmit = (data, isEdit, id) => {
        setModalTaskRunning(true)
        const response = isEdit === true ? updateUsers({
            data: {
                // id: Number(id),
                ...data,
                organizationId: 1,
                companyId: 1,
                isWebAccesses: true,
                roleId: '1',
                stateId: data.stateId.id,
                cityId: data.cityId.id,
                countryId: data.countryId.id
            }
        }) : saveUsers({
            data: {
                ...data,
                organizationId: 1,
                companyId: 1,
                isWebAccesses: true,
                roleId: '1',
                stateId: data.stateId.id,
                cityId: data.cityId.id,
                countryId: data.countryId.id
            }
        })
        response.then((res) => {
            const { msg, errorMessage, message, title } = res.data
            if (res.status === 200) {
                handleModalClose()
                refetchUsers()
            }
            logMessage({
                severity: res.status === 200 ? statusType.success : statusType.error,
                msg: msg ?? errorMessage ?? message ?? title
            })
        })
            .catch(err => err)
            .finally(() => setModalTaskRunning(false))
    }

    const { columns } = usersDataColumn()

    useEffect(() => {
        setModalFormResetKeys(["stateId"])
        setModalContent(prevContent => ({
            ...prevContent,
            stateId: {
                ...prevContent["stateId"],
                menuItems: stateData && stateData.map(g => ({
                    label: g.stateName,
                    id: g.stateId
                })).sort((a, b) => (a.text ?? "").localeCompare(b.text ?? "")),
                disabled: stateData.length > 0 && false,
                value: null
            }
        }))
    }, [stateData])
    useEffect(() => {
        setModalFormResetKeys(["cityId"])
        setModalContent(prevContent => ({
            ...prevContent,
            cityId: {
                ...prevContent["cityId"],
                menuItems: cityData && cityData.map(g => ({
                    label: g.cityName,
                    id: g.cityId
                })).sort((a, b) => (a.text ?? "").localeCompare(b.text ?? "")),
                disabled: cityData.length > 0 && false,
                value: null
            }
        }))
    }, [cityData])

    const handleModalClose = () => {
        setOpenDialog(false)
        setModalFormResetKeys([])
    }
    return {
        user, users, actions, usersLoading,
        openDialog,
        handleModalClose,
        handleActionClick,
        modalHeader,
        modalContent,
        modalActions,
        modalFormResetKeys,
        modalTaskRunning,
        columns,

    }
}
export default useUsers