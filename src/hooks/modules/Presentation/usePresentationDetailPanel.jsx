import { productsDataColumns, usersDataColumn, doctorsDataColumns, appSettings, useAxios, format } from '@medicorp'
import React, { useEffect, useState } from 'react'

const usePresentationDetailPanel = (presentationId) => {
    const [value, setValue] = useState('1')
    const { endpointConfig, fieldTypes, statusType } = appSettings
    const { productsColumn } = productsDataColumns()
    const { columns: doctorsCoumns } = doctorsDataColumns()

    const [producstsData, setProducstsData] = useState([])
    // const [{ data: producstsData, loading: producstsDataLoading }, refetchProducstsData] = useAxios(endpointConfig.products.getAll)
    const [{ data: doctorsData, loading: doctorsDataLoading }, refetchdoctorsData] = useAxios(endpointConfig.doctors.getAll)
    const [{ data: presentationProductData, loading: presentationProductLoading }, presentationProduct,] = useAxios(endpointConfig.presentation.getPresentationProductByPresentationId, { manual: true });


    useEffect(() => {
        presentationProduct({
            url: format(
                endpointConfig.presentation.getPresentationProductByPresentationId,
                presentationId
            ),
        }).then((res) => {
            setProducstsData(res?.data?.data)
        })
    }, [])
    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    return {
        value,
        handleChange,
        productsColumn,
        doctorsCoumns,
        producstsData,
        doctorsData,
        presentationProductLoading

    }
}

export default usePresentationDetailPanel