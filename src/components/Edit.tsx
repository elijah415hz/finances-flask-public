import React, { useState } from 'react'
import {
    DialogContent,
    Typography,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select
} from '@material-ui/core'
import { EditFormType } from '../interfaces/Interfaces'
import API from '../utils/API'
import { AuthContext } from '../App'


export default function Edit(props: {
    handleClose: Function,
    classes: { root: string, formControl: string },
    setOpenBackdrop: Function
}) {
    const { Auth, setAuth, setAlertState } = React.useContext(AuthContext)

    const initialFormState = {
        person: "",
        broad_category: "",
        narrow_category: ""
    }

    // Form control state
    const [formState, setFormState] = useState<EditFormType>(initialFormState)


    function handleFormChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>): void {
        let name = event.target.name as keyof typeof formState
        setFormState({ ...formState, [name]: event.target.value })
    }

    async function handlePersonFormSubmit(event: React.SyntheticEvent): Promise<any> {
        event.preventDefault()
        try {
            let data = {person: formState.person}
            let response = await API.addCategories(Auth.token, data)
            console.log(response)
        } catch (err) {
            if (err.message === "Unauthorized") {
                setAuth({ type: 'LOGOUT' })
            }
        }
    }

    return (
        <DialogContent>
            <Typography variant="h5" component="h5" className={props.classes.root}>Add an Earner</Typography>
            <form className={props.classes.root} onSubmit={handlePersonFormSubmit}>
                <TextField
                    onChange={handleFormChange}
                    value={formState.person}
                    label="Person"
                    name="person"
                    type="string"
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                >Submit</Button>
            </form>
            <form className={props.classes.root}>
                <FormControl
                    className={props.classes.formControl}>
                    <InputLabel htmlFor="broad_category">Broad Category</InputLabel>
                    <Select
                        onChange={handleFormChange}
                        value={formState.broad_category}
                        name="broad_category"
                        labelId="broad_category"
                        label="Broad Category"
                    >
                        {/* {categories.map(i => (
                            <MenuItem value={i.id}>{i.name}</MenuItem>
                            ))} */}
                    </Select>
                </FormControl>
            </form>
            <div className={props.classes.root}>
                <Button
                    type="button"
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                        // setFormState(initialFormState)
                        props.handleClose()
                    }
                    }
                >Close</Button>
            </div>
        </DialogContent>
    )
}