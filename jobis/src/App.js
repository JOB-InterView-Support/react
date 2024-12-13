import React from 'react';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import AppRouter from './routers/router';


function App() {
  return (
    <>
      <Header />      
      <AppRouter /> 
      <Footer />
    </>
  );
}

export default App;

