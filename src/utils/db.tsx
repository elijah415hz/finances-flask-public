import { openDB, DBSchema, IDBPDatabase } from 'idb'
import { AlertStateType, AllDataListsType, ExpensesFormType, IncomeFormType, WallChartDataType } from '../interfaces/Interfaces';
import API from './API';

interface financesDB extends DBSchema {
  expenses: {
    value: {
      amount: number,
      date: Date | null,
      person_id: number,
      vendor: string,
      broad_category_id: number,
      narrow_category_id: number,
      notes: string
    },
    key: string
  },
  income: {
    value: {
      date: Date | null,
      amount: number,
      person_id: number,
      source: string,
    },
    key: string
  },
  broad_categories: {
    value: {
      name: string,
      id: number,
      person: boolean
    },
    key: string
  },
  narrow_categories: {
    value: {
      name: string,
      id: number,
      broad_category_id: number
    },
    key: string
  },
  persons: {
    value: {
      name: string,
      id: number
    },
    key: string
  },
  wallchart: {
    value: {
      labels: string[],
      income: number[],
      expenses: number[]
    },
    key: string
  },
}


let db: IDBPDatabase<financesDB>;
export async function testDatabase() {
  db = await openDB<financesDB>("finances", 1, {
    async upgrade(db) {
      db.createObjectStore('expenses', { autoIncrement: true })
      db.createObjectStore('income', { autoIncrement: true })
      db.createObjectStore('broad_categories', { autoIncrement: true })
      db.createObjectStore('narrow_categories', { autoIncrement: true })
      db.createObjectStore('persons', { autoIncrement: true })
      db.createObjectStore('wallchart', { autoIncrement: true })
    }
  });

  if (navigator.onLine) {
    checkDatabase();
  }
}

export async function saveRecord(table: 'income' | 'expenses', record: ExpensesFormType | IncomeFormType) {
  await db.put(table, record);
}

export async function saveCategories(categories: AllDataListsType) {
  (Object.keys(categories) as Array<keyof AllDataListsType>).forEach((category: keyof AllDataListsType) => {
    db.clear(category)
    categories[category as keyof AllDataListsType]?.forEach(c => {
      db.put(category, c)
    })
  })
}

export async function loadCategories() {
  let tables: Array<keyof AllDataListsType> = ['broad_categories', 'narrow_categories', 'persons']
  let categories: AllDataListsType = {
    'broad_categories': [],
    'narrow_categories': [],
    'persons': []
  };
  tables.map(async table => {
    let category = await db.getAll(table)
    categories[table] = category
  })
  return categories
}

export async function saveWallChartData(data: WallChartDataType) {
  await db.clear('wallchart');
  db.put('wallchart', data);
}

export async function loadWallChartData(): Promise<WallChartDataType> {
  let data = await db.getAll('wallchart');
  return data[0];
}

export async function emptyDatabase(): Promise<string> {
  try {
    await db.clear('expenses')
    await db.clear('income')
    return "pendingFinances cleared!"
  } catch (err) {
    return err
  }
}

export async function checkDatabase() {
  let token = localStorage.getItem('token')
  let uploaded: AlertStateType = {
    severity: undefined,
    message: "",
    open: false,
  }
  try {
    const pendingExpenses = await db.getAll("expenses");
    if (pendingExpenses.length > 0) {
      await API.postBatchExpenses(token, pendingExpenses)
      // delete records if successful
      db.clear('expenses')
      uploaded = {
        severity: "success",
        message: "Saved Expenses uploaded",
        open: true,
      }
    }
    const pendingIncome = await db.getAll("income");
    if (pendingIncome.length > 0) {
      await API.postBatchIncome(token, pendingIncome)
      // delete records if successful
      db.clear('income')
      uploaded = {
        severity: "success",
        message: "Saved Income uploaded",
        open: true,
      }
    }
  } catch (err) {
    console.error(err)
    uploaded = {
      severity: "error",
      message: "Error uploading saved records",
      open: true,
    }
  }
  return uploaded
}

