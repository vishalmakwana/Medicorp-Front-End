import React, { useContext, useEffect, useRef, useState } from "react"
import {
    useTableIcons,
    useConfirm,
    PresentationDetailPanel,
    Strings,
    appSettings,
    useAxios,
    format,
    presentationHistoryDataColumns,
    presentationDataColumns,
    Context,
} from "@medicorp"
import * as XLSX from "xlsx"
const usePresentationHistory = () => {
    const tableRef = useRef()
    const confirm = useConfirm()
    const { tableIcons } = useTableIcons()
    const { setIsLoading } = useContext(Context);
    const { fieldTypes, endpointConfig } = appSettings

    const [openDialog, setOpenDialog] = useState(false);
    const [modalHeader, setModalHeader] = useState({});
    const [modalContent, setModalContent] = useState({});
    const [modalActions, setModalActions] = useState([]);
    const [modalFormResetKeys, setModalFormResetKeys] = useState([]);
    const [modalTaskRunning, setModalTaskRunning] = useState(false);

    const [isPresentationLoading, setIsPresentationLoading] = useState(false)
    const [isDoctorLoading, setIsDoctorLoading] = useState(false)
    const [isUserLoading, setIsUserLoading] = useState(false)

    const { presentationColumns } = presentationDataColumns();

    const [
        { data: AllPresentationHistory, loading: AllPresentationHistoryLoading },
        refetchAllPresentationHistory,
    ] = useAxios(endpointConfig.presentationHistory.GetPresentationHistory)

    const [{ }, getPresentationByPresentationId] = useAxios(
        endpointConfig.presentation.getPresentationByPresentationId,
        { manual: true }
    )

    const [{ }, getDoctorsById] = useAxios(endpointConfig.doctors.getDoctorsById, { manual: true })
    const [{ }, getUsersById] = useAxios(endpointConfig.users.getUsersById, { manual: true })

    const detailPanel = [
        {
            tooltip: "View details",
            render: ({ rowData }) => {
                return (
                    <PresentationDetailPanel presentationId={rowData?.presentationId} />
                )
            },
        },
    ]



    const downloadToExcel = () => {

        const excelExportData = AllPresentationHistory?.data.map((data) => {
            console.log(Object.keys(data))
            return (
                {
                    historyId: data?.historyId,
                    presentationId: data?.presentationId,
                    doctorName: data?.doctorName,
                    userName: data?.userName,
                    presenationTitle: data?.presenationTitle,
                    cityName: data?.cityName,
                    stateName: data?.stateName,
                    countryName: data?.countryName,
                    organizationName: data?.organizationName,
                    emailId: data?.emailId,
                    presentationStartDate: data?.presentationStartDate,
                    presentationEndDate: data?.presentationEndDate
                }
            )
        })
        const workSheet = XLSX.utils.json_to_sheet(excelExportData)
        const workBook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workBook, workSheet, "PresentationHistory")
        let buf = XLSX.write(workBook, { bookType: "xlsx", type: "buffer" })
        XLSX.write(workBook, { bookType: "xlsx", type: "binary" })
        XLSX.writeFile(workBook, "PresentationHistory.xlsx")
    }

    const actions = [
        {
            icon: tableIcons.FileDownload,
            tooltip: "Export to Excel",
            isFreeAction: true,
            onClick: () => downloadToExcel(),
        },
    ];



    const handlePresentationClick = (presentationId) => {
        setIsLoading(true)
        getPresentationByPresentationId(format(endpointConfig.presentation.getPresentationByPresentationId, presentationId)).then((res) => {
            const { data } = res?.data
            setModalHeader({
                isForm: true,
                title: Strings.MENU_PRESENTATIONSS_TITLE,
                header: Strings.MENU_PRESENTATIONSS_TITLE,
                modalWidth: "md",
            });
            setModalContent({
                processingStatus: {
                    label: "",
                    type: fieldTypes.table.type,
                    col: 12,
                    columns: presentationColumns,
                    data: data ? [data] : [],
                    tableOptions: {
                        filtering: false,
                        selection: false,
                        grouping: false,
                        columnsButton: false,
                    },
                    detailPanel: detailPanel
                }
            });

            setOpenDialog(true);
        }).catch((err) => {
            console.log(err)
        }).finally((res) => {
            setIsLoading(false)
        })
    }

    const handleDoctorNameClick = (doctorId) => {
        setIsLoading(true)
        getDoctorsById(format(endpointConfig.doctors.getDoctorsById, doctorId)).then((res) => {
            const { data } = res?.data
            const genderOptions = [
                { text: "Male", val: "Male" },
                { text: "Female", val: "Female" }
            ]
            const isView = true
            setModalHeader({
                isForm: true,
                title: Strings.MENU_DOCTORS_TITLE,
                header: Strings.MENU_DOCTORS_TITLE,
                modalWidth: "md",
                isReadOnly: true
            });
            setModalContent({
                firstName: {
                    label: Strings.FIRST_NAME,
                    size: "small",
                    variant: "outlined",
                    col: 6,
                    type: fieldTypes.text.type,
                    value: data?.firstName ?? "",
                    disabled: isView === true,
                },
                lastName: {
                    label: Strings.LAST_NAME,
                    size: "small",
                    variant: "outlined",
                    col: 6,
                    type: fieldTypes.text.type,
                    value: data?.lastName ?? "",
                    disabled: isView === true,
                },
                gender: {
                    label: Strings.GENDER,
                    col: 12,
                    type: fieldTypes.radioGroup.type,
                    value: data?.gender ?? "Male",
                    options: genderOptions,
                    disabled: isView === true,
                    row: true,
                    isContainer: true,
                    alignItems: 'center',
                    flexDirection: 'column',
                },
                email: {
                    label: Strings.EMAIL,
                    size: "small",
                    variant: "outlined",
                    col: 6,
                    type: fieldTypes.text.type,
                    value: data?.email ?? "",
                    disabled: isView === true,
                },
                specialityId: {
                    label: Strings.COLUMN_SPECIALITY_TITLE,
                    type: fieldTypes.autoComplete.type,
                    size: "small",
                    variant: "outlined",
                    col: 6,
                    titleProp: "country",
                    value: data?.specialityId && { label: data?.specialityTitle, id: data?.specialityId },
                    menuItems: {}
                },
                mobileNumber: {
                    label: Strings.COLUMN_MOBILE_NUMBER,
                    size: "small",
                    variant: "outlined",
                    col: 4,
                    type: fieldTypes.text.type,
                    value: data?.mobileNumber ?? "",
                    disabled: isView === true,
                },
                phoneNumber: {
                    label: Strings.COLUMN_PHONE_NUMBER,
                    size: "small",
                    variant: "outlined",
                    col: 4,
                    type: fieldTypes.text.type,
                    value: data?.phoneNumber ?? "",
                    disabled: isView === true,
                },
                clinicPhoneNumber: {
                    label: Strings.COLUMN_CLINIC_PHONE_NUMBER,
                    size: "small",
                    variant: "outlined",
                    col: 4,
                    type: fieldTypes.text.type,
                    value: data?.clinicPhoneNumber ?? "",
                    disabled: isView === true,
                },
                anniversaryDate: {
                    label: Strings.COLUMN_ANNIVERSARY_DATE,
                    size: "small",
                    variant: "outlined",
                    col: 6,
                    type: fieldTypes.date.type,
                    value: data?.anniversaryDate ?? null,
                    disabled: isView === true,
                },
                dateOfBirth: {
                    label: Strings.COLUMN_DATE_OF_BIRTH,
                    size: "small",
                    variant: "outlined",
                    col: 6,
                    type: fieldTypes.date.type,
                    value: data?.dateOfBirth ?? null,
                    disabled: isView === true,
                },
                addresses: {
                    label: Strings.COLUMN_ADDRESS,
                    size: "small",
                    variant: "outlined",
                    col: 12,
                    type: fieldTypes.textArea.type,
                    value: data?.addresses ?? "",
                    disabled: isView === true,
                },
                countryId: {
                    label: Strings.COLUMN_COUNTRY,
                    type: fieldTypes.autoComplete.type,
                    size: "small",
                    variant: "outlined",
                    col: 4,
                    titleProp: "country",
                    value: data?.countryId && { label: data?.countryName, id: data?.countryId },
                    menuItems: {}

                },
                stateId: {
                    label: Strings.COLUMN_STATE,
                    type: fieldTypes.autoComplete.type,
                    size: "small",
                    variant: "outlined",
                    col: 4,
                    titleProp: "State",
                    value: data?.stateId ? { label: data?.stateName, id: data?.stateId } : {},
                    disabled: isView === true,
                    menuItems: {}
                },
                cityId: {
                    label: Strings.COLUMN_CITY,
                    type: fieldTypes.autoComplete.type,
                    size: "small",
                    variant: "outlined",
                    col: 4,
                    titleProp: "City",
                    value: data?.cityId ? { label: data.cityName, id: data.cityId } : {},
                    disabled: isView === true,
                    menuItems: {}
                },
                isActive: {
                    label: Strings.COLUMN_USERS_IS_ACTIVE,
                    size: "small",
                    variant: "outlined",
                    col: 12,
                    type: fieldTypes.checkbox.type,
                    value: data?.isActive ?? true,
                    disabled: isView === true,
                },
            })
            setOpenDialog(true);
        }).catch((err) => {
            console.log(err)
        }).finally((res) => {
            setIsLoading(false)
        })
    }

    const handleUserNameClick = (userId) => {
        setIsLoading(true)
        getUsersById(format(endpointConfig.users.getUsersById, userId)).then(async (res) => {
            const { data } = res?.data
            setModalHeader({
                isForm: true,
                title: Strings.SEARCH_TITLE_USER,
                header: Strings.SEARCH_TITLE_USER,
                modalWidth: "md",
                isReadOnly: true
            });
            setModalContent({
                firstName: {
                    label: Strings.COLUMN_FIRST_NAME,
                    size: "small",
                    variant: "outlined",
                    col: 6,
                    type: fieldTypes.text.type,
                    value: data?.firstName ?? "",
                },
                lastName: {
                    label: Strings.COLUMN_LAST_NAME,
                    size: "small",
                    variant: "outlined",
                    col: 6,
                    type: fieldTypes.text.type,
                    value: data?.lastName ?? "",
                },
                gender: {
                    label: Strings.COLUMN_GENDER,
                    size: "small",
                    variant: "outlined",
                    col: 12,
                    type: fieldTypes.radioGroup.type,
                    value: data?.gender ?? "",
                    options: [
                        { text: "Male", val: "Male" },
                        { text: "Female", val: "Female" }
                    ],
                    alignItems: 'center',
                    flexDirection: 'column',
                    row: true,
                },
                email: {
                    label: Strings.COLUMN_EMAIL,
                    size: "small",
                    variant: "outlined",
                    col: 6,
                    type: fieldTypes.text.type,
                    value: data?.email ?? "",
                },
                phone: {
                    label: Strings.COLUMN_PHONE,
                    size: "small",
                    variant: "outlined",
                    col: 6,
                    type: fieldTypes.text.type,
                    value: data?.phoneNumber ?? "",
                }
            })

            setOpenDialog(true);
        }).catch((err) => {
            console.log(err)
        }).finally((res) => {
            setIsLoading(false)
        })
    }
    const placeToLocation = (rowData) => {
        console.log(rowData);

    }

    const handleModalClose = () => {
        setOpenDialog(false);
        setModalFormResetKeys([]);
    };
    const { presentationHistoryColumns } = presentationHistoryDataColumns(handleDoctorNameClick, handleUserNameClick, handlePresentationClick, placeToLocation);
    return {
        tableRef,
        AllPresentationHistory,
        AllPresentationHistoryLoading,
        presentationHistoryColumns,
        modalHeader,
        modalContent,
        modalActions,
        modalFormResetKeys,
        modalTaskRunning,
        handleModalClose,
        openDialog,
        actions
    }
}

export default usePresentationHistory
