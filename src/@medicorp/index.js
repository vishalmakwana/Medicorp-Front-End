import { lazy } from "react";

//#region utils
export { ContextProvider as Provider, Context } from "utils/context";
export { Strings } from "utils/Strings";
export { default as config } from "utils/config";
export { appSettings } from "utils/appSettings";
export {
  getDefaultValueArray,
  validator,
  groupBy,
  reorderWidget,
  copyWidget,
  getAppMenus,
  weekDays,
  getRefactoredDates,
  getActualDates,
  enumerateDaysBetweenDates,
  mainMenuItems,
} from "utils/helper";
//#endregion

//#region Packages
export { default as PropTypes } from "prop-types";
export { styled } from "@mui/material/styles";
export {
  TreeView,
  TreeItem,
  TabList,
  TabPanel,
  TabContext,
  LocalizationProvider,
  TimePicker,
  LoadingButton,
  MobileDateRangePicker,
  DatePicker
} from "@mui/lab";
export { default as AdapterMoment } from "@mui/lab/AdapterMoment";
export { treeItemClasses, useTreeItem } from "@mui/lab/TreeItem";
export { default as MaterialTable } from "@material-table/core";
export { default as useAxios, configure } from "axios-hooks";
export { default as axios } from "axios";
export { ConfirmProvider, useConfirm } from "material-ui-confirm";
export { format } from "react-string-format";
export { default as Counter } from "react-mui-counter";
export { default as moment } from "moment";
export { v4 as uuidv4 } from "uuid";

export { default as LRU } from "lru-cache";
// export { default as MaskedInput } from "react-text-mask";

//#endregion

//#region Hooks
export { default as useStyles } from "hooks/useStyles";
export { default as useStartup } from "hooks/useStartup";
export { default as useLocalStorage } from "hooks/useLocalStorage";
export { default as useMenuState } from "hooks/modules/shell/useMenuState";
export { default as useNavTabs } from "hooks/modules/shell/useNavTabs";
export { default as useHeader } from "hooks/modules/shell/useHeader";
export { default as useNavProfile } from "hooks/modules/shell/useNavProfile";
export { default as useDashboard } from "hooks/modules/Dashboard/useDashboard";
export { default as useCategories } from "hooks/modules/Categories/useCategories";
export { default as useProducts } from "hooks/modules/Products/useProducts";
export { default as useDoctors } from "hooks/modules/Doctors/useDoctors";
export { default as useSpecialization } from "hooks/modules/specialization/useSpecialization";
export { default as useUsers } from "hooks/modules/Users/useUsers";
export { default as usePresentation } from "hooks/modules/Presentation/usePresentation";
export { default as usePresentationHistory } from "hooks/modules/PresentationHistory/usePresentationHistory";
export { default as useTableIcons } from "hooks/useTableIcons";
export { SearchBar } from "components/SearchBar";
export { SearchBox } from "components/SearchBox";
export { default as useLogin } from "hooks/modules/auth/useLogin";
export { default as useOverview } from "hooks/modules/Dashboard/Overview/useOverview";
export { default as useRecentScreens } from "hooks/modules/Dashboard/Recentscreens/useRecentScreens";
export { default as useRequiresAttention } from "hooks/modules/Dashboard/RequireAttention/useRequiresAttention";
export { default as useSystemOverview } from "hooks/modules/Dashboard/SystemOverview/useSystemOverview";
export { default as usePresentationDetailPanel } from "hooks/modules/Presentation/usePresentationDetailPanel";

//#endregion

//#region Components
export { default as ErrorFallback } from "components/ErrorFallBack/ErrorFallback";
export { default as Switch } from "components/Switch";
export { default as Themeify } from "components/Themeify";
export { StyledTreeItem } from "components/StyledTreeItem";
export { default as SmartDialog } from "components/SmartDialog";
export { default as SmartContent } from "components/SmartContent";
export { default as SmartToolbar } from "components/SmartToolbar";
export { default as SmartLayout } from "components/SmartLayout";
export { default as SearchBox2 } from "components/SearchBox2";
export { default as Column } from "components/Column";
export { default as Widget } from "components/Widget";
export { default as Startup } from "components/Startup";
export { default as AppShell } from "components/modules/shell/AppShell";
export { default as Header } from "components/modules/shell/Header";
export { default as NavProfile } from "components/modules/shell/NavProfile";
export { default as NavTabs } from "components/modules/shell/NavTabs";
export { default as Flyout } from "components/modules/shell/Flyout";
export { default as Main } from "components/modules/shell/Main";
export { default as Dashboard } from "components/modules/Dashboard/Dashboard";
// const Dashboard = lazy(() => import('components/modules/Dashboard/Dashboard'))
export { default as Categories } from "components/modules/Categories/Categories";
export { default as Products } from "components/modules/Products/Products";
export { default as Doctors } from "components/modules/Doctors/Doctors";
export { default as Specialization } from "components/modules/specialization/Specialization";
export { default as Users } from "components/modules/Users/Users";
export { default as Presentation } from "components/modules/Presentation/Presentation";
export { default as PresentationHistory } from "components/modules/PresentationHistory/PresentationHistory";
export { default as Login } from "components/modules/auth/Login";
export { default as Overview } from "components/modules/Dashboard/Overview/Overview";
export { default as RecentScreens } from "components/modules/Dashboard/Recentscreens/Recentscreens";
export { default as RequiresAttentionScreen } from "components/modules/Dashboard/RequireAttention/RequiresAttentionScreen";
export { default as SystemOverviewScreen } from "components/modules/Dashboard/SystemOverview/SystemOverviewScreen";
export { default as PresentationDetailPanel } from "components/modules/Presentation/PresentationDetailPanel";
export { default as Footer } from "components/modules/Footer/Footer";

//#endregion

//#region DataColumns
export { default as categoriesDataColumns } from "dataColumns/categoriesDataColumns";
export { default as productsDataColumns } from "dataColumns/productsDataColumns";
export { default as doctorsDataColumns } from "dataColumns/doctorsDataColumns";
export { default as specializationDataColumn } from "dataColumns/specializationDataColumn";
export { default as usersDataColumn } from "dataColumns/usersDataColumn";
export { default as presentationDataColumns } from "dataColumns/presentationDataColumns";
export { default as presentationHistoryDataColumns } from "dataColumns/presentationHistoryDataColumns";
export { default as presentationProductDataColumns } from "dataColumns/presentationProductDataColumns";
export { default as presentationHistoryByPresentationIdDataColumns } from "dataColumns/presentationHistoryByPresentationIdDataColumns";

//#endregion

// export { Dashboard }
