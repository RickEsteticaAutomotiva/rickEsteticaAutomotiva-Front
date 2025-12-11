import { createContext, useContext, useState, useCallback, useEffect } from "react";

const DashboardRefreshContext = createContext(null);

export default function DashboardRefreshProvider({ children }) {
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshDashboard = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshDashboard();
    }, 8000); // 5 segundos (pode mudar)

    return () => clearInterval(interval);
  }, [refreshDashboard]);

  return (
    <DashboardRefreshContext.Provider value={{ refreshKey, refreshDashboard }}>
      {children}
    </DashboardRefreshContext.Provider>
  );
}

export function useDashboardRefresh() {
  return useContext(DashboardRefreshContext);
}
