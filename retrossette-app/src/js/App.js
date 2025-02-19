import React from 'react';
import { ThemeProvider } from '@material-tailwind/react';
import NavbarDefault from './Navbar';

function App() {
  return (
    <ThemeProvider>
      <NavbarDefault />
    </ThemeProvider>
  );
}

export default App;