import {
  Dashboard,
  Category,
  Group,
  Inventory,
  Slideshow,
  WorkHistory
} from "@mui/icons-material";
import { Strings, appSettings, uuidv4, moment, PropTypes } from "@medicorp";

export const getDefaultValueArray = (options, id, optionsId = 'id', optionName) => {
  // if (!Array.isArray(data)) return [];
  if (id.length === 0) return [];
  return options.find((item) => {
    console.log({ label: item[optionName], id: item[optionsId] });
    if (item[optionsId] === id) {
      return ({
        label: item[optionName],
        id: item[optionsId]
      })
    }
  });
};

export const validator = {
  emailValidator: {
    required: { value: true, message: "Email is required" },
    pattern: {
      value: /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/i,
      message: "Email is invalid",
    },
  },
  phoneValidator: {
    required: { value: true, message: "Phone Number is required" },
    pattern: {
      value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
      message: "Phone Number is invalid",
    },
  },
  nameValidator: {
    required: { value: true, message: "Name is required" },
    pattern: {
      value: /^([a-zA-Z]{3,15})$/,
      message:
        "Name is invalid its must be minimum 4 characters & maximum 15 characters",
    },
  },
  textAreaValidator: {
    required: { value: true, message: "Address is required" },
    pattern: {
      value: /^([a-zA-Z0-9].{3,150})$/,
      message: "Address not more than 150 characters",
    },
  },

  passwordValidator: {
    required: { value: true, message: "Password is required" },
    pattern: {
      value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/,
      message: "Minimum six characters, at least one letter, one number and one special character",
    },
  },
  numberValidator: {
    required: { value: true, message: "Value is required" },
    pattern: {
      value: /^[0-9]{2,5}(?:\.[0-9]{1,2})?$/,
      message: "Enter Invalid value",
    },
  },
  confirmPasswordValidator: (value) => {
    debugger
    return ({
      required: { value: true, message: `password is required!` },
      pattern: {
        value: /^([01]\d|2[0-3]):?([0-5]\d)$/g,
        message: "Time is invalid !",
      },
    })
  },
  requiredValidator: (title) => ({
    required: { value: true, message: `${title} is required!` },
  }),
  timeValidator: {
    required: { value: true, message: "Time is required !" },
    pattern: {
      value: /^([01]\d|2[0-3]):?([0-5]\d)$/g,
      message: "Time is invalid !",
    },
  },
  imageValidator: {
    required: {
      value: true,
      message: "Product image is required.",
    },
    // validate: {
    //   lessThan10MB: (files) => {
    //     console.log(files);
    //     debugger
    //     //   // files[0]?.size < 10000000 || "Max Limit of image upload is 10MB"
    //   },
    //   // acceptedFormats: (files) =>
    //   //   ["image/jpeg", "image/png", "image/gif"].includes(files[0]?.type) ||
    //   //   "Only PNG, JPEG e GIF",
    // },
  },
  imageValidator: {
    required: {
      value: true,
      message: "Product image is required.",
    },
    // validate: {
    //   lessThan10MB: (files) => {
    //     console.log(files);
    //     debugger
    //     //   // files[0]?.size < 10000000 || "Max Limit of image upload is 10MB"
    //   },
    //   // acceptedFormats: (files) =>
    //   //   ["image/jpeg", "image/png", "image/gif"].includes(files[0]?.type) ||
    //   //   "Only PNG, JPEG e GIF",
    // },
  },
  hourValidator: {
    required: { value: true, message: "Time is required !" },
    pattern: {
      value: /^([0]{0,1}[1-9]{1}|[1]\d|[2][0-3])$/g,
      message: "Interval is invalid. Must be a whole number between 1 to 23",
    },
  },
  PriceValidator: {
    required: { value: true, message: "MRP is required !" },
    pattern: {
      value: /^[0-9]*$/,
      message: "Price is invalid !",
    },
  },
};

const {
  dashboard,
  categories,
  products,
  doctors,
  specialization,
  users,
  presentation,
  presentationHistory
} = appSettings.routeConfig;
const {
  MENU_DASHBOARD_TITLE,
  MENU_CATEGORIESS_TITLE,
  MENU_PRODUCTS_TITLE,
  MENU_DOCTORS_TITLE,
  MENU_DOCTORS_SPECIALIZATION_TITLE,
  MENU_USERS_TITLE,
  MENU_PRESENTATIONSS_TITLE,
  MENU_PRESENTATIONS_HISTORY_TITLE
} = Strings;

