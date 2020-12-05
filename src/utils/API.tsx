import type {dataListStateType, tableDataEntry} from '../interfaces/Interfaces'

const API = {
    expenses: function (token: string | null, yearMonthObj: { form: string, year: string, month: string }): Promise<{schema: { fields: [] }, data: tableDataEntry[]}> {
        return fetch(`/api/expenses/${yearMonthObj.year}/${yearMonthObj.month}`, {
            headers: {
                "authorization": `Bearer ${token}`
            }
        }).then(res=>{
            if (res.status === 401) {
                throw "Unauthorized"
            }
            return res.json()
        })
    },
    deleteExpenses: function (token: string | null, id: number | undefined): Promise<Response | string> {
        return fetch(`/api/expenses/${id}`, {
            method: 'DELETE',
            headers: {
                "authorization": `Bearer ${token}`
            }
        }).then(res=>{
            if (res.status === 401) {
                throw "Unauthorized"
            }
            return res.text()
        })
    },
    updateExpenses: function (token: string | null, data: tableDataEntry): Promise<Response | string> {
        return fetch(`/api/expenses/${data.entry_id}`, {
            method: 'PUT',
            headers: {
                "authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res=>{
            if (res.status === 401) {
                throw "Unauthorized"
            }
            return res.text()
        })
    },
    income: function (token: string | null, yearMonthObj: { form: string, year: string, month: string }): Promise<{schema: { fields: [] }, data: tableDataEntry[]}> {
        return fetch(`/api/income/${yearMonthObj.year}/${yearMonthObj.month}`, {
            headers: {
                "authorization": `Bearer ${token}`
            }
        }).then(res=>{
            if (res.status === 401) {
                throw "Unauthorized"
            }
            return res.json()
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
        }).then(res=>{
            if (res.status === 401) {
                throw "Unauthorized"
            }
            return res.text()
        })
    },
    deleteIncome: function (token: string | null, id: number | undefined): Promise<Response | string> {
        return fetch(`/api/income/${id}`, {
            method: 'DELETE',
            headers: {
                "authorization": `Bearer ${token}`
            }
        }).then(res=>{
            if (res.status === 401) {
                throw "Unauthorized"
            }
            return res.text()
        })
    },
    pivot: function (token: string | null, yearMonthObj: { form: string, year: string, month: string }): Promise<{schema: { fields: [] }, data: tableDataEntry[]}> {
        return fetch(`/api/expenses/pivot/${yearMonthObj.year}/${yearMonthObj.month}`, {
            headers: {
                "authorization": `Bearer ${token}`
            }
        }).then(res=>{
            if (res.status === 401) {
                throw "Unauthorized"
            }
            return res.json()
        })
    },
    sources: function (token: string | null,): Promise<{ data: dataListStateType[] }> {
        return fetch('/api/sources', {
            headers: {
                "authorization": `Bearer ${token}`
            }
        }).then(res => {
            if (res.status === 401) {
                throw "Unauthorized"
            }
            return res.json()
        })
    },
    persons: function (token: string | null,): Promise<{ data: dataListStateType[] }> {
        return fetch('/api/persons', {
            headers: {
                "authorization": `Bearer ${token}`
            }
        }).then(res => {
            if (res.status === 401) {
                throw "Unauthorized"
            }
            return res.json()
        })
    },
    narrow: function (token: string | null,): Promise<{ data: dataListStateType[] }> {
        return fetch('/api/narrows', {
            headers: {
                "authorization": `Bearer ${token}`
            }
        }).then(res => {
            if (res.status === 401) {
                throw "Unauthorized"
            }
            return res.json()
        })
    },
    broad: function (token: string | null,): Promise<{ data: dataListStateType[] }> {
        return fetch('/api/broads', {
            headers: {
                "authorization": `Bearer ${token}`
            }
        }).then(res => {
            if (res.status === 401) {
                throw "Unauthorized"
            }
            return res.json()
        })
    },
    vendors: function (token: string | null,): Promise<{ data: dataListStateType[] }> {
        return fetch('/api/vendors', {
            headers: {
                "authorization": `Bearer ${token}`
            }
        }).then(res => {
            if (res.status === 401) {
                throw "Unauthorized"
            }
            return res.json()
        })
    },
    login: function (data: { username: string, password: string }): Promise<{ token: string }> {
        return fetch('/auth/login', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => {
            if (res.status === 401) {
                throw "Unauthorized"
            }
            return res.json()
        })
    },
    checkAuth: function (token: string | null): Promise<Response> {
        return fetch(`/auth/checkAuth`, {
            headers: {
                "authorization": `Bearer ${token}`
            }
        }).then(res => {
            if (res.status === 401) {
                throw "Unauthorized"
            }
            return res.json()
        })
    }
}

export default API