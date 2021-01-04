import React, { useState } from 'react'
import {
    DialogContent,
    Typography,
    Button,
    TextField,
    FormControl,
    FormControlLabel,
    InputLabel,
    Select,
    MenuItem,
    Checkbox
} from '@material-ui/core'
import { AllDataListsType, EditFormType } from '../interfaces/Interfaces'
import API from '../utils/API'
import { AuthContext } from '../App'


export default function Edit(props: {
    handleClose: Function,
    classes: { root: string, formControl: string },
    categories: AllDataListsType,
    setOpenBackdrop: Function
}) {
    const { Auth, setAuth, setAlertState } = React.useContext(AuthContext)

    const initialFormState = {
        person: "",
        broad_category: "",
        broad_category_id: NaN,
        narrow_category: "",
        has_person: false
    }

    // Form control state
    const [formState, setFormState] = useState<EditFormType>(initialFormState)


    function handleFormChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>): void {
        let name = event.target.name as keyof EditFormType
        let value = event.target.value
        if (name === 'has_person') {
            // Casting event.target so that ts knows check property will be there
            value = (event.target as HTMLInputElement).checked
        }
        setFormState({ ...formState, [name]: value })
    }

    async function handleFormSubmit(event: React.SyntheticEvent, form: 'person' | 'narrow_category' | 'broad_category'): Promise<any> {
        event.preventDefault()
        try {
            props.setOpenBackdrop(true)
            let data
            switch (form) {
                case 'person':
                    data = { person: formState.person }
                    break;
                case 'broad_category':
                    data = {
                        broad_category: formState.broad_category,
                        has_person: formState.has_person
                    }
                    break;
                case 'narrow_category':
                    data = {
                        narrow_category: formState.narrow_category,
                        broad_category_id: formState.broad_category_id,
                        has_person: formState.has_person
                    }
                    break;
            }
            await API.addCategories(Auth.token, data)
            setAlertState({
                severity: "success",
                message: "Category Added!",
                open: true
            })
        } catch (err) {
            if (err.message === "Unauthorized") {
                setAuth({ type: 'LOGOUT' })
            } else {
                if (err.message === "Error! 500") {
                    setAlertState({
                        severity: "error",
                        message: "Server Error!",
                        open: true
                    })
                    return
                }
            }
        } finally {
            props.setOpenBackdrop(false)
        }
    }

    return (
        <DialogContent>
            <Typography variant="h5" component="h5" className={props.classes.root}>Add a Person</Typography>
            <form className={props.classes.root} onSubmit={(e: React.SyntheticEvent) => handleFormSubmit(e, 'person')}>
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
            <Typography variant="h5" component="h5" className={props.classes.root}>Add a Broad Category</Typography>
            <form className={props.classes.root} onSubmit={(e: React.SyntheticEvent) => handleFormSubmit(e, 'broad_category')}>
                <TextField
                    onChange={handleFormChange}
                    value={formState.broad_category}
                    label="Broad Category"
                    name="broad_category"
                    type="string"
                />
                <FormControlLabel control={<Checkbox
                    checked={formState.has_person}
                    onChange={handleFormChange}
                    name="has_person"
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                />}
                    label="Person"
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                >Submit</Button>
            </form>
            <Typography variant="h5" component="h5" className={props.classes.root}>Add a Narrow Category</Typography>
            <form className={props.classes.root} onSubmit={(e: React.SyntheticEvent) => handleFormSubmit(e, 'narrow_category')}>
                <FormControl
                    className={props.classes.formControl}>
                    <InputLabel htmlFor="broad_category">Broad Category</InputLabel>
                    <Select
                        onChange={handleFormChange}
                        value={formState.broad_category}
                        name="broad_category_id"
                        labelId="broad_category_id"
                        label="Broad Category"
                    >
                        {props.categories.broad_categories.map(i => (
                            <MenuItem value={i.id}>{i.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    onChange={handleFormChange}
                    value={formState.narrow_category}
                    label="Narrow Category"
                    name="narrow_category"
                    type="string"
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                >Submit</Button>
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