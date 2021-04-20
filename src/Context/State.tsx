import React, { createContext, useContext, useState} from 'react'
import { AlertStateType, StateContextType } from '../interfaces/Interfaces'


const StateContext = createContext<StateContextType>({
    alertState: {
        severity: undefined,
        message: "",
        open: false,
    },
    setAlertState: (): void =>{},
    loading: false,
    setLoading: (): void =>{}
})

export function useStateContext() {
    return useContext(StateContext)
}

export function StateProvider(props: { children: React.ReactNode }) {
    // State for alert snackbars
    const [alertState, setAlertState] = useState<AlertStateType>({
        severity: undefined,
        message: "",
        open: false,
    })

    // Loading Backdrop display state
    const [loading, setLoading] = useState<boolean>(false);

    const value = {
        alertState,
        setAlertState,
        loading,
        setLoading
    }

    return (
        <StateContext.Provider value={value}>
            {props.children}
        </StateContext.Provider>
    )

}
