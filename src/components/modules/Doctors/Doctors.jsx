import React from "react";
import {
  useDoctors,
  useStyles,
  Strings,
  MaterialTable,
  SmartDialog,
} from "@medicorp";

export default function Doctors() {
  const {
    columns,
    doctors,
    actions,
    doctorsLoading,
    openDialog,
    handleModalClose,
    modalHeader,
    modalContent,
    modalActions,
    modalFormResetKeys,
    modalTaskRunning,
  } = useDoctors();
  const { materialTableStyle: tableStyle } = useStyles();
  return (
    <>
      <MaterialTable
        columns={columns}
        data={doctors?.data ? doctors?.data : []}
        title={Strings.COLUMN_DOCTORS_TITLE}
        actions={actions}
        options={{
          ...tableStyle,
          selection: false,

        }}
        isLoading={doctorsLoading}
      />

      <SmartDialog
        open={openDialog}
        handleClose={handleModalClose}
        modalHeader={modalHeader}
        modalContent={modalContent}
        modalActions={modalActions}
        modalFormResetKeys={modalFormResetKeys}
        modalTaskRunning={modalTaskRunning}
      />
    </>
  );
}
