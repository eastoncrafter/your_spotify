import { createReducer } from "@reduxjs/toolkit";
import {
  deleteUser,
  deleteUserPublicToken,
  generateUserPublicToken,
  getAccounts,
  setAdmin,
} from "./thunk";

export interface AdminAccount {
  id: string;
  username: string;
  admin: boolean;
  firstListenedAt: string;
  publicToken: string | null;
}

interface SettingsReducer {
  accounts: AdminAccount[];
}

const initialState: SettingsReducer = {
  accounts: [],
};

export default createReducer(initialState, builder => {
  builder.addCase(getAccounts.fulfilled, (state, { payload }) => {
    state.accounts = payload;
  });
  builder.addCase(setAdmin.fulfilled, (state, { meta: { arg } }) => {
    const account = state.accounts.find(acc => acc.id === arg.id);
    if (account) {
      account.admin = arg.status;
    }
  });
  builder.addCase(deleteUser.fulfilled, (state, { meta: { arg } }) => {
    const index = state.accounts.findIndex(u => u.id === arg.id);
    if (index < 0) {
      return;
    }
    state.accounts.splice(index, 1);
  });
  builder.addCase(
    generateUserPublicToken.fulfilled,
    (state, { payload, meta: { arg } }) => {
      const account = state.accounts.find(acc => acc.id === arg.userId);
      if (account) {
        account.publicToken = payload;
      }
    },
  );
  builder.addCase(
    deleteUserPublicToken.fulfilled,
    (state, { meta: { arg } }) => {
      const account = state.accounts.find(acc => acc.id === arg.userId);
      if (account) {
        account.publicToken = null;
      }
    },
  );
});
