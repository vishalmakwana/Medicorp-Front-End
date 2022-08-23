import React, { useEffect, useState } from 'react'
import propTypes from "prop-types"
import { Strings, AdapterMoment } from "@medicorp"
import { TextField, MenuItem, InputAdornment, IconButton, Box } from '@mui/material'
import { CalendarToday } from '@mui/icons-material'
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { DatePicker, DateRangePicker, LocalizationProvider } from "@mui/lab"
// function CardMaskInput(props) {
//     const { inputRef, ...other } = props;

//     return (
//         <MaskedInput
//             {...other}
//             ref={(ref) => {
//                 inputRef(ref ? ref.inputElement : null);
//             }}
//             mask={[/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
//             keepCharPositions
//             guide
//             placeholderChar='X'
//             placeholder="XXXX-XXXX-XXXX-XXXX"
//         />
//     );
// }

// CardMaskInput.propTypes = {
//     inputRef: propTypes.func.isRequired,
// };

function SearchBox(props) {
    const { name, defaultValue, fullWidth, variant, label, type, isSelect, menuItems, isMaskedInput, onChange, size, isDisable, minDate, maxDate } = props
    const [value, setValue] = useState(defaultValue ?? '')
    const [selectedOption, setselectedOption] = useState(defaultValue)
    const [selectedDate, setSelectedDate] = useState(defaultValue)
    useEffect(() => {
        if (menuItems && menuItems.length <= 1)
            setselectedOption(defaultValue)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [menuItems])
    useEffect(() => {
        if (isSelect)
            setselectedOption(defaultValue)
        else if (['date', 'datetime'].includes(type.toLowerCase()))
            setSelectedDate(defaultValue)
        else
            setValue(defaultValue)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultValue])
    const handleDateChange = (date) => {
        setSelectedDate(date)
        onChange(name, date)
    }
    const handleSelectionChange = (event) => {
        const { value } = event.target
        setselectedOption(value)
        onChange(name, value, selectedOption)
    }
    const handleChange = (event) => {
        const { value } = event.target
        setValue(value)
        const actualValue = value.replaceAll('-', '').replaceAll('X', '')

        onChange(name, actualValue)
    }
    return (
        <>
            {
                isSelect ?
                    <TextField
                        name={name}
                        fullWidth={fullWidth}
                        size={size}
                        variant={variant}
                        label={label}
                        type={type}
                        select={isSelect}
                        SelectProps={{ defaultValue: defaultValue }}
                        value={selectedOption}
                        disabled={isDisable}
                        onChange={handleSelectionChange}>
                        {menuItems.map(item => <MenuItem key={`${item.val}_${item.text}`} value={item.val}>{item.text}</MenuItem>)}
                    </TextField> :
                    type === 'date' ?
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                name={name}
                                fullWidth={fullWidth}
                                size={size}
                                inputVariant={variant}
                                label={label}
                                clearable
                                format="MM/dd/yyyy"
                                value={selectedDate}
                                disabled={isDisable}
                                minDate={minDate}
                                onChange={handleDateChange}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider> :
                        type === 'dateRange' ?
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateRangePicker
                                    startText="Start Date"
                                    endText="End Date"
                                    name={name}
                                    fullWidth={fullWidth}
                                    size={size}
                                    inputVariant={variant}
                                    label={label}
                                    clearable
                                    format="MM/dd/yyyy"
                                    value={selectedDate}
                                    disabled={isDisable}
                                    minDate={minDate}
                                    maxDate={maxDate}
                                    onChange={handleDateChange}
                                    renderInput={(startProps, endProps) => (
                                        <>
                                            <TextField {...startProps} />
                                            <Box sx={{ mx: 2 }}> to </Box>
                                            <TextField {...endProps} />
                                        </>
                                    )}
                                />

                            </LocalizationProvider> :
                            isMaskedInput ?
                                <TextField
                                    name={name}
                                    fullWidth={fullWidth}
                                    size={size}
                                    variant={variant}
                                    label={label}
                                    type={type}
                                    value={value}
                                    onChange={handleChange}
                                    disabled={isDisable}
                                // InputProps={{
                                //     inputComponent: CardMaskInput,
                                // }}
                                /> :
                                <TextField
                                    name={name}
                                    fullWidth={fullWidth}
                                    size={size}
                                    variant={variant}
                                    label={label}
                                    type={type}
                                    value={value}
                                    disabled={isDisable}
                                    onChange={handleChange} />
            }
        </>
    )
}
SearchBox.defaultProps = {
    name: "",
    defaultValue: '',
    size: 'small',
    fullWidth: true,
    variant: "outlined",
    label: Strings.SEARCH,
    menuItems: [],
    type: "",
    isSelect: false,
    isDisable: false,
    isMaskedInput: false,
    minDate: null,
    onChange: function () { }
}
SearchBox.propTypes = {
    name: propTypes.string,
    defaultValue: propTypes.any,
    fullWidth: propTypes.bool,
    variant: propTypes.oneOf(["standard", "outlined", "filled"]),
    label: propTypes.string,
    menuItems: propTypes.array,
    type: propTypes.oneOf(['search', 'number', 'select', 'date', 'datetime', '']),
    isSelect: propTypes.bool,
    isDisable: propTypes.bool,
    isMaskedInput: propTypes.bool,
    minDate: propTypes.any,
    onChange: propTypes.func
}

export { SearchBox }