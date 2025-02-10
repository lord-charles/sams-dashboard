export interface School {
  name: string;
  type: string;
  ownership: string;
  code: string;
}

export interface Location {
  state10: string;
  county10: string;
  payam10: string;
}

export interface Amount {
  amount: number;
  currency: string;
}

export interface Amounts {
  approved: Amount;
  paid: Amount;
}

export interface Accountability {
  amountAccounted: number;
  dateAccounted: string;
}

export interface SchoolData {
  tranche: number;
  year: number;
  state10: string;
  county10: string;
  payam10: string;
  amounts: Amounts;
  learnerCount: number;
  school: School;
  accountability: Accountability;
}
