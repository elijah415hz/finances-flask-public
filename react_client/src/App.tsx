import React, { useState } from 'react';
import './App.css';
import API from './utils/API'

function App() {
  const [formState, setFormState] = useState<{ form: "expenses" | "income" | "pivot", year: string, month: string }>(
    {
      form: "income",
      year: "",
      month: ""
    }
  )

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
    id: number
  }

  interface pivotDataEntry {
    Broad_category: string,
    Narrow_category: string,
    Amount: string
  }

  const [incomeTableState, setIncomeTableState] = useState<incomeDataEntry[]>(
    [{
      Amount: "",
      Date: "",
      Source: "",
      Person: "",
      id: NaN
    }]
  )

  const [expensesTableState, setExpensesTableState] = useState<expensesDataEntry[]>(
    [{
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
  )
  const [pivotTableState, setPivotTableState] = useState<pivotDataEntry[]>()

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
      let {data} = await (await API[route](formState)).json()
      // Formatting the dates the hard way because javascript doesn't support strftime...
      // tableData.data = tableData.data.map(formatDates)
      switch (route) {
        case "expenses":
          setExpensesTableState(data)
          break;
        case "income":
          setIncomeTableState(data)
          break;
        case "pivot":
          console.log(data)
          setPivotTableState(data)
          break;
      }
    } catch (err) {
      console.error(err)
    }
  }

  function handleExpensesChange(event: React.ChangeEvent<HTMLInputElement>, entry_id: number): void {
    if (expensesTableState) {
      let { name, value } = event.target;
      let newExpensesTableState: expensesDataEntry[] = expensesTableState.map(((entry: expensesDataEntry) => {
        if (entry.entry_id === entry_id) {
          entry = { ...entry, [name]: value }
        }
        return entry;
      }))
      setExpensesTableState(newExpensesTableState)
    }
  }

  function handleIncomeChange(event: React.ChangeEvent<HTMLInputElement>, id: number): void {
    if (expensesTableState) {
      let { name, value } = event.target;
      let newIncomeTableState: incomeDataEntry[] = incomeTableState.map(((entry: incomeDataEntry) => {
        if (entry.id === id) {
          entry = { ...entry, [name]: value }
        }
        return entry;
      }))
      setIncomeTableState(newIncomeTableState)
    }
  }

  return (
    <div className="App">
      <div className="header">
        <h1>Finances!</h1>
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
      {formState.form === "income" && incomeTableState[0].id ? (
        <table>
          <thead>
            <tr>
              <th>
                Date
              </th>
              <th>
                Amount
              </th>
              <th>
                Source
              </th>
              <th>
                Person
              </th>
            </tr>
          </thead>
          {incomeTableState.map((entry: incomeDataEntry) => (
            <tbody key={entry.id}>
              <tr>
                <td><input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleIncomeChange(e, entry.id)}
                  name="Date"
                  className="tableInput"
                  value={entry.Date}
                />
                </td>
                <td><input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleIncomeChange(e, entry.id)}
                  name="Amount"
                  className="tableInput"
                  value={entry.Amount}
                />
                </td>
                <td><input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleIncomeChange(e, entry.id)}
                  name="Source"
                  className="tableInput"
                  value={entry.Source}
                />
                </td>
                <td><input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleIncomeChange(e, entry.id)}
                  name="Person"
                  className="tableInput"
                  value={entry.Person}
                />
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      ) : null}
      {formState.form === "expenses" && expensesTableState[0].entry_id ? (
        <table>
          <thead>
            <tr>
              <th>
                Date
              </th>
              <th>
                Vendor
              </th>
              <th>
                Amount
              </th>
              <th>
                Broad Category
              </th>
              <th>
                Narrow Category
              </th>
              <th>
                Person
              </th>
              <th>
                Notes
              </th>
            </tr>
          </thead>
          {expensesTableState.map((entry: expensesDataEntry) => (
            <tbody key={entry.entry_id}>
              <tr>
                <td><input onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleExpensesChange(e, entry.entry_id)}
                  name="Date"
                  className="tableInput"
                  value={entry.Date} /></td>
                <td><input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleExpensesChange(e, entry.entry_id)}
                  name="Vendor"
                  className="tableInput"
                  value={entry.Vendor} /></td>
                <td><input onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleExpensesChange(e, entry.entry_id)}
                  name="Amount"
                  className="tableInput"
                  value={entry.Amount}
                />
                </td>
                <td>
                  <input onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleExpensesChange(e, entry.entry_id)}
                    name="Broad_category"
                    className="tableInput"
                    value={entry.Broad_category}
                  />
                </td>
                <td>
                  <input onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleExpensesChange(e, entry.entry_id)}
                    name="Narrow_category"
                    className="tableInput"
                    value={entry.Narrow_category}
                  />
                </td>
                <td>
                  <input onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleExpensesChange(e, entry.entry_id)}
                    name="Person"
                    className="tableInput"
                    value={entry.Person}
                  />
                </td>
                <td>
                  <input onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleExpensesChange(e, entry.entry_id)}
                    name="Notes"
                    className="tableInput"
                    value={entry.Notes}
                  />
                </td>
              </tr>

            </tbody>
          ))}
        </table>
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
                <td><input
                  name="Broad_category"
                  className="tableInput"
                  value={entry.Broad_category}
                />
                </td>
                <td><input
                  name="Narrow_category"
                  className="tableInput"
                  value={entry.Narrow_category}
                />
                </td>
                <td><input
                  name="Amount"
                  className="tableInput"
                  value={entry.Amount}
                />
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
