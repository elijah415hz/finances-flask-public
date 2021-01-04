import { openDB, deleteDB, DBSchema, IDBPDatabase } from 'idb'
import { AllDataListsType, ExpensesFormType, IncomeFormType } from '../interfaces/Interfaces';
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
}


let db: IDBPDatabase<financesDB>;
export async function testDatabase() {
  db = await openDB<financesDB>("pendingFinances", 3, {
    async upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        db.createObjectStore('expenses', { autoIncrement: true })
        db.createObjectStore('income', { autoIncrement: true })
      }
      db.createObjectStore('broad_categories', { autoIncrement: true })
      db.createObjectStore('narrow_categories', { autoIncrement: true })
      db.createObjectStore('persons', { autoIncrement: true })
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
  
  (Object.keys(categories) as Array<keyof AllDataListsType>).map((category: keyof AllDataListsType) => {
    db.clear(category)
    categories[category as keyof AllDataListsType]?.map(c => {
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

export async function emptyDatabase() {
  try {
    await db.clear('expenses')
    await db.clear('income')
    return "pendingFinances cleared!"
  } catch (err) {
    return err
  }
}

async function checkDatabase() {
  let token = localStorage.getItem('token')
  try {
    const pendingExpenses = await db.getAll("expenses");
    if (pendingExpenses.length > 0) {
      await API.postBatchExpenses(token, pendingExpenses)
      // delete records if successful
      db.clear('expenses')
    }
    const pendingIncome = await db.getAll("income");
    if (pendingIncome.length > 0) {
      await API.postBatchIncome(token, pendingIncome)
      // delete records if successful
      db.clear('income')
    }
  } catch (err) {
    console.error(err)
  }
}

// listen for app coming back online
window.addEventListener("online", checkDatabase);