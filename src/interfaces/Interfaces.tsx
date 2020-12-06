interface formStateType {
    form: "expenses" | "income" | "pivot",
    year: string,
    month: string
}

type InputName = "Person" | "Source" | "Broad_category" | "Narrow_category" | "Vendor"

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

interface dataListStateType {
    id: number,
    name: string
}

interface tableType {
    schema: { 
        fields: [] 
    }, 
    data: tableDataEntry[]
}

export type {tableDataEntry, dataListStateType, formStateType, InputName, tableType}