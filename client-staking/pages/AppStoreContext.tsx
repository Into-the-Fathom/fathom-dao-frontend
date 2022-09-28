import React from "react";
import { RootStore } from "../store";

const a: any = null;

export const AppStoreContext = React.createContext(a);

export const AppStoreProvider = ({ children }) => {
    const store = RootStore
    return (
      <AppStoreContext.Provider value={store}>
        {children}
      </AppStoreContext.Provider>
    );
  };
  
export const UseAppStore = () => React.useContext(AppStoreContext);

export default AppStoreProvider;
