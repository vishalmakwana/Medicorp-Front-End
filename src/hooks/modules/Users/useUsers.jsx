import { useState, useContext } from 'react'
import { Context, useTableIcons, appSettings, useAxios, useConfirm, format, validator, usersDataColumn, Strings } from "@medicorp"
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



    const [{ data: users, loading: usersLoading }, refetchUsers] = useAxios(endpointConfig.users.getAll)
    const [{ }, refetchUsersById] = useAxios(endpointConfig.users.getUsersById, { manual: true })
    const [{ }, saveUsers] = useAxios(
        {
            url: endpointConfig.users.postUsers,
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
        // {
        //     icon: tableIcons.Add,
        //     tooltip: "Add User",
        //     isFreeAction: true,
        //     onClick: (event, rowData) => handleActionClick(event, false, false, {})
        // },
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
            phone: {
                label: Strings.COLUMN_PHONE,
                size: "small",
                variant: "outlined",
                col: 6,
                type: fieldTypes.text.type,
                value: rowData?.phoneNumber ?? "",
                disabled: isView === true,
                validator: validator.phoneValidator
            }
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
    const handleSubmit = (data, isEdit, id) => {
        setModalTaskRunning(true)
        const response = isEdit === true ? updateUsers({
            data: {
                // id: Number(id),
                organizationId: 1,
                ...data
            }
        }) : saveUsers({ data })
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