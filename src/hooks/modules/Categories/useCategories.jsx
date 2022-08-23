import {
  appSettings,
  Context,
  useTableIcons,
  useAxios,
  useConfirm,
  format,
  Strings,
  validator,
} from "@medicorp";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
function useCategories() {
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


  const [{ data: AllCategories, loading: allCategoriesLoading }, refetchAllCategories] = useAxios(endpointConfig.categories.getAll)
  const [{ }, refetchCategoriesById] = useAxios(endpointConfig.categories.getCategoriesById, { manual: true })

  const [{ }, postCategories] = useAxios(
    {
      url: endpointConfig.categories.postCategories,
      method: "POST"
    },
    { manual: true })
  const [{ }, updateCategories] = useAxios(
    {
      url: endpointConfig.categories.updateCategories,
      method: "PUT"
    },
    { manual: true })

  const [{ }, deleteCategories] = useAxios(
    {
      url: endpointConfig.categories.deleteCategoriesById,
      method: "DELETE"
    },
    { manual: true })

  const actions = [
    {
      icon: tableIcons.Add,
      tooltip: Strings.ADD_CATEGORY,
      isFreeAction: true,
      onClick: (event, rowData) => handleActionClick(event, false, false, {})
    }
  ]

  const editable = {
    onRowUpdate: (newData, oldData) =>
      new Promise((resolve, reject) => {
        updateCategories({
          url: format(endpointConfig.categories.updateCategories),
          data: {
            ...newData,
            organizationId: 1,
            isDelete: false,
          }
        }).then(async (res) => {
          const { msg, errorMessage, message, title, isError } = res.data
          if (res.status === 200 || res.status === 201) {
            await refetchAllCategories()
            resolve()
          }
          logMessage({
            severity:
              !isError ? statusType.success : statusType.error,
            msg: msg ?? errorMessage ?? message ?? title ?? Strings.CATEGORY_ADDED_SUCCESSFULLY
          })
        })
          .catch(err => {
            console.log(err)
            reject()
          })
      }),
    // onRowDelete: oldData =>
    //   new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       deleteCategories({ url: format(endpointConfig.categories.deleteCategoriesById, oldData.categoryId) })
    //         .then((res) => {
    //           if (res.status === 200) {
    //             refetchAllCategories()
    //             resolve(res.data)
    //           }
    //         })
    //         .catch(err => {
    //           console.log(err)
    //           logMessage({
    //             severity:
    //               statusType.error,
    //             msg: Strings.ERROR_DELETING_CATEGORIES
    //           })
    //         })
    //     }, 1000)
    //   }),
  }




  const handleSubmit = (data, isEdit) => {
    console.log(data);
    setModalTaskRunning(true)
    const response = isEdit === true ? updateCategories({
      url: format(endpointConfig.categories.updateCategories),
      data: {
        organizationId: 1,
        isDelete: false,
        ...data
      }
    }) : postCategories({ data: { ...data, organizationId: 1, isDelete: false } })
    response.then((res) => {
      const { msg, errorMessage, message, title, isError } = res.data
      if (res.status === 200 || res.status === 201) {
        handleModalClose()
        refetchAllCategories()
      }
      logMessage({
        severity:
          !isError ? statusType.success : statusType.error,
        msg: msg ?? errorMessage ?? message ?? title ?? Strings.CATEGORY_ADDED_SUCCESSFULLY
      })
    })
      .catch(err => err)
      .finally(() => setModalTaskRunning(false))
  }



  const handleActionClick = (event, isEdit = false, isView = false, rowData = {}) => {
    console.log(rowData);
    setModalHeader({
      isForm: true,
      title: isEdit === true ? Strings.EDIT_CATEGORY : Strings.ADD_CATEGORY,
      header: isEdit === true ? Strings.EDIT_THIS_EXISTING_CATEGORY : Strings.CREATE_A_NEW_CATEGORY,
      modalWidth: 'md'
    })
    setModalContent({
      categoryName: {
        label: Strings.COLUMN_CATEGORY_NAME,
        size: "small",
        variant: "outlined",
        col: 12,
        type: fieldTypes.text.type,
        value: rowData?.categoryName ?? "",
        disabled: isView === true,
        validator: validator.requiredValidator(Strings.CATEGORY_NAME_IS_REQUIRED)
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
    setModalActions([
      {
        label: isEdit === true ? Strings.UPDATE : Strings.SAVE,
        icon: isEdit === true ? tableIcons.Edit : tableIcons.Save,
        isSubmit: true,
        action: (data) => handleSubmit(data, isEdit, rowData),
      },
    ]);
    setOpenDialog(true)
  }

  const handleModalClose = () => {
    setOpenDialog(false)
    setModalFormResetKeys([])
  }


  return {
    openDialog,
    modalHeader,
    modalContent,
    modalActions,
    modalFormResetKeys,
    modalTaskRunning,
    actions,
    AllCategories,
    allCategoriesLoading,
    handleModalClose,
    editable

  }

};



export default useCategories;
