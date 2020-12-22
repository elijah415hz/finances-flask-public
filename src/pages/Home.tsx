import React, { useState, useEffect } from 'react';
import ReportTable from '../components/Table';
import AddExpensesForm from '../components/AddExpensesForm'
import AddIncomeForm from '../components/AddIncomeForm'
import API from '../utils/API'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { AuthContext } from '../App'
import type {
    tableDataEntry,
    dataListStateType,
    allDataListsType,
    formStateType,
    InputName
} from '../interfaces/Interfaces'
import {
    AppBar,
    Button,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Backdrop,
    CircularProgress,
    Card,
    Dialog
} from '@material-ui/core';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import AddIcon from '@material-ui/icons/Add'
import { emptyDatabase } from '../utils/db';

function Home() {
    const { Auth, setAuth, setAlertState } = React.useContext(AuthContext)
    const [formState, setFormState] = useState<formStateType>(
        {
            form: "expenses",
            year: new Date(Date.now()).getUTCFullYear(),
            month: new Date(Date.now()).getUTCMonth() + 1
        }
    )

    const [incomeTableState, setIncomeTableState] = useState<{ schema: { fields: [] }, data: tableDataEntry[] }>(
        {
            schema: { fields: [] },
            data: [{
                Amount: "",
                Date: "",
                Source: "",
                Person: "",
                id: NaN,
                source_id: NaN,
                earner_id: NaN
            }]
        }
    )

    const [expensesTableState, setExpensesTableState] = useState<{ schema: { fields: [] }, data: tableDataEntry[] }>(
        {
            schema: { fields: [] },
            data: [{
                Amount: "",
                Date: "",
                Source: "",
                Vendor: "",
                Broad_category: "",
                Narrow_category: "",
                Person: "",
                Notes: "",
                entry_id: NaN
            }]
        }

    )
    const [pivotTableState, setPivotTableState] = useState<{ schema: { fields: [] }, data: tableDataEntry[] }>(
        {
            schema: { fields: [] },
            data: [{
                Amount: "",
                Broad_category: "",
                Narrow_category: ""
            }]
        }
    )

    // State for datalists

    const [dataListsState, setDataListsState] = useState<allDataListsType>({
        source: [],
        person_earner: [],
        narrow_category: [],
        broad_category: [],
        vendor: []
    })

    // Loading Backdrop
    const [openBackdrop, setOpenBackdrop] = React.useState(false);


    function formatDates(entry: tableDataEntry): tableDataEntry {
        if (!entry.Date) {
            return entry
        } else {
            let date = new Date(entry.Date);
            let year = date.getUTCFullYear();
            let month = (1 + date.getUTCMonth()).toString();
            month = month.length > 1 ? month : '0' + month;
            let day = date.getUTCDate().toString();
            day = day.length > 1 ? day : '0' + day;
            let dateString = month + '/' + day + '/' + year;
            entry.Date = dateString
            return entry
        }
    }

    function handleFormChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }> | React.ChangeEvent<HTMLSelectElement>): void {
        let name = event.target.name as keyof typeof formState
        setFormState({ ...formState, [name]: event.target.value })
    }

    async function handleFormSubmit(event: React.SyntheticEvent): Promise<any> {
        try {
            event.preventDefault()
            let route = formState.form
            setOpenBackdrop(true)
            let response = await API[route](Auth.token, formState)
            setOpenBackdrop(false)
            // Formatting the dates the hard way because javascript doesn't support strftime...
            if (route !== 'pivot') {
                response.data = response.data.map(formatDates)
            }
            switch (route) {
                case "expenses":
                    setExpensesTableState(response)
                    break;
                case "income":
                    setIncomeTableState(response)
                    break;
                case "pivot":
                    setPivotTableState(response)
                    break;
            }
        } catch (err) {
            if (err.message === "Unauthorized") {
                setAuth({ type: 'LOGOUT' })
            }
            setOpenBackdrop(false)
            setAlertState({
                severity: "error",
                message: "Error Fetching Data",
                open: true
            })
        }
    }

    function assignId(
        name: InputName,
        value: string) {

        let state;
        let id;

        switch (name) {
            case "Person":
                state = dataListsState.person_earner;
                id = 'person_id';
                break;
            case "Source":
                state = dataListsState.source;
                id = 'source_id';
                break;
            case "Broad_category":
                state = dataListsState.broad_category;
                id = 'broad_category_id';
                break;
            case "Narrow_category":
                state = dataListsState.narrow_category;
                id = 'narrow_category_id';
                break;
            case "Vendor":
                state = dataListsState.vendor;
                id = 'vendor_id';
                break;
        }
        let dataListItem = state.filter((i: dataListStateType) => i.name === value)[0]
        if (dataListItem) {
            return { id: id, dataListItem: dataListItem }
        } else {
            return { id: null, dataListItem: null }
        }
    }

    async function handleExpensesChange(event: React.ChangeEvent<HTMLInputElement>, index: number): Promise<void> {
        try {
            let { name, value } = event.target;
            let newExpensesTableStateData: tableDataEntry[] = [...expensesTableState.data]
            let updatedRow: tableDataEntry = { ...newExpensesTableStateData[index], [name]: value }
            if (name === "Person" || name === "Broad_category" || name === "Narrow_category" || name === "Vendor") {
                let { id, dataListItem } = assignId(name as InputName, value)
                if (id && dataListItem) {
                    updatedRow = { ...updatedRow, [id]: dataListItem.id }
                }
            }
            newExpensesTableStateData[index] = updatedRow
            setExpensesTableState({ ...expensesTableState, data: newExpensesTableStateData })

        } catch (err) {
            console.error(err)
            if (err.message === "Unauthorized") {
                setAuth({ type: 'LOGOUT' })
            }
        }
    }

    async function handleIncomeChange(event: React.ChangeEvent<HTMLInputElement>, index: number): Promise<void> {
        try {
            let { name, value } = event.target;
            let newIncomeTableStateData: tableDataEntry[] = [...incomeTableState.data]
            let updatedRow: tableDataEntry = { ...newIncomeTableStateData[index], [name]: value }
            if (name === "Person" || name === "Source") {
                let { id, dataListItem } = assignId(name as InputName, value)
                if (id && dataListItem) {
                    updatedRow = { ...updatedRow, [id]: dataListItem.id }
                }
            }
            newIncomeTableStateData[index] = updatedRow
            setIncomeTableState({ ...incomeTableState, data: newIncomeTableStateData })
        } catch (err) {
            console.error(err)
        }
    }

    async function updateExpensesRow(index: number): Promise<void> {
        try {
            await API.updateExpenses(Auth.token, expensesTableState.data[index])
            setAlertState({
                severity: "success",
                message: "Record updated!",
                open: true
            })
        } catch (err) {
            console.log(err)
            setAlertState({
                severity: "error",
                message: "Error: Failed to save!",
                open: true
            })
        }
    }

    async function updateIncomeRow(index: number): Promise<void> {
        try {
            let res = await API.updateIncome(Auth.token, incomeTableState.data[index])
            console.log(res)
        } catch (err) {
            console.log(err)
        }
    }

    async function deleteEntry(id: number | undefined) {
        try {
            if (formState.form === "expenses") {
                await API.deleteExpenses(Auth.token, id);
                let newExpensesTableStateData = expensesTableState.data.filter(entry => entry.entry_id !== id)
                setExpensesTableState({ ...expensesTableState, data: newExpensesTableStateData })
            } else if (formState.form === "income") {
                await API.deleteIncome(Auth.token, id);
                let newIncomeTableStateData = incomeTableState.data.filter(entry => entry.id !== id)
                setIncomeTableState({ ...incomeTableState, data: newIncomeTableStateData })
            }
        } catch (err) {
            console.error(err)
            if (err === 'Unauthorized') {
                setAuth({ type: 'LOGOUT' })
            }
        }
    }


    // Create classes to use for styling
    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            formControl: {
                margin: theme.spacing(1),
                minWidth: '7em'
            },
            selectEmpty: {
                marginTop: theme.spacing(2),
            },
            root: {
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                [theme.breakpoints.up('md')]: {
                    flexWrap: 'noWrap',
                },
                '& > *': {
                    margin: theme.spacing(1),
                    [theme.breakpoints.down('xs')]: {
                        width: '100%',
                    },
                },
            },
            wallchart: {
                width: '100%'
            },
            logoutBtn: {
                float: 'right',
                margin: '1em',

            },
            offline: {
                backgroundColor: 'red',
                color: 'white',
                textAlign: 'center',
                position: 'sticky'
            },
            backdrop: {
                zIndex: theme.zIndex.drawer + 1,
                color: '#fff',
            },
            speedDial: {
                position: 'fixed',
                bottom: theme.spacing(2),
                right: theme.spacing(2),
            },
            dialog: {
                width: '100%'
            },
            datePicker: {
                width: '50%'
            }
        })
    );
    const classes = useStyles();

    // SpeedDial actions
    const actions = [
        { icon: <AddIcon />, name: 'Expenses', action: handleExpensesOpen, operation: 'product' },
        { icon: <AddIcon />, name: 'Income', action: handleIncomeOpen, operation: 'tag' }
    ]

    const [speedDialOpen, setSpeedDialOpen] = React.useState(false);

    const handleSpeedDialClose = () => {
        setSpeedDialOpen(false);
    };

    const handleOpen = () => {
        setSpeedDialOpen(true);
    };

    function handleExpensesOpen(): void {
        setAddExpensesOpen(true)
        setSpeedDialOpen(false)
    }
    
    function handleIncomeOpen(): void {
        setAddIncomeOpen(true)
        setSpeedDialOpen(false)
    }

    // Controls for Dialogs
    const [addExpensesOpen, setAddExpensesOpen] = useState(false)
    const [addIncomeOpen, setAddIncomeOpen] = useState(false)
    function handleClose() {
        setAddExpensesOpen(false)
        setAddIncomeOpen(false)
    }

    // Control display of Offline banner
    const [offline, setOffline] = useState<boolean>(false)
    window.addEventListener("offline", () => setOffline(true))
    window.addEventListener("online", () => setOffline(false))

    useEffect(() => {
        async function getDataLists(): Promise<void> {
            let datalists = await API.dataList(Auth.token)
            setDataListsState(datalists)
        }
        getDataLists()
        if (!navigator.onLine) {
            setOffline(true)
        }
    }, [])


    return (
        <div className="Home">
            {offline ? (
                <AppBar className={classes.offline} position='sticky'>
                    Offline
                </AppBar>
            ) : null}
            <header className="header">
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.logoutBtn}
                    onClick={async () => {
                        setAuth({ type: 'LOGOUT' })
                        let res = await emptyDatabase()
                        console.log(res)
                    }}
                >Logout
                </Button>
                <Container className={classes.root}>
                    <h1 style={{ textAlign: 'center' }}>{Auth.user} Finances</h1>
                </Container>
                {Auth.token ?
                    <img src="/wallchart" alt="Wall Chart" className={classes.wallchart} />
                    : null
                }
                <Dialog onClose={handleClose} open={addExpensesOpen} maxWidth='xl'>
                    <AddExpensesForm classes={classes} handleClose={handleClose} />
                </Dialog>
                <Dialog onClose={handleClose} open={addIncomeOpen} maxWidth='xl'>
                    <AddIncomeForm classes={classes} handleClose={handleClose} />
                </Dialog>
                <Container className={classes.root}>
                    <Card variant="outlined">
                        <h2 className={classes.root}>Reports</h2>
                        <form onSubmit={handleFormSubmit} className={classes.root}>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel htmlFor="form">Report</InputLabel>
                                <Select
                                    name="form"
                                    label="Report"
                                    labelId="form"
                                    value={formState.form}
                                    onChange={handleFormChange}>
                                    <MenuItem value="income">Income</MenuItem>
                                    <MenuItem value="expenses">Expenses</MenuItem>
                                    <MenuItem value="pivot">Pivot Table</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                onChange={handleFormChange}
                                value={formState.year}
                                label="Year"
                                name="year"
                                type="number"
                                variant="outlined"
                            />
                            <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel htmlFor="month2">Month</InputLabel>
                                <Select
                                    onChange={handleFormChange}
                                    value={formState.month}
                                    name="month"
                                    labelId="month2"
                                    label="Month"
                                >
                                    <MenuItem value={1}>January</MenuItem>
                                    <MenuItem value={2}>February</MenuItem>
                                    <MenuItem value={3}>March</MenuItem>
                                    <MenuItem value={4}>April</MenuItem>
                                    <MenuItem value={5}>May</MenuItem>
                                    <MenuItem value={6}>June</MenuItem>
                                    <MenuItem value={7}>July</MenuItem>
                                    <MenuItem value={8}>August</MenuItem>
                                    <MenuItem value={9}>September</MenuItem>
                                    <MenuItem value={10}>October</MenuItem>
                                    <MenuItem value={11}>November</MenuItem>
                                    <MenuItem value={12}>December</MenuItem>
                                </Select>
                            </FormControl>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                            >
                                View
                        </Button>
                        </form>
                    </Card>
                </Container>
            </header >
            <div className="body">
                {formState.form === "income" && incomeTableState.data[0]?.id ? (
                    <ReportTable
                        state={incomeTableState}
                        dataLists={dataListsState}
                        handleChange={handleIncomeChange}
                        handleUpdate={updateIncomeRow}
                        deleteEntry={deleteEntry}
                        form={formState.form}
                    />
                ) : null}
                {formState.form === "expenses" && expensesTableState.data[0]?.entry_id ? (
                    <ReportTable
                        state={expensesTableState}
                        dataLists={dataListsState}
                        handleChange={handleExpensesChange}
                        handleUpdate={updateExpensesRow}
                        deleteEntry={deleteEntry}
                        form={formState.form}
                    />
                ) : null}
                {formState.form === "pivot" && pivotTableState ? (
                    <ReportTable
                        state={pivotTableState}
                        deleteEntry={() => null}
                        handleUpdate={() => null}
                        handleChange={() => null}
                        form={formState.form}
                    />
                ) : null}
            </div>
            <SpeedDial
                ariaLabel="SpeedDial example"
                className={classes.speedDial}
                // hidden={hidden}
                icon={<SpeedDialIcon />}
                onClose={handleSpeedDialClose}
                onOpen={handleOpen}
                open={speedDialOpen}
                onMouseLeave={() => { }}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        tooltipOpen
                        onClick={action.action}
                    />
                ))}
            </SpeedDial>
            <Backdrop className={classes.backdrop} open={openBackdrop}>
                <CircularProgress disableShrink color="inherit" />
            </Backdrop>
        </div >
    );
}

export default Home;