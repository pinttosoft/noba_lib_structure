export type TransactionalProfileType = {
  maximumWithdrawalPerTransaction: number;
  maximumMonthlyWithdrawal: number;
};
export type RequestTransactionalProfile = {
  company: TransactionalProfileType;
  person: TransactionalProfileType;
};
