"use client";

import { createContext, useContext, useState, useEffect } from "react";
import debounce from "lodash.debounce";

interface SearchContextType {
  search: string; // Debounced value (for API calls)
  immediateSearch: string; // Immediate value (for input display)
  setSearch: (value: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [immediateSearch, setImmediateSearch] = useState("");
  const [search, setDebouncedSearch] = useState("");

  useEffect(() => {
    const debounced = debounce((value: string) => {
      setDebouncedSearch(value);
    }, 300); // 300ms delay

    debounced(immediateSearch);

    return () => debounced.cancel();
  }, [immediateSearch]);

  return (
    <SearchContext.Provider
      value={{
        search,
        immediateSearch,
        setSearch: setImmediateSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};
