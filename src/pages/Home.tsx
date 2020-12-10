import React, { useState, useEffect } from 'react';
import Table from '../components/Table';
import API from '../utils/API'
import { AuthContext } from '../App'
import type { tableDataEntry, dataListStateType, allDataListsType, formStateType, InputName } from '../interfaces/Interfaces'

function Home() {
    const { Auth, setAuth } = React.useContext(AuthContext)
    const [formState, setFormState] = useState<formStateType>(
        {
            form: "expenses",
            year: new Date(Date.now()).getUTCFullYear(),
            month: new Date(Date.now()).getUTCMonth()
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

    function handleFormChange(event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>): void {
        let { name, value } = event.target;
        setFormState({ ...formState, [name]: value })
    }

    async function handleFormSubmit(event: React.SyntheticEvent): Promise<any> {
        try {
            event.preventDefault()
            let route = formState.form
            let response = await API[route](Auth.token, formState)
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
    async function updateExpensesRow(index: number): Promise<void> {
        try {
            let res = await API.updateExpenses(Auth.token, expensesTableState.data[index])
            console.log(res)
        } catch (err) {
            console.log(err)
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
            if (err.message === 'Unauthorized') {
                setAuth({ type: 'LOGOUT' })
            }
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

    useEffect(() => {
        async function getDataLists(): Promise<void> {
            let datalists = await API.dataList(Auth.token)  
            setDataListsState(datalists)
        }
        getDataLists()
    }, [])

    return (
        <div className="Home">
            <header className="header">
                <button className="logout" onClick={() => setAuth({ type: 'LOGOUT' })}>Logout</button>
                <h1>Finances!</h1>
                {Auth.token ?
                    <img src="/wallchart" alt="Wall Chart" />
                    : null
                }

                <form onSubmit={handleFormSubmit} className="form-inline">
                    <select name="form" value={formState.form} onChange={handleFormChange}>
                        <option value="income">Income</option>
                        <option value="expenses">Expenses</option>
                        <option value="pivot">Pivot Table</option>
                    </select>
                    <label htmlFor="year2">Year</label>
                    <input
                        onChange={handleFormChange}
                        value={formState.year}
                        type="number"
                        id="year2"
                        className="form-control"
                        name="year"
                        placeholder="YYYY"
                    />
                    <label htmlFor="month2">Month</label>
                    <select
                        onChange={handleFormChange}
                        value={formState.month}
                        id="month2"
                        className="form-control"
                        name="month"
                        placeholder="MM">
                            <option value={1}>January</option>
                            <option value={2}>February</option>
                            <option value={3}>March</option>
                            <option value={4}>April</option>
                            <option value={5}>May</option>
                            <option value={6}>June</option>
                            <option value={7}>July</option>
                            <option value={8}>August</option>
                            <option value={9}>September</option>
                            <option value={10}>October</option>
                            <option value={11}>November</option>
                            <option value={12}>December</option>
                            </select>
                    <button className="btn btn-success">Submit</button>
                </form>
            </header>
            <div className="body">
                {formState.form === "income" && incomeTableState.data[0]?.id ? (
                    <Table
                        state={incomeTableState}
                        dataLists={dataListsState}
                        handleChange={handleIncomeChange}
                        handleUpdate={updateIncomeRow}
                        deleteEntry={deleteEntry}
                        form={formState.form}
                    />
                ) : null}
                {formState.form === "expenses" && expensesTableState.data[0]?.entry_id ? (
                    <Table
                        state={expensesTableState}
                        dataLists={dataListsState}
                        handleChange={handleExpensesChange}
                        handleUpdate={updateExpensesRow}
                        deleteEntry={deleteEntry}
                        form={formState.form}
                    />
                ) : null}
                {formState.form === "pivot" && pivotTableState ? (
                    <Table
                        state={pivotTableState}
                        deleteEntry={() => null}
                        handleUpdate={() => null}
                        handleChange={() => null}
                        form={formState.form}
                    />
                ) : null}
            </div>
        </div>
    );
}

export default Home;