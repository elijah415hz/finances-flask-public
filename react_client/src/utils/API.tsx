
const API = {
    getExpenses: function (yearMonthObj: {year: string, month: string}): Promise<Response> {
        return fetch(`/api/income?year=${yearMonthObj.year}&month=${yearMonthObj.month}`)
           
    }
}

export default API