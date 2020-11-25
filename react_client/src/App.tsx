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

  interface dataListStateType {
    id: number,
    name: string
  }

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

  const [sourcesState, setSourcesState] = useState<dataListStateType[]>([])
  const [personsState, setPersonsState] = useState<dataListStateType[]>([])

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

  function handleExpensesChange(event: React.ChangeEvent<HTMLInputElement>, entry_id: number): void {
    if (expensesTableState) {
      let { name, value } = event.target;
      let newExpensesTableStateData: expensesDataEntry[] = expensesTableState.data.map(((entry: expensesDataEntry) => {
        if (entry.entry_id === entry_id) {
          entry = { ...entry, [name]: value }
        }
        return entry;
      }))
      setExpensesTableState({ ...expensesTableState, data: newExpensesTableStateData })
    }
  }

  function handleIncomeChange(event: React.ChangeEvent<HTMLInputElement>, id: number): void {
    if (expensesTableState) {
      let { name, value } = event.target;
      let newIncomeTableStateData: incomeDataEntry[] = incomeTableState.data.map(((entry: incomeDataEntry) => {
        if (entry.id === id) {
          if (name === 'Source' || name === 'Person') {
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
            }
            let sourcePerson = state.filter((i: dataListStateType) => i.name === value)[0]
            if (sourcePerson) {
              entry = { ...entry, [name]: value, [id]: sourcePerson.id }
            } else {
              entry = { ...entry, [name]: value, ...{} }
            }
          } else {
            entry = { ...entry, [name]: value, ...{} }
          }
        }
        return entry;
      }))
      setIncomeTableState({ ...incomeTableState, data: newIncomeTableStateData })
    }
  }



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
          handleChange={handleIncomeChange}
          setSourcesState={setSourcesState}
          setPersonsState={setPersonsState}
          sourcesState={sourcesState}
          personsState={personsState}
        />
      ) : null}
      {formState.form === "expenses" && expensesTableState.data[0].entry_id ? (
        <Table
          state={expensesTableState}
          handleChange={handleExpensesChange}
          setSourcesState={setSourcesState}
          setPersonsState={setPersonsState}
          sourcesState={sourcesState}
          personsState={personsState}
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