const menuItems = [
  {
    id: "dashboard",
    title: MENU_DASHBOARD_TITLE,
    isVisible: true,
    icon: Dashboard,
    to: dashboard.baseURL,
  },
  {
    id: "categories",
    title: MENU_CATEGORIESS_TITLE,
    isVisible: true,
    icon: Category,
    to: categories.baseURL,
  },
  {
    id: "products",
    title: MENU_PRODUCTS_TITLE,
    isVisible: true,
    icon: Inventory,
    to: products.baseURL,
  },
  {
    id: "doctors",
    title: MENU_DOCTORS_TITLE,
    isVisible: true,
    icon: Group,
    to: doctors.baseURL,
  },
  {
    id: "specialization",
    title: MENU_DOCTORS_SPECIALIZATION_TITLE,
    isVisible: true,
    icon: Group,
    to: specialization.baseURL,
  },
  {
    id: "users",
    title: MENU_USERS_TITLE,
    isVisible: true,
    icon: Group,
    to: users.baseURL,
  },
  {
    id: "presentation",
    title: MENU_PRESENTATIONSS_TITLE,
    isVisible: true,
    icon: Slideshow,
    to: presentation.baseURL,
  },
  {
    id: "presentationHistory",
    title: MENU_PRESENTATIONS_HISTORY_TITLE,
    isVisible: true,
    icon: WorkHistory,
    to: presentationHistory.baseURL,
  },
];

export const mainMenuItems = [
  {
    id: "dashboard",
    isVisible: true,
    children: null,
  },
  {
    id: "categories",
    children: null,
    isVisible: true,
  },
  {
    id: "products",
    children: null,
    isVisible: true,
  },
  {
    id: "doctors",
    children: null,
    isVisible: true,
  },
  {
    id: "specialization",
    children: null,
    isVisible: true,
  },
  {
    id: "users",
    children: null,
    isVisible: true,
  },
  {
    id: "presentation",
    children: null,
    isVisible: true,
  },
  {
    id: "presentationHistory",
    children: null,
    isVisible: true,
  },
];



export const getAppMenus = (userMenus) => {
  const getMappedChildMenu = (oc, ac) =>
    oc.map((o) => ({
      ...o,
      isVisible: ac.find((i) => i.id === o.id).isVisible,
    }));
  return menuItems.map((m) => {
    let api_mi = userMenus && userMenus.find((a) => a.id === m.id);
    return {
      ...m,
      isVisible: api_mi?.isVisible,
      children: m.children && getMappedChildMenu(m.children, api_mi.children),
    };
  });
};

export const groupBy = (xs, key) => {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

// a little function to help us with reordering the result
export const reorderWidget = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};
/**
 * Moves an item from one list to another list.
 */
export const copyWidget = (
  jobID,
  source,
  destination,
  droppableSource,
  droppableDestination
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const item = sourceClone[droppableSource.index];
  if (
    item.category === "single" &&
    destClone.some((widget) => widget.title === item.title)
  )
    return destClone;
  destClone.splice(droppableDestination.index, 0, {
    ...item,
    id: uuidv4(),
    fileProcessingTemplateId: Number(jobID),
  });
  return destClone;
};

export const weekDays = [
  {
    text: "Select Weekday",
    val: 0,
  },
  {
    text: "Monday",
    val: 1,
  },
  {
    text: "Tuesday",
    val: 2,
  },
  {
    text: "Wednesday",
    val: 3,
  },

  {
    text: "Thursday",
    val: 4,
  },
  {
    text: "Friday",
    val: 5,
  },
  {
    text: "Saturday",
    val: 6,
  },
  {
    text: "Sunday",
    val: 7,
  },
];

export const getActualDates = (dates) => {
  return (
    dates?.map((item) => ({
      startDate: moment(item.startDate).unix(),
      endDate: moment(item.endDate).unix(),
    })) ?? []
  );
};
export const getRefactoredDates = (dates, color) => {
  return (
    dates?.map((item) => ({
      startDate: moment.unix(item.startDate).toDate(),
      endDate: moment.unix(item.endDate).toDate(),
      color: color,
    })) ?? []
  );
};

/**
 *
 * @param {Number} startDate
 * @param {Number} endDate
 * @param {'['|']'} granularity
 * @returns
 */
export const enumerateDaysBetweenDates = (
  startDate,
  endDate,
  granularity = ""
) => {
  let dates = [];

  let currDate = moment(startDate);
  let lastDate = moment(endDate);
  if (currDate > lastDate) {
    let temp = lastDate;
    lastDate = currDate;
    currDate = temp;
  }

  !currDate.isSame(lastDate, "day") &&
    granularity === "[" &&
    dates.push(currDate.clone().toDate());

  while (currDate.add(1, "days").diff(lastDate) < 0) {
    dates.push(currDate.clone().toDate());
  }
  currDate.isSame(lastDate, "day") &&
    granularity === "]" &&
    dates.push(currDate.clone().toDate());
  if (dates.length <= 0) return [];
  return [
    {
      startDate: moment(dates[0]).unix(),
      endDate: moment(dates[dates.length - 1]).unix(),
    },
  ];
};
