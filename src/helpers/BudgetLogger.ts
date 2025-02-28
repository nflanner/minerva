export class BudgetLogger {
  static logInitialData(data: any) {
    console.group('=== Initial Data ===');
    console.log('Loans:', {
      count: data.loans.length,
      totalMonthlyPayments: data.loans.reduce((sum: number, loan: any) => sum + loan.cadenceAmount, 0),
      totalDebt: data.loans.reduce((sum: number, loan: any) => sum + loan.amountRemaining, 0)
    });
    
    console.log('Expenses:', {
      count: data.monthlyExpenses.length,
      byType: data.monthlyExpenses.reduce((acc: any, exp: any) => {
        acc[exp.cadence] = (acc[exp.cadence] || 0) + exp.cadenceAmount;
        return acc;
      }, {})
    });
    
    console.log('Income:', {
      count: data.monthlyIncome.length,
      byType: data.monthlyIncome.reduce((acc: any, inc: any) => {
        acc[inc.cadence] = (acc[inc.cadence] || 0) + inc.cadenceAmount;
        return acc;
      }, {})
    });

    console.log('Budget Parameters:', {
      currentSavings: data.currentSavings,
      currentChecking: data.currentChecking,
      desiredDepositAmount: data.desiredDepositAmount,
      desiredCheckingMin: data.desiredCheckingMin,
      incomePayDates: data.incomePayDates
    });
    console.groupEnd();
  }

  static logDailySnapshot(day: number, results: any) {
    console.group(`=== Day ${day} Snapshot ===`);
    console.log({
      checking: results.checkingArray[day],
      savings: results.savingsArray[day],
      dayIncome: results.incomeArray[day],
      dayExpenses: results.billsArray[day]
    });
    console.groupEnd();
  }

  static logMonthlySnapshot(month: number, results: any) {
    const startDay = month * 30;
    const endDay = startDay + 29;
    
    const monthlyTotals = {
      income: results.incomeArray.slice(startDay, endDay + 1).reduce((sum: number, amt: number) => sum + amt, 0),
      expenses: results.billsArray.slice(startDay, endDay + 1).reduce((sum: number, amt: number) => sum + amt, 0),
      endingChecking: results.checkingArray[endDay],
      endingSavings: results.savingsArray[endDay]
    };

    console.group(`=== Month ${month + 1} Summary ===`);
    console.log(monthlyTotals);
    console.groupEnd();
  }

  static logFinalResults(results: any) {
    console.group('=== Final Analysis ===');
    console.log({
      yearTotals: {
        income: results.incomeArray.reduce((sum: number, amt: number) => sum + amt, 0),
        expenses: results.billsArray.reduce((sum: number, amt: number) => sum + amt, 0)
      },
      finalBalances: {
        checking: results.checkingArray[results.checkingArray.length - 1],
        savings: results.savingsArray[results.savingsArray.length - 1]
      }
    });
    console.groupEnd();
  }

  static logIncomeProcessing(income: any, payDate: any, nextPayDate: Date) {
    console.group(`=== Income Processing: ${income.name} ===`);
    console.log({
      amount: income.cadenceAmount,
      cadence: income.cadence,
      configuredPayDate: payDate,
      nextPaymentDate: nextPayDate.toISOString()
    });
    console.groupEnd();
  }

  static logPaymentReceived(income: any, day: number, amount: number) {
    console.log(`Income Payment Received: ${income.name}`, {
      day,
      amount,
      timestamp: new Date().toISOString()
    });
  }
}
