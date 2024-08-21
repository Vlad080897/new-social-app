import { withErrors } from "./withErrors";
import { withTransactions } from "./withTransactions";

export const withWrappers = (fn: Function) => {
  return withErrors(withTransactions(fn));
};
