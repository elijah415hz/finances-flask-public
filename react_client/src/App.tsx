import React, { useState } from 'react';
import './App.css';
import API from './utils/API'

function App() {
  const [expensesFormState, setExpensesFormState] = useState<{ year: string, month: string }>(
    {
      year: "",
      month: ""
    }
  )

  const [tableState, setTableState] = useState<{ schema: { fields: { name: string }[] }, data: [] }>()

  function handleExpensesChange(event: any): void {
    let { name, value } = event.target;
    setExpensesFormState({ ...expensesFormState, [name]: value })
  }

  async function handleExpensesSubmit(event: React.SyntheticEvent): Promise<any> {
    try {
      event.preventDefault()
      let tableData = await (await API.getExpenses(expensesFormState)).json()
      // Formatting the dates the hard way because javascript doesn't support strftime...
      let formattedDatesData = tableData.data.map((entry:
        {
          Amount: string,
          Date: string,
          Source: string,
          Person: string
        }) => {
        let date = new Date(entry.Date);
        let year = date.getFullYear();
        let month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        let day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        let dateString =  month + '/' + day + '/' + year;
        entry.Date = dateString
        return entry
      })
      tableData.data = formattedDatesData
      setTableState(tableData)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="App">
      <h1>View Expenses</h1>
      <form onSubmit={handleExpensesSubmit} className="form-inline">
        <label htmlFor="year2">Year</label>
        <input
          onChange={handleExpensesChange}
          value={expensesFormState.year}
          type="text"
          id="year2"
          className="form-control"
          name="year"
          placeholder="YYYY"
        />
        <label htmlFor="month2">Month</label>
        <input
          onChange={handleExpensesChange}
          value={expensesFormState.month}
          type="text"
          id="month2"
          className="form-control"
          name="month"
          placeholder="MM" />
        <button className="btn btn-success">Submit</button>
      </form>
      {tableState ? (
        <table>
          <thead>
            <tr>
              <th>
                {tableState.schema.fields[0].name}
              </th>
              <th>
                {tableState.schema.fields[1].name}
              </th>
              <th>
                {tableState.schema.fields[2].name}
              </th>
              <th>
                {tableState.schema.fields[3].name}
              </th>
            </tr>
          </thead>
          {tableState.data.map((entry:
            {
              Amount: string,
              Date: string,
              Source: string,
              Person: string
            }, i:number) => (
              <tbody key={i}>
              <tr>
                <td>{entry.Date}</td>
                <td>{entry.Amount}</td>
                <td>{entry.Source}</td>
                <td>{entry.Person}</td>
              </tr>
              </tbody>
            ))}
        </table>
      ) : null}
    </div>
  );
}

export default App;
