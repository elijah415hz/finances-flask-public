import React, { useState, useEffect } from 'react';
import './App.css';
import Table from './components/Table';
import API from './utils/API'

function App() {
  interface formStateType {
    form: "expenses" | "income" | "pivot",
    year: string,
    month: string
  }

  interface expensesDataEntry {
    Amount: string,
    Date: string,
    Source: string,
    Vendor: string,
    Broad_category: string,
    Narrow_category: string,
    Person: string,
    Notes: string,
    entry_id: number
  }

  interface incomeDataEntry {
    Amount: string,
    Date: string,
    Source: string,
    Person: string,
    id: number,
    source_id: number,
    earner_id: number
  }

  interface pivotDataEntry {
    Broad_category: string,
    Narrow_category: string,
    Amount: string
  }

  interface tableDataEntry {
    Amount: string,
    Date: string,
    Source: string,
    Person: string,
    id?: number,
    source_id?: number,
    earner_id?: number,
    Vendor?: string,
    Broad_category?: string,
    Narrow_category?: string,
    Notes?: string,
    entry_id?: number
  }

  interface dataListStateType {
    id: number,
    name: string
  }

  type InputName = "Person" | "Source" | "Broad_category" | "Narrow_category"

  const [formState, setFormState] = useState<formStateType>(
    {
      form: "income",
      year: "",
      month: ""
    }
  )

  const [incomeTableState, setIncomeTableState] = useState<{ schema: { fields: [] }, data: incomeDataEntry[] }>(
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

  const [expensesTableState, setExpensesTableState] = useState<{ schema: { fields: [] }, data: expensesDataEntry[] }>(
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
  const [pivotTableState, setPivotTableState] = useState<pivotDataEntry[]>()

  // State for datalists
  const [sourcesState, setSourcesState] = useState<dataListStateType[]>([])
  const [personsState, setPersonsState] = useState<dataListStateType[]>([])
  const [broadState, setBroadState] = useState<dataListStateType[]>([])
  const [narrowState, setNarrowState] = useState<dataListStateType[]>([])

  function formatDates(entry:
    {
      Date: string
    }): {
      Date: string
    } {
    let date = new Date(entry.Date);
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    let dateString = month + '/' + day + '/' + year;
    entry.Date = dateString
    return entry
  }

  function handleFormChange(event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>): void {
    let { name, value } = event.target;
    setFormState({ ...formState, [name]: value })
  }

  async function handleFormSubmit(event: React.SyntheticEvent): Promise<any> {
    try {
      event.preventDefault()
      let route = formState.form
      let response = await (await API[route](formState)).json()
      // Formatting the dates the hard way because javascript doesn't support strftime...
      response.data = response.data.map(formatDates)
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
      console.error(err)
    }
  }

  function assignId(
    name: InputName,
    value: string) {

    let state;
    let id;

    switch (name) {
      case "Person":
        state = personsState;
        id = 'earner_id'
        break;
      case "Source":
        state = sourcesState;
        id = 'source_id'
        break;
      case "Broad_category":
        state = broadState;
        id = 'broad_category_id'
        break;
      case "Narrow_category":
        state = narrowState;
        id = 'narrow_category_id'
        break;
    }
    let dataListItem = state.filter((i: dataListStateType) => i.name === value)[0]
    if (dataListItem) {
      return { id: id, dataListItem: dataListItem }
    } else {
      return { id: null, dataListItem: null }
    }
  }

  function handleExpensesChange(event: React.ChangeEvent<HTMLInputElement>, entry_id: number): void {
    let { name, value } = event.target;
    let newExpensesTableStateData: expensesDataEntry[] = expensesTableState.data.map(((entry: expensesDataEntry) => {
      if (entry.entry_id === entry_id) {
        entry = { ...entry, [name]: value, ...{} }
        if (name === "Person" || name === "Broad_category" || name === "Narrow_category") {
          let { id, dataListItem } = assignId(name as InputName, value)
          if (id && dataListItem) {
            entry = { ...entry, [id]: dataListItem.id }
          }
        }
      }
      return entry;
    }))
    setExpensesTableState({ ...expensesTableState, data: newExpensesTableStateData })
  }

  function handleIncomeChange(event: React.ChangeEvent<HTMLInputElement>, id: number): void {
    let { name, value } = event.target;
    let newIncomeTableStateData: incomeDataEntry[] = incomeTableState.data.map(((entry: incomeDataEntry) => {
      if (entry.id === id) {
        entry = { ...entry, [name]: value, ...{} }
        if (name === "Person" || name === "Source") {
          let { id, dataListItem } = assignId(name as InputName, value)
          if (id && dataListItem) {
            entry = { ...entry, [id]: dataListItem.id }
          }
        }
      }
      return entry;
    }))
    setIncomeTableState({ ...incomeTableState, data: newIncomeTableStateData })
  }


  useEffect(() => {
    async function getDataLists(): Promise<void> {
      if (sourcesState.length === 0) {
        let { data } = await API.sources()
        setSourcesState(data)
      }
      if (personsState.length === 0) {
        let res = await API.persons()
        setPersonsState(res.data)
      }
      if (narrowState.length === 0) {
        let res = await API.narrow()
        setNarrowState(res.data)
      }
      if (broadState.length === 0) {
        let res = await API.broad()
        setBroadState(res.data)
      }
    }
    getDataLists()
  }, [])

  return (
    <div className="App">
      <div className="header">
        <h1>Finances!</h1>
        <img src="/api/wallchart" alt="Wall Chart" />
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
            type="text"
            id="year2"
            className="form-control"
            name="year"
            placeholder="YYYY"
          />
          <label htmlFor="month2">Month</label>
          <input
            onChange={handleFormChange}
            value={formState.month}
            type="text"
            id="month2"
            className="form-control"
            name="month"
            placeholder="MM" />
          <button className="btn btn-success">Submit</button>
        </form>
      </div>
      {formState.form === "income" && incomeTableState.data[0].id ? (
        <Table
          state={incomeTableState}
          sourcesState={sourcesState}
          personsState={personsState}
          handleChange={handleIncomeChange}
          setSourcesState={setSourcesState}
          setPersonsState={setPersonsState}
        />
      ) : null}
      {formState.form === "expenses" && expensesTableState.data[0].entry_id ? (
        <Table
          state={expensesTableState}
          personsState={personsState}
          broadState={broadState}
          narrowState={narrowState}
          handleChange={handleExpensesChange}
          setPersonsState={setPersonsState}
          setBroadState={setBroadState}
          setNarrowState={setNarrowState}
        />
      ) : null}
      {formState.form === "pivot" && pivotTableState ? (
        <table>
          <thead>
            <tr>
              <th>
                Broad Category
              </th>
              <th>
                Narrow Category
              </th>
              <th>
                Amount
              </th>
            </tr>
          </thead>
          {pivotTableState.map((entry: pivotDataEntry, i: number) => (
            <tbody key={i}>
              <tr>
                <td>
                  {entry.Broad_category}
                </td>
                <td>
                  {entry.Narrow_category}
                </td>
                <td>
                  {entry.Amount}
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      ) : null}
    </div>
  );
}

export default App;