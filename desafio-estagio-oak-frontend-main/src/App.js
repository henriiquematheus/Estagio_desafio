// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, CssBaseline, Box } from '@mui/material';
import { Header, Menu } from './components/Layout';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';

const App = () => {
  return (
    <Router>
      <CssBaseline />
      <Header />
      <Box sx={{ display: 'flex' }}>
        <Menu />
        <Container sx={{ mt: '20px' }}>
          <Routes> 
            <Route path="/create-product" element={<ProductForm />} /> 
            <Route path="/product-list" element={<ProductList />} /> 
            <Route path="/" element={<ProductForm />} />
          </Routes> 
        </Container>
      </Box>
    </Router>
  );
};

export default App;