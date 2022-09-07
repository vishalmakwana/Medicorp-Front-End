import MaterialTable from "@material-table/core";
import {
  presentationDataColumns,
  SearchBar,
  SmartDialog,
  Strings,
  usePresentation,
  useStyles,
} from "@medicorp";
import { Card } from "@mui/material";
const Presentation = () => {
  const {
    modalHeader,
    modalContent,
    modalActions,
    modalFormResetKeys,
    modalTaskRunning,
    handleModalClose,
    openDialog,
    tableRef,
    actions,
    detailPanel,
    searchOptions,
    AllPresentation,
    presentationData,
    allPresentationLoading,
    clearCTAButton,
    filterReportLabel,
    CTAButtons,
    presentationColumns
  } = usePresentation();
  const { materialTableStyle: tableStyle } = useStyles();
  return (
    <>
      <Card>
        <SearchBar options={searchOptions} clearCTAButton={clearCTAButton} CTAButtons={CTAButtons} filterReportLabel={filterReportLabel} />

        <MaterialTable
          columns={presentationColumns}
          tableRef={tableRef}
          data={presentationData !== undefined ? presentationData : AllPresentation?.data ? AllPresentation?.data : []}
          title={Strings.MENU_PRESENTATIONSS_TITLE}
          actions={actions}
          detailPanel={detailPanel}
          isLoading={allPresentationLoading}
          options={{
            ...tableStyle,
            selection: false,
            filtering: false,
            grouping: false,
            columnsButton: false,
            pageSize: 10,
            pageSizeOptions: [10, 20, 30, 50, 100],
            padding: "dense",

          }}
        />
      </Card>
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

export default Presentation;
