# 🧾 Expense Management System — Entity & Relationship Overview

## 🎯 Purpose
A complete expense tracking system that:
- Tracks income sources 💰
- Logs expenses hierarchically (parent–child) 📉
- Assigns each expense to a category 🏷️
- Supports monthly budgets 🗓️
- Computes remaining balance and overspending alerts ⚡

---

## 🧩 Core Entities

### 1️⃣ Category
**Purpose:** Defines a label/type for expenses (e.g., “Home”, “Groceries”, “Bills”).  
**Table:** `categories`

| Column | Type | Description |
|--------|------|-------------|
| `id` | PK | Auto-generated ID |
| `name` | string | Category name (unique) |

**Relations:**
- One-to-Many with `Expense` → One category can have many expenses.

---

### 2️⃣ Expense
**Purpose:** Stores every spending record. Supports **hierarchical relationships**, meaning an expense can have **child expenses** to break down bigger ones (e.g., “Home Budget → Diapers, Milk, Rent”).  

**Table:** `expenses`

| Column | Type | Description |
|--------|------|-------------|
| `id` | PK | Auto-generated ID |
| `title` | string | Expense title |
| `amount` | decimal | Amount spent |
| `category_id` | FK → `categories.id` | Optional category |
| `parent_id` | FK → `expenses.id` | Parent expense (for nesting) |
| `budget_id` | FK → `budgets.id` | Optional link to monthly budget |
| `date` | date | Date of expense |
| `note` | string | Optional description |

**Relations:**
- `ManyToOne(Category)` → Each expense belongs to one category.
- `ManyToOne(Expense)` (self-relation) → Parent expense.
- `OneToMany(Expense)` → Child expenses.
- `ManyToOne(Budget)` → Optional association with a monthly budget.

**Example Hierarchy:**
```
Salary Allocation (root)
 └── Home Budget (category: Home)
      ├── Diapers (category: Groceries)
      ├── Milk (category: Groceries)
      └── Electricity Bill (category: Bills)
```

---

### 3️⃣ Budget
**Purpose:** Defines how much can be spent in a given **month** (and optionally per category).  
**Table:** `budgets`

| Column | Type | Description |
|--------|------|-------------|
| `id` | PK | Auto-generated ID |
| `month` | string (YYYY-MM) | Month the budget applies to |
| `amount` | decimal | Monthly or category budget limit |
| `category_id` | FK → `categories.id` | Optional: budget for a specific category |
| `created_at` | timestamp | Auto timestamp |

**Relations:**
- `ManyToOne(Category)` → Budget may target a specific category.
- `OneToMany(Expense)` → Each budget may have multiple related expenses.

---

### 4️⃣ Income
**Purpose:** Tracks all income sources — salary, freelance, bonuses, etc.  
**Table:** `incomes`

| Column | Type | Description |
|--------|------|-------------|
| `id` | PK | Auto-generated ID |
| `title` | string | Income source name |
| `amount` | decimal | Amount received |
| `source` | string | Optional — source name |
| `date` | date | When the income was received |
| `note` | string | Optional description |

**Relations:**
- Independent (no foreign keys).  
- Used in balance calculation: `TotalIncome - TotalExpenses`.

---

## 🧭 Entity Relationship Diagram (ERD)

```
       ┌────────────────┐
       │   categories   │
       │ id             │
       │ name           │
       └──────┬─────────┘
              │ 1 ────∞
              │
       ┌──────┴───────────────┐
       │       expenses        │
       │ id                    │
       │ title                 │
       │ amount                │
       │ category_id (FK)      │
       │ parent_id (FK→self)   │
       │ budget_id (FK)        │
       │ date, note            │
       └──────┬────────────┬───┘
              │             │
         ∞────┘         ∞───┘
       budgets         expenses (self)
         │
         │ 1 ────∞
         │
     ┌────┴────────────┐
     │     budgets      │
     │ id               │
     │ month            │
     │ amount           │
     │ category_id (FK) │
     └──────────────────┘


     ┌──────────────────┐
     │     incomes       │
     │ id                │
     │ title             │
     │ amount            │
     │ source, date      │
     └──────────────────┘
```

---

## 📊 Key Calculations

### 🔹 Total Income
```sql
SELECT COALESCE(SUM(amount), 0) AS total_income FROM incomes;
```

### 🔹 Total Expenses (including sub-expenses)
```sql
WITH RECURSIVE all_expenses AS (
  SELECT id, amount, parent_id FROM expenses
  UNION ALL
  SELECT e.id, e.amount, e.parent_id 
  FROM expenses e
  JOIN all_expenses a ON e.parent_id = a.id
)
SELECT COALESCE(SUM(amount), 0) AS total_expenses FROM all_expenses;
```

### 🔹 Balance (Income − Expenses)
```sql
SELECT
  (SELECT COALESCE(SUM(amount), 0) FROM incomes) -
  (SELECT COALESCE(SUM(amount), 0) FROM expenses) AS balance;
```

### 🔹 Budget Usage (per category or month)
```sql
SELECT 
  b.id AS budget_id,
  b.month,
  c.name AS category,
  b.amount AS budget_limit,
  COALESCE(SUM(e.amount), 0) AS total_spent,
  b.amount - COALESCE(SUM(e.amount), 0) AS remaining
FROM budgets b
LEFT JOIN categories c ON b.category_id = c.id
LEFT JOIN expenses e ON e.budget_id = b.id
GROUP BY b.id, c.name, b.amount, b.month;
```

---

## 💡 System Logic Summary

| Feature | Description |
|----------|--------------|
| **Income Tracking** | Store different income sources and calculate total income. |
| **Hierarchical Expenses** | Break down high-level expenses into smaller ones. |
| **Flat Categories** | Categorize any expense easily. |
| **Budgets** | Set spending limits monthly (global or per category). |
| **Balance Calculation** | `Total Income - Total Expenses`. |
| **Overspending Detection** | When `SUM(expenses.amount) > budgets.amount`, trigger alert. |

---

## ⚙️ Tech Stack Assumptions
- **Backend:** NestJS  
- **ORM:** TypeORM  
- **Database:** PostgreSQL / SQLite  
- **Frontend (Optional):** React or React Native  
- **Auth:** JWT  

---

## ✅ Example Use Case Flow
1️⃣ User receives salary → create an `income` record.  
2️⃣ User sets October budget → `budget` for Rs. 50,000.  
3️⃣ User creates a main expense “Home Budget (50,000)” linked to that budget.  
4️⃣ User breaks it down → adds child expenses “Diapers”, “Milk”, “Electricity Bill”.  
5️⃣ System sums all nested expenses → checks if they exceed budget.  
6️⃣ Dashboard shows:
   - Total Income: Rs. 100,000  
   - Total Expenses: Rs. 60,000  
   - Remaining Balance: Rs. 40,000  
   - Budget Remaining (Home): Rs. 50,000 − Rs. 10,000 = Rs. 40,000  
