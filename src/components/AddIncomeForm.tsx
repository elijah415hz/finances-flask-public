import React, { useState } from 'react'
import API from '../utils/API'
import { AuthContext } from '../App'
import type { incomeFormType, categoryType } from '../interfaces/Interfaces'
import { 
    Button,
    FormControl, 
    InputLabel, 
    MenuItem, 
    Select, 
    TextField,
    InputAdornment
} from '@material-ui/core';
// import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import { saveRecord } from '../utils/db';


export default function AddRecordsForm(props: {
    classes: { root: string, formControl: string },
    hideForms: Function
}) {
    const { Auth, setAuth } = React.useContext(AuthContext)

    const initialFormState = {
        date: new Date(Date.now()),
        amount: NaN,
        earner_id: NaN,
        source: "",
    }

    // Form control state
    const [formState, setFormState] = useState<incomeFormType>(initialFormState)

    const earners = [
        { name: "Alexa", id: 3 },
        { name: "Eli", id: 1 },
        { name: "Rent", id: 8 },
        { name: "Sales", id: 10 },
        { name: "Gift", id: 11 },
    ]

    function handleFormChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>): void {
        let name = event.target.name as keyof typeof formState
        setFormState({ ...formState, [name]: event.target.value })
    }

    function handleDateChange(date: Date | null) {
        setFormState({ ...formState, date: date });
    };

    async function handleFormSubmit(event: React.SyntheticEvent): Promise<any> {
        event.preventDefault()
        let formStateConvertedDate: any = { ...formState }
        try {
            formStateConvertedDate.date = formStateConvertedDate.date?.toLocaleDateString("en-US")
            let response = await API.postIncome(Auth.token, formStateConvertedDate)
            setFormState(initialFormState)
            console.log(response)
        } catch (err) {
            saveRecord('income', formStateConvertedDate)
            console.error(err)
            if (err.message === "Unauthorized") {
                setAuth({ type: 'LOGOUT' })
            }
        }
    }

    return (
        <div className={props.classes.root}>
            <form className={props.classes.root} onSubmit={handleFormSubmit}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        disableToolbar
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
                    value={formState.source}
                    label="Source"
                    name="source"
                    type="string"
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    onChange={handleFormChange}
                    value={formState.amount}
                    label="Amount"
                    name="amount"
                    type="number"
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    inputProps={{step:"0.01"}}
                />
                <FormControl className={props.classes.formControl}>
                    <InputLabel htmlFor="earner_id">Person</InputLabel>
                    <Select
                        onChange={handleFormChange}
                        value={formState.earner_id}
                        name="earner_id"
                        labelId="earner_id"
                        label="Person"
                    >
                        {earners.map(i => (
                            <MenuItem value={i.id}>{i.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

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
                        props.hideForms()
                    }}
                >Close</Button>
            </form>
        </div>
    )
}