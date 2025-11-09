import React, {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

// Define the shape of the context
interface DarkModeContextType {
  darkMode: boolean;
  toggle: () => void;
}

// Create the context with a default value
export const DarkModeContext = createContext<DarkModeContextType>({
  darkMode: false,
  toggle: () => {},
});

// Define the provider props
interface DarkModeProviderProps {
  children: ReactNode;
}

export const DarkModeContextProvider: React.FC<DarkModeProviderProps> = ({
  children,
}) => {
  const [darkMode, setDarkMode] = useState<boolean>(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  const toggle = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <DarkModeContext.Provider value={{ darkMode, toggle }}>
      {children}
    </DarkModeContext.Provider>
  );
};
