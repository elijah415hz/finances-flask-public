import type {
    AllDataListsType, 
    FormStateType, 
    TableDataEntry, 
    TableType,
    ExpensesFormType,
    IncomeFormType} from '../interfaces/Interfaces'


function checkStatus<T>(res: Response, parseMethod: string): Promise<T> {
    if (res.status === 401) {
        throw new Error("Unauthorized")
    }
    if (res.status !== 200) {
        throw new Error("Error! " + res.status)
    }
    if (parseMethod === 'json'){
        return res.json() as Promise<T>
    } else {
        return res.text() as unknown as Promise<T>
    }
}

const API = {
    expenses: function (token: string | null, yearMonthObj: FormStateType): Promise<{schema: { fields: [] }, data: TableDataEntry[]}> {
        return fetch(`/api/expenses/${yearMonthObj.year}/${yearMonthObj.month}`, {
            headers: {
                "authorization": `Bearer ${token}`
            }
        }).then(res=>checkStatus<TableType>(res, 'json'))
    },
    postExpenses: function (token: string | null, data:ExpensesFormType): Promise<Response | string> {
        return fetch(`/api/expenses/`, {
            method: 'POST',
            headers: {
                "authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res=>checkStatus<string>(res, 'text'))
    },
    postBatchExpenses: function (token: string | null, data:ExpensesFormType[]): Promise<Response | string> {
        return fetch(`/api/expenses/batch`, {
            method: 'POST',
            headers: {
                "authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res=>checkStatus<string>(res, 'text'))
    },
    postIncome: function (token: string | null, data:IncomeFormType): Promise<Response | string> {
        return fetch(`/api/income/`, {
            method: 'POST',
            headers: {
                "authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res=>checkStatus<string>(res, 'text'))
    },
    postBatchIncome: function (token: string | null, data:IncomeFormType[]): Promise<Response | string> {
        return fetch(`/api/income/batch`, {
            method: 'POST',
            headers: {
                "authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res=>checkStatus<string>(res, 'text'))
    },
    deleteExpenses: function (token: string | null, id: number | undefined): Promise<Response | string> {
        return fetch(`/api/expenses/${id}`, {
            method: 'DELETE',
            headers: {
                "authorization": `Bearer ${token}`
            }
        }).then(res=>checkStatus<string>(res, 'text'))
    },
    updateExpenses: function (token: string | null, data: TableDataEntry): Promise<Response | string> {
        return fetch(`/api/expenses/${data.entry_id}`, {
            method: 'PUT',
            headers: {
                "authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res=>checkStatus<string>(res, 'text'))
    },
    income: function (token: string | null, yearMonthObj: FormStateType): Promise<{schema: { fields: [] }, data: TableDataEntry[]}> {
        return fetch(`/api/income/${yearMonthObj.year}/${yearMonthObj.month}`, {
            headers: {
                "authorization": `Bearer ${token}`
            }
        }).then(res=>checkStatus<TableType>(res, 'json'))
    },
    updateIncome: function (token: string | null, data: TableDataEntry): Promise<Response | string> {
        return fetch(`/api/income/${data.id}`, {
            method: 'PUT',
            headers: {
                "authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res=>checkStatus<string>(res, 'text'))
    },
    deleteIncome: function (token: string | null, id: number | undefined): Promise<Response | string> {
        return fetch(`/api/income/${id}`, {
            method: 'DELETE',
            headers: {
                "authorization": `Bearer ${token}`
            }
        }).then(res=>checkStatus<string>(res, 'text'))
    },
    pivot: function (token: string | null, yearMonthObj: FormStateType): Promise<{schema: { fields: [] }, data: TableDataEntry[]}> {
        return fetch(`/api/expenses/${yearMonthObj.year}/${yearMonthObj.month}`, {
            headers: {
                "authorization": `Bearer ${token}`
            }
        }).then(res=>checkStatus<TableType>(res, 'json'))
    },
    dataList: function (token: string | null): Promise<AllDataListsType> {
        return fetch(`/api/datalists`, {
            headers: {
                "authorization": `Bearer ${token}`
            }
        }).then(res => checkStatus<AllDataListsType>(res, 'json'))
    },
    login: function (data: { username: string, password: string }): Promise<{ token: string }> {
        return fetch('/auth/login', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => checkStatus<{ token: string }>(res, 'json'))
    },
    checkAuth: function (token: string | null): Promise<{username: string, token: string}> {
        return fetch(`/auth/checkAuth`, {
            headers: {
                "authorization": `Bearer ${token}`
            }
        }).then(res =>checkStatus<{username: string, token: string}>(res, 'json'))
    }
}

export default API