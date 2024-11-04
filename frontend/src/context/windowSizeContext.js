import React, { createContext, useContext } from 'react';
import useWindowSize from '../hooks/useWindowSize.js';

const WindowSizeContext = createContext();

export const WindowSizeProvider = ({ children }) => {
  const windowSize = useWindowSize();
  return (
    <WindowSizeContext.Provider value={windowSize}>
      {children}
    </WindowSizeContext.Provider>
  );
};

export const useWindowSizeContext = () => useContext(WindowSizeContext);
