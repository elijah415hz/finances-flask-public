import React, { useState } from 'react'
import API from '../utils/API'
import { saveRecord } from '../utils/db'
import { AuthContext } from '../App'
import type { ExpensesFormType, CategoryType, AllDataListsType } from '../interfaces/Interfaces'
import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    InputAdornment,
    Typography,
    DialogContent
} from '@material-ui/core';
// import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';




export default function AddRecordsForm(props: {
    classes: { root: string, formControl: string},
    handleClose: Function,
    categories: AllDataListsType,
    setOpenBackdrop: Function
}) {
    const { Auth, setAuth, setAlertState } = React.useContext(AuthContext)

    const initialFormState = {
        date: new Date(Date.now()),
        amount: NaN,
        person_id: NaN,
        broad_category_id: NaN,
        narrow_category_id: NaN,
        vendor: "",
        notes: ""
    }

    // Form control state
    const [formState, setFormState] = useState<ExpensesFormType>(initialFormState)

    // State to hold category info
    const [currentCategory, setCurrentCategory] = useState<CategoryType>({
        name: "",
        id: NaN,
    })

    function handleFormChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>): void {
        let name = event.target.name as keyof typeof formState
        setFormState({ ...formState, [name]: event.target.value })
        if (name === 'broad_category_id') {
            // let category = categories.filter(i => i.id === event.target.value)[0]
            // setCurrentCategory(category)
        }
    }

    function handleDateChange(date: Date | null) {
        setFormState({ ...formState, date: date });
    };

    async function handleFormSubmit(event: React.SyntheticEvent): Promise<any> {
        event.preventDefault()
        if (!formState.date || !formState.amount || !formState.broad_category_id || !formState.vendor) {
            setAlertState({
                severity: "error",
                message: "Please fill out all fields",
                open: true
            })
            return
        }
        let formStateConvertedDate: any = { ...formState }
        formStateConvertedDate.date = formStateConvertedDate.date?.toLocaleDateString("en-US")
        try {
            props.setOpenBackdrop(true)
            await API.postExpenses(Auth.token, formStateConvertedDate)
            props.setOpenBackdrop(false)
            setAlertState({
                severity: "success",
                message: "Record Saved!",
                open: true
            })
        } catch (err) {
            props.setOpenBackdrop(false)
            if (err.message === "Error! 500") {
                setAlertState({
                    severity: "error",
                    message: "Server Error! Contact Eli",
                    open: true
                })
                return
            } else {
                saveRecord('expenses', formStateConvertedDate)
                if (err.message === "Unauthorized") {
                    setAuth({ type: 'LOGOUT' })
                }
                setAlertState({
                    severity: "warning",
                    message: "Record Saved Locally",
                    open: true
                })
            }
        } finally {
            setFormState(initialFormState)
            setCurrentCategory({
                name: "",
                id: NaN
            })
        }
    }
 
    return (
            <DialogContent>
            <Typography variant="h5" component="h5" className={props.classes.root}>Log Expense</Typography>
            <form className={props.classes.root} onSubmit={handleFormSubmit}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        disableToolbar
                        fullWidth
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        name="Date"
                        label="Date"
                        value={formState.date}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}                        
                        />
                </MuiPickersUtilsProvider>
                <TextField
                    onChange={handleFormChange}
                    value={formState.vendor}
                    label="Vendor"
                    name="vendor"
                    type="string"
                    InputLabelProps={{ shrink: true }}
                    />
                <TextField
                    onChange={handleFormChange}
                    value={formState.amount}
                    label="amount"
                    name="amount"
                    type="number"
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    inputProps={{ step: "0.01" }}
                    />
                <FormControl
                    className={props.classes.formControl}>
                    <InputLabel htmlFor="broad_category">Broad Category</InputLabel>
                    <Select
                        onChange={handleFormChange}
                        value={formState.broad_category_id}
                        name="broad_category_id"
                        labelId="broad_category"
                        label="Broad Category"
                        >
                        {props.categories.broad_categories.map(i => (
                            <MenuItem value={i.id}>{i.name}</MenuItem>
                            ))}
                    </Select>
                </FormControl>
                {currentCategory.narrowCategories ? (
                    <FormControl className={props.classes.formControl}>
                        <InputLabel htmlFor="narrow_category">Narrow Category</InputLabel>
                        <Select
                            onChange={handleFormChange}
                            value={formState.narrow_category_id}
                            name="narrow_category_id"
                            labelId="narrow_category"
                            label="Narrow Category"
                            >
                            {/* Get the list of narrow categories corresponding to the selected broad category */}
                            {currentCategory.narrowCategories?.map(i => (
                                <MenuItem value={i.id}>{i.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                ) : null}
                {currentCategory.person ? (
                    
                    <FormControl className={props.classes.formControl}>
                        <InputLabel htmlFor="person_id">Person</InputLabel>
                        <Select
                            onChange={handleFormChange}
                            value={formState.person_id}
                            name="person_id"
                            labelId="person_id"
                            label="Person"
                            >
                            {props.categories.persons.map(i => (
                                <MenuItem value={i.id}>{i.name}</MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                ) : null}
                <TextField
                    onChange={handleFormChange}
                    value={formState.notes}
                    label="Notes"
                    name="notes"
                    type="string"
                    InputLabelProps={{ shrink: true }}
                    />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    >Submit</Button>
                <Button
                    type="button"
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                        setFormState(initialFormState)
                        props.handleClose()
                    }
                }
                >Close</Button>
            </form>
                </DialogContent>
    )
}