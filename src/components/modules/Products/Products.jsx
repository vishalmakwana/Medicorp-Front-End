import MaterialTable from "@material-table/core";
import { SmartDialog, Strings, useProducts, useStyles } from "@medicorp";
import React from "react";

const Products = () => {
  const {
    productsColumn,
    actions,
    modalHeader,
    modalContent,
    modalActions,
    modalFormResetKeys,
    modalTaskRunning,
    handleModalClose,
    openDialog,
    AllProducts,
    allProductsLoading,
  } = useProducts();
  const { materialTableStyle: tableStyle } = useStyles();

  return (
    <>
      <MaterialTable
        columns={productsColumn}
        data={AllProducts?.data ? AllProducts?.data : []}
        title={Strings.MENU_PRODUCTS_TITLE}
        actions={actions}
        options={{
          ...tableStyle,
          selection: false,

        }}
        isLoading={allProductsLoading}
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
};

export default Products;
