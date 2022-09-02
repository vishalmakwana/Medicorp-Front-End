import { useState, useContext, useEffect } from 'react'
import { Context, useTableIcons, appSettings, useAxios, useConfirm, format, validator, doctorsDataColumns, getDefaultValueArray, Strings } from "@medicorp"

export default function useDoctors() {
    const { logMessage, setIsLoading } = useContext(Context);
    const { endpointConfig, fieldTypes, statusType } = appSettings;
    const { tableIcons } = useTableIcons();
    const confirm = useConfirm();

    const [openDialog, setOpenDialog] = useState(false)
    const [modalHeader, setModalHeader] = useState({})
    const [modalContent, setModalContent] = useState({})
    const [modalActions, setModalActions] = useState([])
    const [modalFormResetKeys, setModalFormResetKeys] = useState([])
    const [modalTaskRunning, setModalTaskRunning] = useState(false)
    const [stateData, setStateData] = useState([])
    const [cityData, setCityData] = useState([])

    const genderOptions = [
        { text: "Male", val: "Male" },
        { text: "Female", val: "Female" }
    ]

    const [{ data: doctors, loading: doctorsLoading }, refetchDoctors] = useAxios(endpointConfig.doctors.getAll)
    const [{ data: countries, loading: countriesLoading }, refetchCountries] = useAxios(endpointConfig.country.getAll)
    const [{ data: cities, loading: citiesLoading }, refetchCities] = useAxios(endpointConfig.city.getAll)
    const [{ data: states, loading: stattesLoading }, refetchStates] = useAxios(endpointConfig.state.getAll)
    const [{ data: speciality, loading: specialityLoading }, refetchSpeciality] = useAxios(endpointConfig.specialization.getAll)

    const [{ }, stateByCountryId] = useAxios(format(endpointConfig.state.getStateByCountryId), { manual: true })
    const [{ }, cityByStateId] = useAxios(endpointConfig.city.getCityByStateId, { manual: true })


    const [{ }, refetchDoctorsById] = useAxios(endpointConfig.doctors.getDoctorsById, { manual: true })
    const [{ }, saveDoctors] = useAxios(
        {
            url: endpointConfig.doctors.postDoctors,
            method: "POST"
        },
        { manual: true })
    const [{ }, updateDoctors] = useAxios(
        {
            url: endpointConfig.doctors.updateDoctors,
            method: "PUT"
        },
        { manual: true })
    const [{ }, deleteDoctors] = useAxios(
        {
            url: endpointConfig.doctors.deleteDoctorsById,
            method: "DELETE"
        },
        { manual: true })

    doctors?.data && doctors?.data.map(
        async (data) => {
            Object.assign(data, { fullName: `${data.firstName} ${data.lastName}` })
            return data
        })

    const actions = [
        {
            icon: tableIcons.Add,
            tooltip: Strings.ADD_DOCTOR,
            isFreeAction: true,
            onClick: (event, rowData) => handleActionClick(event, false, false, {})
        },
        {
            icon: tableIcons.Edit,
            tooltip: Strings.EDIT_APPLICATION,
            onClick: (event, rowData) => new Promise((resolve) => {
                setIsLoading(true)
                setModalFormResetKeys([])
                refetchDoctorsById({ url: format(endpointConfig.doctors.getDoctorsById, rowData.doctorId) }).then(res => {
                    if (res.status === 200) {
                        resolve(res.data.data)
                    }
                }).catch(err => {
                    console.log(err)
                    setIsLoading(false)
                })
            }).then(data => handleActionClick(event, true, false, data))
        },
        {
            icon: tableIcons.Delete,
            tooltip: Strings.DELETE_APPLICATION,
            onClick: (event, rowData) => new Promise((resolve) => {
                confirm({ description: Strings.DELETE_CONFIRM })
                    .then(() => {
                        setModalFormResetKeys([])
                        deleteDoctors({ url: format(endpointConfig.doctors.deleteDoctorsById, rowData.doctorId) })
                            .then((res) => {
                                if (res.status === 200) {
                                    refetchDoctors()
                                    resolve(res.data)
                                    logMessage({
                                        severity:
                                            statusType.success,
                                        msg: Strings.DELETED_SUCCESSFULLY
                                    })
                                }
                            })
                            .catch(err => {
                                logMessage({
                                    severity:
                                        statusType.error,
                                    msg: Strings.ERROR_DELETING
                                })
                            })
                    })
            })
        }
    ]

    const handleActionClick = (event, isEdit = false, isView = false, rowData = {}) => {
        setIsLoading(false)
        setModalFormResetKeys([])
        setModalHeader({
            isForm: true,
            title: isEdit === true ? Strings.EDIT_DOCTORS : Strings.ADD_DOCTOR,
            header: isEdit === true ? Strings.EDIT_IN_EXISTING_DOCTORS : Strings.CREATE_A_NEW_DOCTORS,
            modalWidth: 'md'
        })
        setModalContent({
            firstName: {
                label: Strings.FIRST_NAME,
                size: "small",
                variant: "outlined",
                col: 6,
                type: fieldTypes.text.type,
                value: rowData?.firstName ?? "",
                disabled: isView === true,
                validator: validator.nameValidator
            },
            lastName: {
                label: Strings.LAST_NAME,
                size: "small",
                variant: "outlined",
                col: 6,
                type: fieldTypes.text.type,
                value: rowData?.lastName ?? "",
                disabled: isView === true,
                validator: validator.nameValidator
            },
            gender: {
                label: Strings.GENDER,
                col: 12,
                type: fieldTypes.radioGroup.type,
                value: rowData?.gender ?? "Male",
                options: genderOptions,
                disabled: isView === true,
                row: true,
                isContainer: true,
                alignItems: 'center',
                flexDirection: 'column',
                validator: validator.requiredValidator(Strings.DOCTORS_GENDER)
            },
            email: {
                label: Strings.EMAIL,
                size: "small",
                variant: "outlined",
                col: 4,
                type: fieldTypes.text.type,
                value: rowData?.email ?? "",
                disabled: isView === true,
                validator: validator.emailValidator
            },
            specialityId: {
                label: Strings.COLUMN_SPECIALITY_TITLE,
                type: fieldTypes.autoComplete.type,
                size: "small",
                variant: "outlined",
                col: 6,
                titleProp: "country",
                validator: validator.requiredValidator(Strings.SPECIALITY),
                value: rowData?.specialityId && { label: rowData?.specialityTitle, id: rowData?.specialityId },
                menuItems: speciality?.data ? speciality?.data.map(g => ({
                    label: g?.title,
                    id: g?.specialityId
                })).sort((a, b) => (a.text ?? "").localeCompare(b.text ?? "")) : [],
                equalityComparer: (option, value) => option.specialityId === value,
            },
            mobileNumber: {
                label: Strings.COLUMN_MOBILE_NUMBER,
                size: "small",
                variant: "outlined",
                col: 4,
                type: fieldTypes.text.type,
                value: rowData?.mobileNumber ?? "",
                disabled: isView === true,
                validator: validator.phoneValidator
            },
            phoneNumber: {
                label: Strings.COLUMN_PHONE_NUMBER,
                size: "small",
                variant: "outlined",
                col: 4,
                type: fieldTypes.text.type,
                value: rowData?.phoneNumber ?? "",
                disabled: isView === true,
            },
            clinicPhoneNumber: {
                label: Strings.COLUMN_CLINIC_PHONE_NUMBER,
                size: "small",
                variant: "outlined",
                col: 4,
                type: fieldTypes.text.type,
                value: rowData?.clinicPhoneNumber ?? "",
                disabled: isView === true,
            },
            anniversaryDate: {
                label: Strings.COLUMN_ANNIVERSARY_DATE,
                size: "small",
                variant: "outlined",
                col: 6,
                type: fieldTypes.date.type,
                value: rowData?.anniversaryDate ?? null,
                disabled: isView === true,
            },
            dateOfBirth: {
                label: Strings.COLUMN_DATE_OF_BIRTH,
                size: "small",
                variant: "outlined",
                col: 6,
                type: fieldTypes.date.type,
                value: rowData?.dateOfBirth ?? null,
                disabled: isView === true,
            },
            addresses: {
                label: Strings.COLUMN_ADDRESS,
                size: "small",
                variant: "outlined",
                col: 12,
                type: fieldTypes.textArea.type,
                value: rowData?.addresses ?? "",
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
                action: isEdit === true ? (data) => handleSubmit(data, true, rowData?.doctorId, rowData?.organizationName, rowData?.organizationId) :
                    (data) => {
                        handleSubmit(data, false, null, doctors[0]?.organizationName, doctors[0]?.organizationId)
                    }
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

    const handleSubmit = (data, isEdit, id, organizationName, organizationId) => {
        setModalTaskRunning(true)
        const response = isEdit === true ? updateDoctors({
            data: {
                ...data,
                doctorId: Number(id),
                organizationId: 1,
                specialityId: data.specialityId.id,
                isDelete: false,
                stateId: data.stateId.id,
                cityId: data.cityId.id,
                countryId: data.countryId.id
            }
        }) : saveDoctors({
            data: {
                ...data,
                // doctorId: 0,
                organizationId: 1,
                specialityId: data.specialityId.id,
                isDelete: false,
                stateId: data.stateId.id,
                cityId: data.cityId.id,
                countryId: data.countryId.id
            }
        })
        response.then((res) => {
            const { msg, errorMessage, message, title, isError, errorTitle, statusCode } = res.data
            if (res?.data?.statusCode === 200) {
                // handleModalClose()
                refetchDoctors()
                handleModalClose()
            }
            logMessage({
                severity: !isError && statusCode != 400 ? statusType.success : statusType.error,
                msg: msg ?? message ?? errorTitle ?? title ?? errorMessage ?? Strings.DATA_ADDED_SUCCESSFULLY
            })
        }).catch(err => err)
            .finally(() => setModalTaskRunning(false))
    }

    const handleModalClose = () => {
        setModalFormResetKeys([])
        setStateData([])
        setCityData([])
        setOpenDialog(false)
    }
    const { columns } = doctorsDataColumns()


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



    return {
        columns,
        doctors,
        actions,
        doctorsLoading,
        openDialog,
        handleModalClose,
        handleActionClick,
        modalHeader,
        modalContent,
        modalActions,
        modalFormResetKeys,
        modalTaskRunning,
    };
}
