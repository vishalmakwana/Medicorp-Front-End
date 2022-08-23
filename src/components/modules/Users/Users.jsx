import {

  useUsers,
  useStyles,
  Strings,
  MaterialTable,
  SmartDialog,
} from "@medicorp";
import React from "react";

const Users = () => {
  const { user, users, actions, usersLoading,
    openDialog,
    handleModalClose,
    modalHeader,
    modalContent,
    modalActions,
    modalFormResetKeys,
    modalTaskRunning,
    columns,
  } = useUsers()

  const { materialTableStyle: tableStyle } = useStyles()
  return (
    <>
      <MaterialTable
        columns={columns}
        data={users?.data ? users?.data : []}
        title={Strings.COLUMN_USERS_TITLE}
        actions={actions}
        options={{
          ...tableStyle,
          selection: false
        }}
        isLoading={usersLoading} />

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
};

export default Users;
