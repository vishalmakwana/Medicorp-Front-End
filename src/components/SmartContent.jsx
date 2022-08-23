import React, { useRef, Fragment, useEffect, useState } from "react"
import {
    Box, Grid, IconButton, Button, MenuItem, TextField, Chip, Checkbox,
    Radio, RadioGroup, ListItemText, InputAdornment, FormControlLabel, FormControl,
    FormLabel, Switch as MUSwitch, Icon, Autocomplete, Typography,
} from "@mui/material"
import { useForm, Controller } from "react-hook-form"
import { CheckBoxOutlineBlank, CheckBox } from "@mui/icons-material"
import AceEditor from "react-ace"
import "ace-builds/src-noconflict/mode-csharp"
import "ace-builds/src-noconflict/theme-textmate"
import { Switch, useStyles, LoadingButton, appSettings, groupBy, Counter, useTableIcons, MaterialTable } from "@medicorp"

const SmartContent = ({
    formHeader,
    formContent,
    formActions,
    formResetKeys,
    formTaskRunning,
    formTemplate,
    freeAction,
    enableFreeFormAction
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
    const stylingOptions = classes.materialTableStyle
    const { tableIcons } = useTableIcons()
    const { fieldTypes, fieldGroupTypes } = appSettings
    const refSubmitButton = useRef()

    const [showPassword, setShowPassword] = useState(false)
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
    const handleMouseDownPassword = (event) => {
        event.preventDefault()
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
                    <MaterialTable
                        case={fieldTypes.table.type}
                        tableRef={item.ref}
                        title={item.title ?? item.label}
                        icons={tableIcons}
                        columns={item.columns}
                        data={item.data}
                        actions={item.actions}
                        editable={item.editable}
                        detailPanel={item.detailPanel}
                        components={item.components}
                        localization={item.localization}
                        options={{
                            ...stylingOptions,
                            pageSize: 3,
                            pageSizeOptions: [3, 5, 10, 20],
                            search: true,
                            padding: "dense",
                            ...item.tableOptions,
                        }}
                    />
                    <Typography case={fieldTypes.label.type} variant={item.variant} sx={item.sx}>{item.value}</Typography>
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
                                    disabled={
                                        (item.disabled && true) ||
                                        (isReadOnly ?? false)
                                    }
                                    onChange={(e) => {
                                        field.onChange(e)
                                        item.onSelectionChange &&
                                            item.onSelectionChange(e)
                                    }}
                                    error={!!errors[`${key}`]}
                                >
                                    {item.menuItems.map((item) => (
                                        <MenuItem
                                            key={`${item.val}_${item.text}`}
                                            value={item.val}
                                        >
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
                                            <Box component="div"
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
                                                            item.menuItems.find(
                                                                (item) => item.id === value
                                                            )?.name
                                                        }
                                                    />
                                                ))}
                                            </Box>
                                        ),
                                    }}
                                    disabled={
                                        (item.disabled && true) ||
                                        (isReadOnly ?? false)
                                    }
                                    onChange={(e) => {
                                        field.onChange(e)
                                        item.onSelectionChange &&
                                            item.onSelectionChange(e)
                                    }}
                                    error={!!errors[`${key}`]}
                                >
                                    {item.menuItems.map((mitem) => (
                                        <MenuItem key={mitem.id} value={mitem.id}>
                                            <Checkbox
                                                color="primary"
                                                checked={
                                                    field.value.indexOf(mitem.id) > -1
                                                }
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
                        case={fieldTypes.text.type}
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
                                    InputProps={item.inputProps}
                                    type={item.kind ? item.kind : "text"}
                                    disabled={
                                        (item.disabled && true) ||
                                        (isReadOnly ?? false)
                                    }
                                    error={!!errors[`${key}`]}
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
                        case={fieldTypes.password.type}
                        name={`${key}`}
                        control={control}
                        rules={
                            item.match
                                ? {
                                    validate: (value) =>
                                        getValues(`${item.match.field}`) === value,
                                }
                                : item.validator
                        }
                        defaultValue={item.value}
                        render={({ field }) => (
                            <>
                                <TextField
                                    {...field}
                                    fullWidth
                                    size={item.size}
                                    variant={item.variant}
                                    label={item.label}
                                    type={item.showPassword || showPassword ? "text" : "password"}
                                    disabled={
                                        (item.disabled && true) ||
                                        (isReadOnly ?? false)
                                    }
                                    error={!!errors[`${key}`]}
                                    onChange={(e) => {
                                        field.onChange(e)
                                        item.onTextChange && item.onTextChange(e)
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    sx={classes.no_pading}
                                                    onMouseDown={handleMouseDownPassword}
                                                    onClick={() =>
                                                        setShowPassword(!showPassword)
                                                    }
                                                >
                                                    <Icon fontSize="small">{`visibility${showPassword && "_off"}`}</Icon>
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                ></TextField>
                                {errors[`${key}`] && (
                                    <Typography variant="subtitle1" sx={classes.invalid}>
                                        {errors[`${key}`].type === "validate"
                                            ? `${item.match.errorMsg}`
                                            : errors[`${key}`].message}
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
                                            item.onSwitchChange &&
                                                item.onSwitchChange(e)
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
                                        disabled={
                                            (item.disabled && true) ||
                                            (isReadOnly ?? false)
                                        }
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
                                        disabled={
                                            (item.disabled && true) ||
                                            (isReadOnly ?? false)
                                        }
                                        onChange={(e) => {
                                            field.onChange(e)
                                            item.onCheckedChange && item.onCheckedChange(e.target.value)
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
                                    {
                                        item.options.map(o => (
                                            <FormControlLabel key={o.val} value={o.val} control={<Radio />} label={o.text} />
                                        ))
                                    }
                                </RadioGroup>
                            </FormControl>
                        )}
                    />
                    <Controller
                        case={fieldTypes.textArea.type}
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
                                    multiline
                                    minRows={item.minRows ? item.minRows : 4}
                                    disabled={
                                        (item.disabled && true) ||
                                        (isReadOnly ?? false)
                                    }
                                    error={!!errors[`${key}`]}
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
                                                autoComplete: "disabled"
                                            }}

                                            variant={item.variant}
                                            label={item.label}
                                            error={!!errors[`${key}`]} />
                                    )}
                                    disabled={
                                        (item.disabled && true) ||
                                        (isReadOnly ?? false)
                                    }
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
                                    limitTags={isReadOnly || item.disabled ? -1 : (item.limitTags ?? 5)}
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
                                                autoComplete: "disabled"
                                            }}

                                            variant={item.variant}
                                            label={item.label}
                                            error={!!errors[`${key}`]} />
                                    )}
                                    disabled={
                                        (item.disabled && true) ||
                                        (isReadOnly ?? false)
                                    }
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
                        case={fieldTypes.counter.type}
                        control={control}
                        rules={item.validator}
                        name={`${key}`}
                        defaultValue={item.value}
                        render={({ field }) => (
                            <>
                                <Counter
                                    {...field}
                                    sx={item.sx}
                                    size={item.size}
                                    fullWidth
                                    disabled={
                                        (item.disabled && true) ||
                                        (isReadOnly ?? false)
                                    } />
                                {errors[`${key}`] && (
                                    <Typography variant="subtitle1" sx={classes.invalid}>
                                        {errors[`${key}`].message}
                                    </Typography>
                                )}
                            </>
                        )}
                    />
                    <Controller
                        case={fieldTypes.aceEditor.type}
                        name={`${key}`}
                        control={control}
                        defaultValue={item.value}
                        value={item.value}
                        render={({ field }) => (
                            <>
                                <AceEditor
                                    {...field}
                                    mode="csharp"
                                    theme="textmate"
                                    onChange={(e) => {
                                        field.onChange(e)
                                    }}
                                    editorProps={{ $blockScrolling: true }}
                                />
                            </>
                        )}
                    />
                </Switch>
            }
        </Grid>
    )

    const getTemplatedForm = () => {
        let items = groupBy(Object.entries(formContent).map(([key, item]) => ({ key, ...item })), 'section')
        return Object.entries(items).map(([key, item], index) => {
            const { component: Comp, heading } = formTemplate[key]
            return (
                <Comp key={key} hasDivider={index === 0 && true} heading={heading}>
                    {
                        item.map(inItem => formBody(inItem.key, inItem))
                    }
                </Comp>
            )
        })
    }

    return (
        <>
            {
                (formTemplate && formContent) ? getTemplatedForm() :
                    formContent &&
                    <Grid container spacing={2}>
                        {
                            Object.entries(formContent).map(([key, item]) => (
                                <Fragment key={key}>
                                    {
                                        item.isContainer === true ?
                                            <Grid container alignItems={item.alignItems} flexDirection={item.flexDirection ?? 'row'}>
                                                {formBody(key, item)}
                                            </Grid> :
                                            formBody(key, item)
                                    }
                                </Fragment>
                            ))
                        }
                    </Grid>
            }
            <Box sx={{ display: freeAction ? 'none' : 'inline-flex', width: "100%" }}>
                <button
                    onClick={handleSubmit(freeAction)}
                    hidden
                    ref={refSubmitButton} />
                {
                    formActions &&
                    formActions.map((item) => (
                        <Box key={item.label} sx={item.cnt_sx}>
                            {item.isSubmit === true ? (
                                <LoadingButton
                                    onClick={handleSubmit(item.action)}
                                    startIcon={item.icon && <item.icon color="default" />}
                                    endIcon={item.endIcon && <item.endIcon color="default" />}
                                    color={item.color ?? "secondary"}
                                    size={item.size ?? 'medium'}
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
                                    size={item.size ?? 'medium'}
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

export default SmartContent