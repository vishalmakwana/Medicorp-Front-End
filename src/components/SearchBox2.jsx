import React, { useRef, Fragment, useEffect } from "react"
import {
    Box,
    Grid,
    Button,
    MenuItem,
    TextField,
    Chip,
    Checkbox,
    Radio,
    RadioGroup,
    ListItemText,
    FormControlLabel,
    FormControl,
    FormLabel,
    Switch as MUSwitch,
    Autocomplete,
    Typography,
} from "@mui/material"
import { useForm, Controller } from "react-hook-form"
import { CheckBoxOutlineBlank, CheckBox } from "@mui/icons-material"
import "ace-builds/src-noconflict/mode-csharp"
import "ace-builds/src-noconflict/theme-textmate"
import {
    Switch,
    useStyles,
    LoadingButton,
    appSettings,
    groupBy,
    useTableIcons,
} from "@medicorp"
import AdapterDateFns from "@mui/lab/AdapterDateFns"
import { DatePicker, DateRangePicker, LocalizationProvider } from "@mui/lab"

const SearchBox2 = ({
    formHeader,
    formContent,
    formActions,
    formResetKeys,
    formTaskRunning,
    formTemplate,
    freeAction,
    enableFreeFormAction,
}) => {
    const { isReadOnly, alignActions } = formHeader ?? {}
    const {
        handleSubmit,
        control,
        formState: { errors },
        clearErrors,
        reset,
        getValues,
    } = useForm()

    const classes = useStyles()
    const { tableIcons } = useTableIcons()
    const { fieldTypes, fieldGroupTypes } = appSettings
    const refSubmitButton = useRef()

    const arrayFieldTypes = Object.entries(fieldTypes)
        .filter(([key, item]) => item.group === fieldGroupTypes.array)
        .map((item) => item[1].type)

    const nullableFieldTypes = Object.entries(fieldTypes)
        .filter(([key, item]) => item.group === fieldGroupTypes.nullable)
        .map((item) => item[1].type)
    const booleanFieldTypes = Object.entries(fieldTypes)
        .filter(([key, item]) => item.group === fieldGroupTypes.boolean)
        .map((item) => item[1].type)

    const clearData = (keepDefaultValues = false) => {
        if (formContent) {
            const formObj = Object.assign(
                {},
                ...Object.entries(formContent).map(([key, item]) => ({
                    [key]: keepDefaultValues
                        ? item.value
                        : arrayFieldTypes.includes(item.type ?? fieldTypes.text.type)
                            ? []
                            : nullableFieldTypes.includes(item.type ?? fieldTypes.text.type)
                                ? null
                                : booleanFieldTypes.includes(item.type ?? fieldTypes.text.type)
                                    ? false
                                    : "",
                }))
            )
            reset(formObj)
        }
    }

    useEffect(() => {
        if (formResetKeys && formResetKeys.length > 0) {
            if (formContent) {
                const formObj = Object.assign(
                    {},
                    ...Object.entries(formContent).map(([key, item]) => {
                        if (formResetKeys && formResetKeys.includes(key))
                            return { [key]: item.value }
                        return { [key]: getValues(`${key}`) }
                    })
                )
                reset(formObj, { keepErrors: true })
            }
        } else clearData(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formContent, formResetKeys])

    useEffect(() => {
        enableFreeFormAction === true && refSubmitButton?.current?.click()
    }, [enableFreeFormAction])

    const formClose = () => {
        clearErrors()
        clearData()
    }

    const formBody = (key, item) => (
        <Grid
            key={key}
            item
            xs={12}
            md={item.col}
            sx={item.display ?? classes.shown}
            panel={item.panel ?? ""}
        >
            {
                <Switch on={item.type ?? fieldTypes.text.type}>
                    <Typography
                        case={fieldTypes.label.type}
                        variant={item.variant}
                        sx={item.sx}
                    >
                        {item.value}
                    </Typography>
                    <Controller
                        case={fieldTypes.select.type}
                        control={control}
                        rules={item.validator}
                        name={`${key}`}
                        defaultValue={item.value}
                        render={({ field }) => (
                            <>
                                <TextField
                                    {...field}
                                    fullWidth
                                    size={item.size}
                                    variant={item.variant}
                                    label={item.label}
                                    select
                                    SelectProps={item.selectProps}
                                    disabled={(item.disabled && true) || (isReadOnly ?? false)}
                                    onChange={(e, data) => {
                                        field.onChange(e, data)
                                        item.onSelectionChange && item.onSelectionChange(e, data?.props)
                                    }}
                                    error={!!errors[`${key}`]}
                                >
                                    {item.menuItems.map((item) => (
                                        <MenuItem key={`${item.val}_${item.text}`} value={item.val}>
                                            {item.text}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                {errors[`${key}`] && (
                                    <Typography variant="subtitle1" sx={classes.invalid}>
                                        {errors[`${key}`].message}
                                    </Typography>
                                )}
                            </>
                        )}
                    />
                    <Controller
                        case={fieldTypes.multiSelect.type}
                        control={control}
                        rules={item.validator}
                        name={`${key}`}
                        defaultValue={item.value}
                        render={({ field }) => (
                            <>
                                <TextField
                                    {...field}
                                    fullWidth
                                    size={item.size}
                                    variant={item.variant}
                                    label={item.label}
                                    select
                                    SelectProps={{
                                        multiple: true,
                                        renderValue: (selected) => (
                                            <Box
                                                component="div"
                                                sx={{
                                                    display: "flex",
                                                    flexWrap: "wrap",
                                                }}
                                            >
                                                {selected.map((value) => (
                                                    <Chip
                                                        sx={{ margin: 2 }}
                                                        variant="outlined"
                                                        key={value}
                                                        label={
                                                            item.menuItems.find((item) => item.id === value)
                                                                ?.name
                                                        }
                                                    />
                                                ))}
                                            </Box>
                                        ),
                                    }}
                                    disabled={(item.disabled && true) || (isReadOnly ?? false)}
                                    onChange={(e) => {
                                        field.onChange(e)
                                        item.onSelectionChange && item.onSelectionChange(e)
                                    }}
                                    error={!!errors[`${key}`]}
                                >
                                    {item.menuItems.map((mitem) => (
                                        <MenuItem key={mitem.id} value={mitem.id}>
                                            <Checkbox
                                                color="primary"
                                                checked={field.value.indexOf(mitem.id) > -1}
                                            />
                                            <ListItemText primary={mitem.name} />
                                        </MenuItem>
                                    ))}
                                </TextField>
                                {errors[`${key}`] && (
                                    <Typography variant="subtitle1" sx={classes.invalid}>
                                        {errors[`${key}`].message}
                                    </Typography>
                                )}
                            </>
                        )}
                    />
                    <Controller
                        case={fieldTypes.switch.type}
                        name={`${key}`}
                        control={control}
                        rules={item.validator}
                        defaultValue={item.value}
                        render={({ field }) => (
                            <FormControlLabel
                                control={
                                    <MUSwitch
                                        {...field}
                                        color="primary"
                                        onChange={(e) => {
                                            field.onChange(e)
                                            item.onSwitchChange && item.onSwitchChange(e)
                                        }}
                                    // sx={item.display ?? classes.shown}
                                    />
                                }
                                label={item.label}
                                labelPlacement="end"
                            // sx={item.display ?? classes.shown}
                            />
                        )}
                    />

                    <Controller
                        case={fieldTypes.search.type}
                        name={`${key}`}
                        control={control}
                        rules={item.validator}
                        defaultValue={item.value}
                        render={({ field }) => (
                            <>
                                <TextField
                                    {...field}
                                    fullWidth
                                    size={item.size}
                                    variant={item.variant}
                                    label={item.label}
                                    type={item.type ? item.type : "text"}
                                    disabled={
                                        (item.disabled && true) ||
                                        (isReadOnly ?? false)
                                    }
                                    error={!!errors[`${key}`]}
                                    onChange={(e) => {
                                        field.onChange(e)
                                        item.handleSearchChange(e)
                                    }}
                                />
                                {errors[`${key}`] && (
                                    <Typography variant="subtitle1" sx={classes.invalid}>
                                        {errors[`${key}`].message}
                                    </Typography>
                                )}
                            </>
                        )}
                    />
                    <Controller
                        case={fieldTypes.checkbox.type}
                        name={`${key}`}
                        control={control}
                        rules={item.validator}
                        defaultValue={item.value}
                        render={({ field }) => (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        {...field}
                                        checked={field.value}
                                        color="primary"
                                        disabled={(item.disabled && true) || (isReadOnly ?? false)}
                                    // sx={item.display ?? classes.shown}
                                    />
                                }
                                label={item.label}
                                labelPlacement="end"
                            // sx={item.display ?? classes.shown}
                            />
                        )}
                    />
                    <Controller
                        case={fieldTypes.dateRange.type}
                        name={`${key}`}
                        control={control}
                        rules={item.validator}
                        defaultValue={item.value}
                        render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateRangePicker
                                    {...field}
                                    startText="Start Date"
                                    endText="End Date"
                                    fullWidth
                                    size={item.size}
                                    inputVariant={item.variant}
                                    label={item.label}
                                    clearable
                                    format={item.format || "MM/dd/yyyy"}
                                    disabled={(item.disabled && true) || (isReadOnly ?? false)}
                                    minDate={item.minDate}
                                    maxDate={item.maxDate}
                                    onChange={(e) => {
                                        field.onChange(e)
                                        item.onSelectionChange && item.handleDateChange(e)
                                    }}
                                    renderInput={(startProps, endProps) => (
                                        <>
                                            <TextField {...startProps} />
                                            <Box sx={{ mx: 2 }}> to </Box>
                                            <TextField {...endProps} />
                                        </>
                                    )}
                                />
                            </LocalizationProvider>
                        )}
                    />
                    <Controller
                        case={fieldTypes.date.type}
                        name={`${key}`}
                        control={control}
                        rules={item.validator}
                        defaultValue={item.value}
                        render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    {...field}
                                    fullWidth
                                    size={item.size}
                                    inputVariant={item.variant}
                                    label={item.label}
                                    clearable
                                    format={item.format || "MM/dd/yyyy"}
                                    disabled={(item.disabled && true) || (isReadOnly ?? false)}
                                    minDate={item.minDate}
                                    onChange={(e) => {
                                        field.onChange(e)
                                        item.onSelectionChange && item.onDateChange(e)
                                    }}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        )}
                    />
                    <Controller
                        case={fieldTypes.radio.type}
                        name={`${key}`}
                        control={control}
                        rules={item.validator}
                        defaultValue={item.value}
                        render={({ field }) => (
                            <FormControlLabel
                                control={
                                    <Radio
                                        {...field}
                                        checked={field.value === item.selectedValue}
                                        color="primary"
                                        disabled={(item.disabled && true) || (isReadOnly ?? false)}
                                        onChange={(e) => {
                                            field.onChange(e)
                                            item.onCheckedChange &&
                                                item.onCheckedChange(e.target.value)
                                        }}
                                    // sx={item.display ?? classes.shown}
                                    />
                                }
                                label={item.label}
                                labelPlacement="end"
                            // sx={item.display ?? classes.shown}
                            />
                        )}
                    />
                    <Controller
                        case={fieldTypes.radioGroup.type}
                        name={`${key}`}
                        control={control}
                        rules={item.validator}
                        defaultValue={item.value}
                        render={({ field }) => (
                            <FormControl>
                                <FormLabel>{item.label}</FormLabel>
                                <RadioGroup
                                    {...field}
                                    row={item.row ?? false}
                                    onChange={(e) => {
                                        field.onChange(e)
                                        item.onChange && item.onChange(e)
                                    }}
                                >
                                    {item.options.map((o) => (
                                        <FormControlLabel
                                            key={o.val}
                                            value={o.val}
                                            control={<Radio />}
                                            label={o.text}
                                        />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        )}
                    />
                    <Controller
                        case={fieldTypes.autoComplete.type}
                        name={`${key}`}
                        control={control}
                        rules={item.validator}
                        defaultValue={item.value}
                        onChange={([, data]) => data}
                        render={({ field }) => (
                            <>
                                <Autocomplete
                                    {...field}
                                    size={item.size}
                                    options={item.menuItems}
                                    disableCloseOnSelect={item.disableCloseOnSelect ?? true}
                                    disableClearable={item.disableClearable ?? true}
                                    getOptionLabel={(option) => option[item.titleProp]}
                                    isOptionEqualToValue={item.equalityComparer}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            inputProps={{
                                                ...params.inputProps,
                                                autoComplete: "disabled",
                                            }}
                                            variant={item.variant}
                                            label={item.label}
                                            error={!!errors[`${key}`]}
                                        />
                                    )}
                                    disabled={(item.disabled && true) || (isReadOnly ?? false)}
                                    onChange={(e, data) => field.onChange(data)}
                                />
                                {errors[`${key}`] && (
                                    <Typography variant="subtitle1" sx={classes.invalid}>
                                        {errors[`${key}`].message}
                                    </Typography>
                                )}
                            </>
                        )}
                    />
                    <Controller
                        case={fieldTypes.autoCompleteMultiple.type}
                        name={`${key}`}
                        control={control}
                        rules={item.validator}
                        defaultValue={item.value}
                        onChange={([, data]) => data}
                        render={({ field }) => (
                            <>
                                <Autocomplete
                                    {...field}
                                    multiple
                                    limitTags={
                                        isReadOnly || item.disabled ? -1 : item.limitTags ?? 5
                                    }
                                    fullWidth
                                    size={item.size}
                                    options={item.menuItems}
                                    disableCloseOnSelect={item.disableCloseOnSelect ?? true}
                                    disableClearable={item.disableClearable ?? true}
                                    getOptionLabel={(option) => option[item.titleProp]}
                                    isOptionEqualToValue={item.equalityComparer}
                                    renderOption={(props, option, { selected }) => (
                                        <li {...props}>
                                            <Checkbox
                                                icon={<CheckBoxOutlineBlank fontSize="small" />}
                                                checkedIcon={<CheckBox fontSize="small" />}
                                                style={{ marginRight: 8 }}
                                                checked={selected}
                                            />
                                            {option[item.titleProp]}
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            inputProps={{
                                                ...params.inputProps,
                                                autoComplete: "disabled",
                                            }}
                                            variant={item.variant}
                                            label={item.label}
                                            error={!!errors[`${key}`]}
                                        />
                                    )}
                                    disabled={(item.disabled && true) || (isReadOnly ?? false)}
                                    onChange={(e, data) => field.onChange(data)}
                                />
                                {errors[`${key}`] && (
                                    <Typography variant="subtitle1" sx={classes.invalid}>
                                        {errors[`${key}`].message}
                                    </Typography>
                                )}
                            </>
                        )}
                    />
                </Switch>
            }
        </Grid>
    )

    const getTemplatedForm = () => {
        let items = groupBy(
            Object.entries(formContent).map(([key, item]) => ({ key, ...item })),
            "section"
        )
        return Object.entries(items).map(([key, item], index) => {
            const { component: Comp, heading } = formTemplate[key]
            return (
                <Comp key={key} hasDivider={index === 0 && true} heading={heading}>
                    {item.map((inItem) => formBody(inItem.key, inItem))}
                </Comp>
            )
        })
    }

    return (
        <>
            {formTemplate && formContent
                ? getTemplatedForm()
                : formContent && (
                    <Grid container spacing={2}>
                        {Object.entries(formContent).map(([key, item]) => (
                            <Fragment key={key}>
                                {item.isContainer === true ? (
                                    <Grid
                                        container
                                        alignItems={item.alignItems}
                                        flexDirection={item.flexDirection ?? "row"}
                                    >
                                        {formBody(key, item)}
                                    </Grid>
                                ) : (
                                    formBody(key, item)
                                )}
                            </Fragment>
                        ))}
                    </Grid>
                )}
            <Box sx={{ display: freeAction ? "none" : "inline-flex" }}>
                <button
                    onClick={handleSubmit(freeAction)}
                    hidden
                    ref={refSubmitButton}
                />
                {formActions &&
                    formActions.map((item) => (
                        <Box key={item.label} sx={item.cnt_sx}>
                            {item.isSubmit === true ? (
                                <LoadingButton
                                    onClick={handleSubmit(item.action)}
                                    startIcon={item.icon && <item.icon color="default" />}
                                    endIcon={item.endIcon && <item.endIcon color="default" />}
                                    color={item.color ?? "secondary"}
                                    size={item.size ?? "medium"}
                                    sx={item.sx}
                                    variant={item.variant ?? "contained"}
                                    disableElevation
                                    loading={formTaskRunning}
                                    loadingPosition={item.loadingPosition ?? "start"}
                                >
                                    {item.label}
                                </LoadingButton>
                            ) : (
                                <Button
                                    onClick={item.action}
                                    startIcon={item.icon && <item.icon color="default" />}
                                    endIcon={item.endIcon && <item.endIcon color="default" />}
                                    color={item.color ?? "secondary"}
                                    size={item.size ?? "medium"}
                                    sx={item.sx}
                                    variant={item.variant ?? "contained"}
                                    disableElevation
                                >
                                    {item.label}
                                </Button>
                            )}
                        </Box>
                    ))}
            </Box>
        </>
    )
}
export default SearchBox2
