interface FormStateType {
    form: "expenses" | "income" | "pivot",
    year: number,
    month: number
}

type InputName = "person" | "broad_category" | "narrow_category"

interface TableDataEntry {
    amount: string,
    date?: string,
    source?: string,
    person?: string,
    id?: number,
    person_id?: number,
    vendor?: string,
    broad_category?: string,
    narrow_category?: string,
    notes?: string,
}

interface ExpensesFormType {
    date: Date | null,
    amount: number,
    person_id: number,
    broad_category_id: number,
    narrow_category_id: number,
    vendor: string,
    notes: string
}

interface IncomeFormType {
    date: Date | null,
    amount: number,
    person_id: number,
    source: string,
}

interface EditFormType {
    person?: string,
    broad_category?: string,
    narrow_category?: string,
    has_person?: boolean,
    broad_category_id?: number
}

interface CategoryType {
    name: string,
    id: number,
    person?: boolean
}

interface DataListStateType {
    id: number,
    name: string,
    person?: boolean,
    broad_category_id?: number
}

interface AllDataListsType {
    persons: DataListStateType[],
    narrow_categories: DataListStateType[],
    broad_categories: DataListStateType[],
}

interface TableType {
    schema: {
        fields: []
    },
    data: TableDataEntry[]
}

interface AlertStateType {
    severity: "success" | "info" | "warning" | "error" | undefined,
    message: string,
    open: boolean,
}

interface Auth {
    loggedIn: boolean,
    user: string,
    token: string
  };
  
  interface ContextState {
    Auth: Auth,
    setAuth: React.Dispatch<{ type: string; payload?: { user: string; token: string; } | undefined; }>,
    setAlertState: React.Dispatch<React.SetStateAction<AlertStateType>>
    setOpenBackdrop: React.Dispatch<React.SetStateAction<boolean>>
  };

interface WallChartDataType {
    labels: string[], 
    expenses: number[], 
    income: number[]
}

interface ChartJSDataType {
    labels: string[],
    datasets: 
        {
            label: string,
            data: number[],
            fill: boolean,
            borderColor: string
        }[]
    
}

export type {
    TableDataEntry,
    DataListStateType,
    AllDataListsType,
    FormStateType,
    InputName,
    TableType,
    ExpensesFormType,
    IncomeFormType,
    CategoryType,
    AlertStateType,
    Auth,
    ContextState,
    EditFormType,
    WallChartDataType,
    ChartJSDataType
}