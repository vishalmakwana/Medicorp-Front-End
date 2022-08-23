import { Check, Settings, Close } from "@mui/icons-material"
import { green, blue, deepOrange } from "@mui/material/colors"
import { appSettings, useAxios } from "@medicorp"

const useRecentScreens = () => {
    const { endpointConfig } = appSettings
    const [{ data: recentsWprksData }] = useAxios(endpointConfig.categories.getAll)
    const statusEnum = [
        {
            StatusIcon: Check,
            iconBg: green[500]
        },
        {
            StatusIcon: Settings,
            iconBg: blue[500]
        },
        {
            StatusIcon: Close,
            iconBg: deepOrange[500]
        }
    ]

    return {
        statusEnum,
        recentsWprksData
    }
}
export default useRecentScreens