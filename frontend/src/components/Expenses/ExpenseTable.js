import React from "react";

const ExpenseTable = ({ expenses, expenseTotal }) => {
  const formatDate = (date) => {
    if (date == null) {
      return "";
    }
    const options = { day: "2-digit", month: "short" };
    return new Intl.DateTimeFormat("en-IN", options).format(new Date(date));
  };
  return (
    <div className="expense-list">
      <table>
        <thead className="expense-list-header">
          <tr>
            <th className="expense-security">Category</th>
            <th className="expense-security">Amount Paid</th>
            <th className="expense-security">Descriptiom</th>
            <th className="expense-security">Expense Date</th>
          </tr>
        </thead>
        <tbody>
          {expenses?.map((expense) => (
            <tr key={expense._id} className="expense-card">
              <td className="expense-id">{expense.category}</td>
              <td className="expense-name">&#8377;{expense.amount}</td>
              <td className="expense-name">{expense.description}</td>
              <td className="expense-date">
                {formatDate(expense.expenseDate)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="finalTotal">Total expense: </td>
            <td className="finalTotal">&#8377;{expenseTotal}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ExpenseTable;
