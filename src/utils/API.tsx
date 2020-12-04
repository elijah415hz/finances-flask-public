
interface sourcesStateType {
    id: number,
    name: string
}

interface tableDataEntry {
    Amount: string,
    Date?: string,
    Source?: string,
    Person?: string,
    id?: number,
    source_id?: number,
    earner_id?: number,
    Vendor?: string,
    Broad_category?: string,
    Narrow_category?: string,
    Notes?: string,
    entry_id?: number
}

const API = {
    expenses: function (token: string | null, yearMonthObj: { form: string, year: string, month: string }): Promise<Response> {
        return fetch(`/api/expenses?year=${yearMonthObj.year}&month=${yearMonthObj.month}`, {
            headers: {
                "authorization": `Bearer ${token}`
            }
        })
    },
    deleteExpenses: function (token: string | null, id: number | undefined): Promise<Response | string> {
        return fetch(`/api/expenses/${id}`, {
            method: 'DELETE',
            headers: {
                "authorization": `Bearer ${token}`
            }
        }).then(res=>res.text())
    },
    updateExpenses: function (token: string | null, data: tableDataEntry): Promise<Response | string> {
        return fetch(`/api/expenses/${data.entry_id}`, {
            method: 'PUT',
            headers: {
                "authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res=>res.text())
    },
    income: function (token: string | null, yearMonthObj: { form: string, year: string, month: string }): Promise<Response> {
        return fetch(`/api/income?year=${yearMonthObj.year}&month=${yearMonthObj.month}`, {
            headers: {
                "authorization": `Bearer ${token}`
            }
        })
    },
    updateIncome: function (token: string | null, data: tableDataEntry): Promise<Response | string> {
        return fetch(`/api/income/${data.id}`, {
            method: 'PUT',
            headers: {
                "authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res=>res.text())
    },
    deleteIncome: function (token: string | null, id: number | undefined): Promise<Response | string> {
        return fetch(`/api/income/${id}`, {
            method: 'DELETE',
            headers: {
                "authorization": `Bearer ${token}`
            }
        }).then(res=>res.text())
    },
    pivot: function (token: string | null, yearMonthObj: { form: string, year: string, month: string }): Promise<Response> {
        return fetch(`/api/pivot?year=${yearMonthObj.year}&month=${yearMonthObj.month}`, {
            headers: {
                "authorization": `Bearer ${token}`
            }
        })
    },
    wallchart: function (token: string | null,): Promise<Response> {
        return fetch('/api/wallchart', {
            headers: {
                "authorization": `Bearer ${token}`
            }
        })
    },
    sources: function (token: string | null,): Promise<{ data: sourcesStateType[] }> {
        return fetch('/api/sources', {
            headers: {
                "authorization": `Bearer ${token}`
            }
        }).then(res => res.json())
    },
    persons: function (token: string | null,): Promise<{ data: sourcesStateType[] }> {
        return fetch('/api/persons', {
            headers: {
                "authorization": `Bearer ${token}`
            }
        }).then(res => res.json())
    },
    narrow: function (token: string | null,): Promise<{ data: sourcesStateType[] }> {
        return fetch('/api/narrows', {
            headers: {
                "authorization": `Bearer ${token}`
            }
        }).then(res => res.json())
    },
    broad: function (token: string | null,): Promise<{ data: sourcesStateType[] }> {
        return fetch('/api/broads', {
            headers: {
                "authorization": `Bearer ${token}`
            }
        }).then(res => res.json())
    },
    vendors: function (token: string | null,): Promise<{ data: sourcesStateType[] }> {
        return fetch('/api/vendors', {
            headers: {
                "authorization": `Bearer ${token}`
            }
        }).then(res => res.json())
    },
    login: function (data: { username: string, password: string }): Promise<{ token: string }> {
        return fetch('/api/login', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => res.json())
    },
    checkAuth: function (token: string | null): Promise<Response> {
        return fetch(`/api/checkAuth`, {
            headers: {
                "authorization": `Bearer ${token}`
            }
        }).then(res => res.json())
    }
}

export default API