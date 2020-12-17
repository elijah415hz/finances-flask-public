interface formStateType {
    form: "expenses" | "income" | "pivot",
    year: number,
    month: number
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

interface expensesFormType {
    Date: Date | null,
    Amount: number,
    person_id: number,
    broad_category_id: number,
    narrow_category_id: number,
    vendor: string,
    notes: string
}

interface incomeFormType {
    date: Date | null,
    amount: number,
    earner_id: number,
    source: string,
}

interface categoryType {
    name: string, 
    id: number, 
    narrowCategories?: {
        name: string, id: number
    }[], 
    person?: boolean
}

interface dataListStateType {
    id: number,
    name: string
}

interface allDataListsType {
    source: dataListStateType[], 
    person_earner: dataListStateType[],
    narrow_category: dataListStateType[],
    broad_category: dataListStateType[],
    vendor: dataListStateType[]
}

interface tableType {
    schema: { 
        fields: [] 
    }, 
    data: tableDataEntry[]
}

export type {
    tableDataEntry,
    dataListStateType, 
    allDataListsType,
    formStateType,
    InputName, 
    tableType,
    expensesFormType,
    incomeFormType,
    categoryType}