import React, { createRef, useContext, useEffect, useMemo, useRef, useState } from "react"
import {
    useTableIcons,
    useConfirm,
    PresentationDetailPanel,
    Strings,
    appSettings,
    useAxios,
    format,
    Context,
    validator,
    getDefaultValueArray,
    presentationProductDataColumns
} from "@medicorp"
import * as XLSX from "xlsx"
import { Paper, Typography } from "@mui/material"
import { MTableToolbar } from "@material-table/core"

const usePresentation = () => {


    const confirm = useConfirm()
    const { setIsLoading, logMessage } = useContext(Context)
    const { tableIcons } = useTableIcons()
    const { fieldTypes, endpointConfig, statusType } = appSettings


    const [openDialog, setOpenDialog] = useState(false);
    const [modalHeader, setModalHeader] = useState({});
    const [modalContent, setModalContent] = useState({});
    const [modalActions, setModalActions] = useState([]);
    const [modalFormResetKeys, setModalFormResetKeys] = useState([]);
    const [modalTaskRunning, setModalTaskRunning] = useState(false);


    const [formContent, setFormContent] = useState({})
    const [formActions, setFormActions] = useState([])
    const [formResetKeys, setFormResetKeys] = useState([])
    const [formTaskRunning, setFormTaskRunning] = useState(false)

    const [presentationData, setPresentationData] = useState()
    const [filterReportLabel, setFilterReportLabel] = useState(["All"])
    const [filters, setFilters] = useState([])

    const [searchOptions, setSearchOptions] = useState({})
    const [presentationProductOrder, setPresentationProductOrder] = useState()
    const [presentationProductId, setPresentationProductId] = useState()
    const [searchData, setSearchData] = useState({
        sSearchText: null,
        sDoctor: null,
        sUser: null,
    })
    const materialTableRef = createRef()
    const tableRef = useRef()
    const [
        { data: AllProducts, loading: allProductsLoading },
        refetchAllProducts,
    ] = useAxios(endpointConfig.products.getAll);
    const [
        { data: AllPresentation, loading: allPresentationLoading },
        refetchAllPresentation,
    ] = useAxios(endpointConfig.presentation.getAll)
    const [
        { data: searchDoctorsMenuItems, loading: searchDoctorsMenuItemsLoading },
        refetchSearchDoctorsMenuItems,
    ] = useAxios(endpointConfig.doctors.getAll)
    const [
        { data: searchUserMenuItems, loading: searchUserMenuItemsLoading },
        refetchSearchUserMenuItems,
    ] = useAxios(endpointConfig.users.getAll)
    const [{ }, getPresentationByDoctorId] = useAxios(
        endpointConfig.presentation.getPresentationByDoctorId,
        { manual: true }
    )
    const [{ }, getPresentationByUserId] = useAxios(
        endpointConfig.presentation.getPresentationByUserId,
        { manual: true }
    )
    const [{ }, getPresentationByPresentationId] = useAxios(
        endpointConfig.presentation.getPresentationByPresentationId,
        { manual: true }
    )
    const [{ }, updatePresentation] = useAxios(
        {
            url: endpointConfig.presentation.updatePresentation,
            method: 'PUT'
        },
        { manual: true }
    )
    const [{ }, createPresentation] = useAxios(
        {
            url: endpointConfig.presentation.createPresentation,
            method: 'POST'
        },
        { manual: true }
    )

    // const [{ }, presentationProduct,] = useAxios(endpointConfig.presentation.getPresentationProductByPresentationId, { manual: true });

    const { columns } = presentationProductDataColumns(AllProducts?.data, presentationProductOrder, presentationProductId)


    useEffect(() => {
        setModalContent(prev => ({
            ...prev,
            presentationProductMappings: {
                ...prev['presentationProductMappings'],
                columns: columns
            },
        }))
    }, [presentationProductOrder, presentationProductId])

    const downloadToExcel = () => {

        setIsLoading(true)
        try {
            const excelExportData = AllPresentation?.data.map((presentationData) => {
                return ({
                    presentationId: presentationData.presentationId,
                    doctorName: presentationData.doctorName,
                    userName: presentationData.userName,
                })
            })
            const workSheet = XLSX.utils.json_to_sheet(excelExportData)
            const workBook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workBook, workSheet, "Presentation")
            let buf = XLSX.write(workBook, { bookType: "xlsx", type: "buffer" })
            XLSX.write(workBook, { bookType: "xlsx", type: "binary" })
            XLSX.writeFile(workBook, "Presentation.xlsx")
            setTimeout(() => {
                setIsLoading(false)
            }, 1000);
        } catch (error) {
            setTimeout(() => {
                setIsLoading(false)
            }, 1000);
            console.log(error)
            logMessage({
                severity: statusType.error,
                msg: "Error Downloading File!"
            })
        }
    }
    const actions = [

        {
            icon: tableIcons.Add,
            tooltip: "Create Presentation",
            isFreeAction: true,
            onClick: (event) => {
                handleActionClick(event, false, false)
            },
        },
        {
            icon: tableIcons.Edit,
            tooltip: "Edit Presentation",
            onClick: (event, rowData) => {

                new Promise((resolve) => {
                    setIsLoading(true)
                    setModalFormResetKeys([]);
                    getPresentationByPresentationId({
                        url: format(
                            endpointConfig.presentation.getPresentationByPresentationId,
                            rowData?.presentationID
                        ),
                    }).then((res) => {
                        if (res.status === 200) {
                            resolve(res.data);
                        }
                    }).catch((err) => {
                        setIsLoading(false)
                        console.log(err)
                    });
                }).then((data) => {
                    // setPresentationProductData(rowData?.products)
                    handleActionClick(event, true, false, data.data)
                    console.log(materialTableRef.current.dataManager.data)
                    setPresentationProductOrder(materialTableRef.current?.dataManager?.data.map(val => val.order))
                    setPresentationProductId(materialTableRef.current?.dataManager?.data.map(val => val.productID))

                })

            }
        },
        {
            icon: tableIcons.FileDownload,
            tooltip: "Export to Excel",
            isFreeAction: true,
            onClick: () => downloadToExcel(),
        },
    ];

    const presentationProductTableActions = [
        passwordRowData => ({
            icon: passwordRowData.type === 'password' ? tableIcons.View : tableIcons.Hide,
            tooltip: `${passwordRowData.type === 'password' ? 'Show' : 'Hide'} Password`,
            // onClick: (rowData) => {
            //     presentationProductDataColumns(AllProducts?.data, presentationProductOrder);
            //      
            // }
        })
    ]
    const presentationProductEditOptions = {
        onRowAdd: newData =>
            new Promise((resolve, reject) => {
                const dataAdd = Array.from(materialTableRef.current?.dataManager?.data)
                dataAdd.push({
                    productID: newData?.productName?.id,
                    productName: newData?.productName?.label,
                    order: newData?.order
                })
                setPresentationProductOrder(dataAdd.map(val => val.order))
                setPresentationProductId(dataAdd.map(val => val.productID))
                setModalFormResetKeys(['presentationProductMappings'])
                setModalContent(prevContent => ({
                    ...prevContent,
                    presentationProductMappings: {
                        ...prevContent['presentationProductMappings'],
                        data: dataAdd,
                    }
                }))
                resolve()
            }),
        onRowDelete: oldData =>
            new Promise((resolve, reject) => {
                const dataDelete = Array.from(materialTableRef.current?.dataManager?.data)
                const index = oldData.tableData.id
                dataDelete.splice(index, 1)
                setModalFormResetKeys(['presentationProductMappings'])
                setModalContent(prevContent => ({
                    ...prevContent,
                    presentationProductMappings: {
                        ...prevContent['presentationProductMappings'],
                        data: dataDelete,
                    }
                }))
                resolve()
            })
    }

    const handleActionClick = (
        event,
        isEdit = false,
        isView = false,
        rowData = {}
    ) => {
        !isEdit && setModalContent(prev => ({
            ...prev,
            presentationProductMappings: {
                ...prev['presentationProductMappings'],
                columns: columns
            },
        }))
        setPresentationProductOrder(materialTableRef.current?.dataManager?.data.map(val => val.order))
        setPresentationProductId(materialTableRef.current?.dataManager?.data.map(val => val.productID))
        setIsLoading(false)
        setModalHeader({
            isForm: true,
            title: isEdit ? Strings.EDIT_PRESENTATION : Strings.ADD_PRESENTATION,
            header: isEdit ? Strings.EDIT_PRESENTATION : Strings.ADD_PRESENTATION,
            modalWidth: "md",
        });

        setModalContent(prev => ({
            title: {
                label: Strings.PRESENTATION_TITLE,
                size: "small",
                variant: "outlined",
                col: 12,
                type: fieldTypes.text.type,
                value: rowData?.title ?? "",
                disabled: isView === true,
                validator: validator.requiredValidator(Strings.NAME),
            },
            doctorId: {
                label: Strings.SEARCH_TITLE_DOCTOR,
                type: fieldTypes.autoComplete.type,
                size: "small",
                variant: "outlined",
                col: 6,
                titleProp: "Doctor",
                validator: validator.requiredValidator(Strings.SEARCH_TITLE_DOCTOR),
                value: rowData?.doctorId && { label: rowData?.doctorName, id: rowData?.doctorId },
                menuItems: searchDoctorsMenuItems?.data ? searchDoctorsMenuItems?.data.map(g => ({
                    label: `${g.firstName} ${g.lastName}`,
                    id: g.doctorId,
                })).sort((a, b) => (a.text ?? "").localeCompare(b.text ?? "")) : [],
                equalityComparer: (option, value) => option.specialityId === value,
            },
            userId: {
                label: Strings.SEARCH_TITLE_USER,
                type: fieldTypes.autoComplete.type,
                size: "small",
                variant: "outlined",
                col: 6,
                titleProp: "User",
                validator: validator.requiredValidator(Strings.SEARCH_TITLE_USER),
                value: rowData?.userId && { label: rowData?.userName, id: rowData?.userId },
                menuItems: searchUserMenuItems?.data ? searchUserMenuItems?.data.map(g => ({
                    label: `${g.firstName} ${g.lastName}`,
                    id: g.id,
                })).sort((a, b) => (a.text ?? "").localeCompare(b.text ?? "")) : [],
                equalityComparer: (option, value) => option.specialityId === value,
            },
            presentationDate: {
                label: Strings.COLUMN_PRESENTATION_DATE,
                size: "small",
                variant: "outlined",
                col: 4,
                type: fieldTypes.date.type,
                value: rowData?.presentationDate ?? null,
                disabled: isView === true,
            },
            isActive: {
                label: Strings.COLUMN_ACTIVE,
                size: "small",
                variant: "outlined",
                col: 12,
                type: fieldTypes.checkbox.type,
                value: rowData?.isActive ?? false,
                disabled: isView === true,
            },
            presentationProductMappings: {
                ...prev['presentationProductMappings'],
                label: "Products For Presentation",
                title: <Typography variant="body1"><b>Products For Presentation</b></Typography>,
                type: fieldTypes.table.type,
                col: 12,
                // columns: !isEdit && columns,
                ref: materialTableRef,
                data: rowData?.products,
                actions: presentationProductTableActions,
                editable: presentationProductEditOptions,
                tableOptions: {
                    search: false,
                    filtering: false,
                    selection: false,
                    grouping: false,
                    columnsButton: false,
                    draggable: false,
                    sorting: false,
                    paging: false,
                    // header: false
                },
                components: {
                    Container: props => <Paper {...props} elevation={0} variant="outlined" sx={{ borderColor: 'rgba(0,0,0,0.2)' }} />,
                    Toolbar: props => <MTableToolbar {...props} variant="dense" />
                }
            },
            // ...prev
        }));
        setModalActions([
            {
                label: isEdit === true ? Strings.UPDATE : Strings.CREATE,
                icon: isEdit === true ? tableIcons.Edit : tableIcons.Save,
                isSubmit: true,
                action: (data) => handleSubmit(data, isEdit, rowData),
            },
        ]);
        setOpenDialog(true);
    };

    const handleSubmit = (data, isEdit, rowData) => {
        const params = {
            ...data,
            doctorId: data?.doctorId?.id,
            userId: data?.userId?.id,
            presentationId: rowData?.presentationId ?? 0,
            presentationProductMappings: materialTableRef.current.dataManager.data.map(item => item),
            OrganizationId: 1
        }
        const response = isEdit ? updatePresentation({
            data: {
                ...params
            }
        }) : createPresentation({
            data: {
                ...params
            }
        })

        response.then((res) => {
            const { msg, errorMessage, message, title, isError, status, errors } =
                res.data;
            console.log(res.data);
            if (res.status === 200 || res.status === 201) {
                handleModalClose();
                refetchAllProducts();
            }
            logMessage({
                severity: !isError ? statusType.success : statusType.error,
                msg:
                    errorMessage ?? msg ?? message ?? isError
                        ? Strings.ERROR_OCCURED_WHILE_ADDING_DATA
                        : isEdit === true
                            ? Strings.EDITED_SUCCESSFULLY
                            : Strings.DATA_ADDED_SUCCESSFULLY,
            });
        }).catch((err) => err)
            .finally(() => {
                refetchAllPresentation()
                setModalTaskRunning(false)
            });

    };
    const detailPanel = [
        {
            tooltip: "View details",
            render: ({ rowData }) => (
                <PresentationDetailPanel presentationId={rowData?.presentationID} />
            ),
        },
    ]

    const handleSelectionChange = (data, sFieldName) => {
        switch (sFieldName) {
            case "sSearchText":
                setSearchData(prev => ({ ...prev, sSearchText: { value: data?.target?.value, name: data?.target?.value } }))
                // searchData["sSearchText"] = [...searchData["sSearchText"], { value: data?.target?.value, name: data?.target?.value }]
                // if (searchData["sSearchText"].length > 0) {
                //     searchData["sSearchText"] = [...searchData["sSearchText"], { value: data?.target?.value, name: data?.target?.value }]
                // } else {
                //     // setSearchData(prev => ({ ...prev, sSearchText: { value: data?.target?.value, name: data?.target?.value } }))
                //     searchData["sSearchText"] = [{ value: data?.target?.value, name: data?.target?.value }]
                // }
                break;
            case "sDoctor":
                setSearchData(prev => ({ ...prev, sDoctor: { value: data?.value, name: data?.children } }))
                // searchData["sDoctor"] = { value: data?.value, name: data?.children }
                break;
            case "sUser":
                setSearchData(prev => ({ ...prev, sUser: { value: data?.value, name: data?.children } }))
                // searchData["sUser"] = { value: data?.value, name: data?.children }
                break;

            default:
                break;
        }

    }

    useEffect(() => {
        setSearchOptionsData()
    }, [searchDoctorsMenuItems, searchUserMenuItems])


    const setSearchOptionsData = () => {
        setSearchOptions({
            title: "",
            spacing: 1,
            searchItems: {
                search: {
                    label: Strings.SEARCH_TITLE,
                    type: fieldTypes.search.type,
                    size: "small",
                    variant: "outlined",
                    col: 4,
                    value: "",
                    handleSearchChange: (e) => {
                        handleSelectionChange(e, "sSearchText")
                    },
                },
                doctorList: {
                    label: Strings.SEARCH_TITLE_DOCTOR,
                    type: fieldTypes.select.type,
                    size: "small",
                    variant: "outlined",
                    col: 4,
                    value: "",
                    menuItems: searchDoctorsMenuItems?.data
                        ? searchDoctorsMenuItems?.data
                            .map((g) => ({
                                text: `${g.firstName} ${g.lastName}`,
                                val: g.doctorId,
                            }))
                            .sort((a, b) => (a.text ?? "").localeCompare(b.text ?? ""))
                        : [],
                    onSelectionChange: (e, data) => {
                        handleSelectionChange(data, "sDoctor")
                    },
                },
                userList: {
                    label: Strings.SEARCH_TITLE_USER,
                    type: fieldTypes.select.type,
                    size: "small",
                    variant: "outlined",
                    col: 4,
                    value: "",
                    menuItems: searchUserMenuItems?.data
                        ? searchUserMenuItems?.data
                            .map((g) => ({
                                text: `${g.firstName} ${g.lastName}`,
                                val: g.id,
                            }))
                            .sort((a, b) => (a.text ?? "").localeCompare(b.text ?? ""))
                        : [],
                    onSelectionChange: (e, data) => {
                        handleSelectionChange(data, "sUser")
                    },
                },
            },
        })
    }

    const handleModalClose = () => {
        setOpenDialog(false);
        setModalFormResetKeys([]);
    };


    const handleSearch = () => {
        setPresentationData([])
        setFilterReportLabel([])
        let presentationFilteredData;

        new Promise(async (resolve, reject) => {
            if (searchData["sSearchText"] !== null) {
                presentationFilteredData = await AllPresentation?.data && AllPresentation?.data.filter((val) => {
                    if (val.doctorName.toLowerCase().match(searchData["sSearchText"].value.toLowerCase())) {
                        return val
                    }
                    if (val.userName.toLowerCase().match(searchData["sSearchText"].value.toLowerCase())) {
                        return val
                    }
                    if (val.presentationID == searchData["sSearchText"].value) {
                        return val
                    }

                })
            }
            if (searchData["sDoctor"] !== null) {
                if (presentationFilteredData) {
                    presentationFilteredData = await presentationFilteredData && presentationFilteredData.filter((val) => {
                        if (searchData["sDoctor"]?.value === val?.doctorId) {
                            return val
                        }
                    })
                } else {
                    await getPresentationByDoctorId({
                        url: format(
                            endpointConfig.presentation.getPresentationByDoctorId,
                            searchData["sDoctor"]?.value
                        ),
                    }).then((res) => {
                        res.data.data && setPresentationData(prev => [...prev, ...res.data.data])
                        presentationFilteredData = res.data.data
                    }).catch((err) => {
                        console.log(err)
                    })
                }

            }

            if (searchData["sUser"] !== null) {
                if (presentationFilteredData) {
                    presentationFilteredData = await presentationFilteredData && presentationFilteredData.filter((val) => {
                        if (searchData["sUser"]?.value === val?.userId) {
                            return val
                        }
                    })
                } else {
                    await getPresentationByUserId({
                        url: format(
                            endpointConfig.presentation.getPresentationByUserId,
                            searchData["sUser"]?.value
                        ),
                    }).then((res) => {
                        res.data.data && setPresentationData(prev => [...prev, ...res.data.data])
                        presentationFilteredData = res.data.data
                    }).catch((err) => {
                        console.log(err)
                    })
                }
            }
            resolve(presentationFilteredData)
        }).then((res) => {
            setPresentationData(res)
            if (searchData["sDoctor"] !== null || searchData["sUser"] !== null || searchData["sSearchText"] !== null) {
                Object.values(searchData).map((val) => {
                    if (val?.name && val?.name !== undefined) {
                        setFilterReportLabel((prev) => [...prev, val.name])
                    }
                })
            } else {
                setFilterReportLabel(["All"])
            }

        }).catch((err) => {
            console.log(err);
        })




    }


    const CTAButtons = [
        {
            title: <tableIcons.Search />,
            handleClick: handleSearch,
            id: 1,
        }
    ]

    const clearCTAButton = {
        title: Strings.CLEAR_FILTER,
        handleClick: () => {
            setFilterReportLabel(["All"])
            setSearchData({
                sSearchText: null,
                sDoctor: null,
                sUser: null,
            })

            setSearchOptionsData()
            setPresentationData()

        }
    }



    return {
        tableRef,
        detailPanel,
        searchOptions,
        AllPresentation,
        presentationData,
        allPresentationLoading,
        clearCTAButton,
        filterReportLabel,
        CTAButtons,
        actions,
        modalHeader,
        modalContent,
        modalActions,
        modalFormResetKeys,
        modalTaskRunning,
        handleModalClose,
        openDialog,
    }
}

export default usePresentation
