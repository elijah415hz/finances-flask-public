
interface sourcesStateType {
    id: number,
    name: string
}

const API = {
    expenses: function (yearMonthObj: { form: string, year: string, month: string }): Promise<Response> {
        return fetch(`/api/expenses?year=${yearMonthObj.year}&month=${yearMonthObj.month}`)
    },
    income: function (yearMonthObj: { form: string, year: string, month: string }): Promise<Response> {
        return fetch(`/api/income?year=${yearMonthObj.year}&month=${yearMonthObj.month}`)
    },
    pivot: function (yearMonthObj: { form: string, year: string, month: string }): Promise<Response> {
        return fetch(`/api/pivot?year=${yearMonthObj.year}&month=${yearMonthObj.month}`)
    },
    wallchart: function (): Promise<Response> {
        return fetch('/api/wallchart')
    },
    sources: function (): Promise<{data: sourcesStateType[]}> {
        return fetch('/api/sources').then(res=>res.json())
    },
    persons: function (): Promise<{data: sourcesStateType[]}> {
        return fetch('/api/persons').then(res=>res.json())
    },
    narrow: function (): Promise<{data: sourcesStateType[]}> {
        return fetch('/api/narrows').then(res=>res.json())
    },
    broad: function (): Promise<{data: sourcesStateType[]}> {
        return fetch('/api/broads').then(res=>res.json())
    }
}

export default API