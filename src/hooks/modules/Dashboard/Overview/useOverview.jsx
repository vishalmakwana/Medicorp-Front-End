import { useState, useContext } from "react"
import { CheckCircle, Autorenew, Error, AccessAlarm, Pending } from "@mui/icons-material"
import { teal, red, amber, blue } from "@mui/material/colors"
import { appSettings, useAxios, moment, Context, Strings } from "@medicorp"

const useOverview = () => {
    const [value, setValue] = useState(new Date())
    const { logMessage } = useContext(Context)
    const { endpointConfig, statusType } = appSettings
    const [{ data: overviewData, loading: overviewLoading }, refetchjobsOverviewByDate] = useAxios(endpointConfig.categories.getAll)


    const items = [
        {
            title: Strings.SCHEDULED_WORKS,
            subtitle: 0,
            icon: AccessAlarm,
            iconBg: teal["A700"]
        },
        {
            title: Strings.COMPLETED,
            subtitle: 0,
            icon: CheckCircle,
            iconBg: '#9155FD'
        },
        {
            title: Strings.FAILED,
            subtitle: 0,
            icon: Error,
            iconBg: red[400]
        },
        {
            title: Strings.OVERDUE,
            subtitle: 0,
            icon: Autorenew,
            iconBg: amber["A700"]
        },
        {
            title: Strings.PENDING,
            subtitle: 0,
            icon: Pending,
            iconBg: blue["A400"]
        }
    ]

    const handleDateChange = (value) => {
        // setValue(value)
        // var selectedDate = value && moment(value.toString()).format('MM-DD-YYYY')
        // var isValidDate = moment(selectedDate, 'MM-DD-YYYY').isValid()
        // isValidDate && refetchjobsOverviewByDate({ url: `${endpointConfig.dashboard.getJobsOverview}?date=${selectedDate}` })
        //     .then(res => {
        //         const { msg, errorMessage, message, title } = res.data
        //         if (res.status !== 200) {
        //             logMessage({
        //                 severity: statusType.error,
        //                 msg: msg ?? errorMessage ?? message ?? title
        //             })
        //         }
        //     }).catch(err => err)
    }

    return {
        items,
        value,
        handleDateChange,
        overviewLoading
    }
}
export default useOverview