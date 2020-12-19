import { openDB, DBSchema, IDBPDatabase } from 'idb'
import { expensesFormType, incomeFormType } from '../interfaces/Interfaces';
import API from './API';

interface financesDB extends DBSchema {
  expenses: {
    value: {
      Amount: number,
      Date: Date | null,
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
      earner_id: number,
      source: string,
    },
    key: string
  }
}


let db: IDBPDatabase<financesDB>;
export async function testDatabase() {
  db = await openDB<financesDB>("pendingFinances", 2, {
    upgrade(db) {
      db.createObjectStore('expenses', { autoIncrement: true })
      db.createObjectStore('income', { autoIncrement: true })
    }
  });

  if (navigator.onLine) {
    checkDatabase();
  }
}

export async function saveRecord(table: 'income' | 'expenses', record: expensesFormType | incomeFormType) {
  await db.put(table, record);
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