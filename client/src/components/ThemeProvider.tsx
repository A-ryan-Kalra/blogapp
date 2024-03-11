import React from "react";
import { useSelector } from "react-redux";

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useSelector((state: any) => state.theme);
  return (
    <div className={theme}>
      <div className="bg-white duration-[0.3s] transition-all ease-in-out text-gray-700 min-h-screen dark:text-gray-200 dark:bg-[rgb(3,6,13)]">
        {children}
      </div>
    </div>
  );
}

export default ThemeProvider;
