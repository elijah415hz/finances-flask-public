import React, { useState } from 'react'
import API from '../utils/API'
import { AuthContext } from '../App'
import type { RecordForm, dataListStateType, allDataListsType, formStateType, InputName } from '../interfaces/Interfaces'
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
// import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';



export default function AddRecordsForm(props: {
    classes: { root: string, formControl: string }
}) {
    const { Auth, setAuth } = React.useContext(AuthContext)

    const [formState, setFormState] = useState<RecordForm>({
        Date: new Date(Date.now()),
        Amount: NaN,
        person_id: NaN,
        broad_category_id: NaN,
        narrow_category_id: NaN,
        vendor: "",
        notes: ""
    })

    const [showForm, setShowForm] = useState<boolean>(false)

    function handleFormChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>): void {
        let name = event.target.name as keyof typeof formState
        setFormState({ ...formState, [name]: event.target.value })
    }

    function handleDateChange(date: Date | null) {
        setFormState({ ...formState, Date: date });
    };

    async function handleFormSubmit(event: React.SyntheticEvent): Promise<any> {
        event.preventDefault()
        try {
            let formStateConvertedDate: any = {...formState}
            formStateConvertedDate.Date = formStateConvertedDate.Date?.toLocaleDateString("en-US")
            let response = await API.postExpenses(Auth.token, formStateConvertedDate)
            console.log(response)
        } catch(err) {
            console.error(err)
            if (err.message === "Unauthorized") {
                setAuth({ type: 'LOGOUT' })
            }
        }
    }

    return (
        <div className={props.classes.root}>

            {!showForm ? (
            <Button
                type="submit"
                variant="contained"
                color="primary"
                className={props.classes.root}
                onClick={() => setShowForm(true)}>
                Log an Expense
            </Button>
        ) : (
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
                        value={formState.Date}
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
                />
                <TextField
                    onChange={handleFormChange}
                    value={formState.Amount}
                    label="Amount"
                    name="Amount"
                    type="number"
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
                        <MenuItem value={1}>Seattle Home</MenuItem>
                        <MenuItem value={2}>Cats</MenuItem>
                        <MenuItem value={3}>Cars</MenuItem>
                    </Select>
                </FormControl>
                {formState.broad_category_id ? (
                    <FormControl className={props.classes.formControl}>
                        <InputLabel htmlFor="narrow_category">Narrow Category</InputLabel>
                        <Select
                            onChange={handleFormChange}
                            value={formState.narrow_category_id}
                            name="narrow_category_id"
                            labelId="narrow_category"
                            label="Narrow Category"
                        >
                            <MenuItem value={1}>Seattle Home</MenuItem>
                            <MenuItem value={2}>Cats</MenuItem>
                            <MenuItem value={3}>Cars</MenuItem>
                        </Select>
                    </FormControl>
                ) : null}
                {formState.narrow_category_id ? (

                    <FormControl className={props.classes.formControl}>
                        <InputLabel htmlFor="person_id">Person</InputLabel>
                        <Select
                            onChange={handleFormChange}
                            value={formState.person_id}
                            name="person_id"
                            labelId="person_id"
                            label="Person"
                        >
                            <MenuItem value={1}>Theo</MenuItem>
                            <MenuItem value={2}>Alexa</MenuItem>
                            <MenuItem value={3}>Eli</MenuItem>
                        </Select>
                    </FormControl>
                ) : null}
                <TextField
                    onChange={handleFormChange}
                    value={formState.notes}
                    label="Notes"
                    name="notes"
                    type="string"
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                >Submit</Button>
            </form>
            )}
        </div>
    )
}