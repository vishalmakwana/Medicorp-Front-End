import React, { forwardRef } from "react"
import { DeleteOutline, EditOutlined, Visibility, AddCircle, Save, ZoomIn, ZoomOut, Close, Done, VisibilityOff, CopyAll, RestartAlt, Search, PlayArrow, Download, ChevronRight, ChevronLeft, Login, UploadFile, FileDownload } from '@mui/icons-material'
function useTableIcons() {
    const tableIcons = {
        View: forwardRef((props, ref) => <Visibility {...props} ref={ref} color={props.color ?? "secondary"} fontSize="small" />),
        Hide: forwardRef((props, ref) => <VisibilityOff {...props} ref={ref} color={props.color ?? "secondary"} fontSize="small" />),
        Edit: forwardRef((props, ref) => <EditOutlined {...props} ref={ref} color={props.color ?? "secondary"} fontSize="small" />),
        Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} color={props.color ?? "secondary"} fontSize="small" />),
        Add: forwardRef((props, ref) => <AddCircle {...props} ref={ref} color={props.color ?? "secondary"} fontSize="large" sx={{ m: -0.75 }} />),
        Save: forwardRef((props, ref) => <Save {...props} ref={ref} />),
        ZoomIn: forwardRef((props, ref) => <ZoomIn {...props} ref={ref} />),
        ZoomOut: forwardRef((props, ref) => <ZoomOut {...props} ref={ref} />),
        DoneAction: forwardRef((props, ref) => <Done {...props} ref={ref} />),
        CancelAction: forwardRef((props, ref) => <Close {...props} ref={ref} />),
        Clone: forwardRef((props, ref) => <CopyAll {...props} ref={ref} color={props.color ?? "secondary"} fontSize="small" />),
        Reset: forwardRef((props, ref) => <RestartAlt {...props} ref={ref} />),
        Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
        PlayArrow: forwardRef((props, ref) => <PlayArrow {...props} ref={ref} />),
        Download: forwardRef((props, ref) => <Download {...props} ref={ref} />),
        ChevronRight: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
        ChevronLeft: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
        Login: forwardRef((props, ref) => <Login {...props} ref={ref} />),
        Upload: forwardRef((props, ref) => <UploadFile {...props} ref={ref} />),
        FileDownload: forwardRef((props, ref) => <FileDownload {...props} ref={ref} />),
    }
    return { tableIcons }
}

export default useTableIcons