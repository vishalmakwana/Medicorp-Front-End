import { useState, useContext } from "react";
import {
  Context,
  useTableIcons,
  appSettings,
  useAxios,
  useConfirm,
  format,
  validator,
  Strings,
} from "@medicorp";
function useSpecialization() {
  const { logMessage } = useContext(Context);
  const { endpointConfig, fieldTypes, statusType } = appSettings;
  const { tableIcons } = useTableIcons();
  const confirm = useConfirm();

  const [openDialog, setOpenDialog] = useState(false);
  const [modalHeader, setModalHeader] = useState({});
  const [modalContent, setModalContent] = useState({});
  const [modalActions, setModalActions] = useState([]);
  const [modalFormResetKeys, setModalFormResetKeys] = useState([]);
  const [modalTaskRunning, setModalTaskRunning] = useState(false);

  const [
    { data: specialization, loading: specializationLoading },
    refetchSpecialization,
  ] = useAxios(endpointConfig.specialization.getAll);
  const [{ }, refetchSpecializationById] = useAxios(
    endpointConfig.specialization.getSpecializationById,
    { manual: true }
  );
  const [{ }, postSpecialization] = useAxios(
    {
      url: endpointConfig.specialization.postSpecialization,
      method: "POST",
    },
    { manual: true }
  );
  const [{ }, updateSpecialization] = useAxios(
    {
      url: endpointConfig.specialization.updateSpecialization,
      method: "PUT",
    },
    { manual: true }
  );
  const [{ }, deleteSpecialization] = useAxios(
    {
      url: endpointConfig.specialization.deleteSpecializationById,
      method: "DELETE",
    },
    { manual: true }
  );

  const actions = [
    {
      icon: tableIcons.Add,
      tooltip: "Add User",
      isFreeAction: true,
      onClick: (event, rowData) => handleActionClick(event, false, false, {}),
    }
  ];

  const editable = {
    onRowUpdate: (newData, oldData) =>
      new Promise(async (resolve, reject) => {
        await updateSpecialization({
          data: {
            ...newData,
            organizationId: 1,
            isDelete: false,
          },
        }).then(async (res) => {
          const { msg, errorMessage, message, title, isError } = res.data;
          if (res.status === 200) {
            await refetchSpecialization();
            resolve();
          }
          logMessage({
            severity: !isError ? statusType.success : statusType.error,
            msg: msg ?? errorMessage ?? message ?? title ?? Strings.DATA_ADDED_SUCCESSFULLY
          });
        })
          .catch((err) => {
            console.log(err)
            reject()
          })
          .finally(() => setModalTaskRunning(false))
      }),
    onRowDelete: oldData =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          deleteSpecialization({
            url: format(
              endpointConfig.specialization.deleteSpecializationById,
              oldData.specialityId
            ),
          }).then((res) => {
            if (res.status === 200) {
              refetchSpecialization()
              resolve(res.data)
            }
          })
            .catch(err => {
              console.log(err)
              logMessage({
                severity:
                  statusType.error,
                msg: Strings.ERROR_DELETING_DATA
              })
            })
        }, 1000)
      }),
  }

  const handleActionClick = (
    event,
    isEdit = false,
    isView = false,
    rowData = {}
  ) => {
    setModalHeader({
      isForm: true,
      title: isEdit === true ? Strings.EDIT_SPECIALIZATION : Strings.ADD_SPECIALIZATION,
      header:
        isEdit === true
          ? Strings.EDIT_IN_EXISTING_SPECIALIZATION
          : Strings.CREATE_A_NEW_SPECIALIZATION,
      modalWidth: "md",
    });
    setModalContent({
      title: {
        label: Strings.COLUMN_SPECIALIZATION,
        size: "small",
        variant: "outlined",
        col: 12,
        type: fieldTypes.text.type,
        value: rowData?.title ?? "",
        disabled: isView === true,
        validator: validator.requiredValidator(Strings.COLUMN_SPECIALIZATION)
      },
      specialityDescription: {
        label: Strings.COLUMN_DESCRIPTION,
        size: "small",
        variant: "outlined",
        col: 12,
        type: fieldTypes.textArea.type,
        value: rowData?.specialityDescription ?? "",
        disabled: isView === true,
        validator: validator.requiredValidator(Strings.COLUMN_DESCRIPTION)
      },
      isActive: {
        label: Strings.COLUMN_ACTIVE,
        size: "small",
        variant: "outlined",
        col: 12,
        type: fieldTypes.checkbox.type,
        value: rowData?.isActive ?? true,
        disabled: isView === true,
      },
    });
    setModalActions(
      isView === true
        ? []
        : [
          {
            label: isEdit === true ? Strings.UPDATE : Strings.SAVE,
            icon: isEdit === true ? tableIcons.Edit : tableIcons.Save,
            isSubmit: true,
            action:
              isEdit === true
                ? (data) => handleSubmit(data, true, rowData?.specialityId)
                : (data) => handleSubmit(data, false),
          },
        ]
    );
    setOpenDialog(true);
  };
  const handleSubmit = (data, isEdit) => {
    setModalTaskRunning(true);
    const response =
      isEdit === true
        ? updateSpecialization({
          data: {
            ...data,
            organizationId: 1,
            isDelete: false,
          },
        })
        : postSpecialization({
          data: {
            ...data,
            organizationId: 1,
            isDelete: false,
          },
        });
    response
      .then(async (res) => {
        const { msg, errorMessage, message, title, isError } = res.data;
        if (res.status === 200) {
          await refetchSpecialization();
          handleModalClose();
        }
        logMessage({
          severity: !isError ? statusType.success : statusType.error,
          msg: msg ?? errorMessage ?? message ?? title ?? Strings.DATA_ADDED_SUCCESSFULLY
        });
      })
      .catch((err) => err)
      .finally(() => setModalTaskRunning(false));
  };

  const handleModalClose = () => {
    setOpenDialog(false);
    setModalFormResetKeys([]);
  };
  return {
    specialization,
    actions,
    specializationLoading,
    openDialog,
    handleModalClose,
    handleActionClick,
    modalHeader,
    modalContent,
    modalActions,
    modalFormResetKeys,
    modalTaskRunning,
    editable
  };
}

export default useSpecialization;
