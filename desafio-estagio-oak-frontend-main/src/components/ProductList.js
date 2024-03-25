import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Typography,
} from "@mui/material";
import { IoAddCircleOutline, IoArrowDown, IoArrowUp } from "react-icons/io5";
import { IoTrashBin } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import api from "./api";

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [sortByPriceDescending, setSortByPriceDescending] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/api/products");
      let sortedProducts = response.data;
      if (sortByPriceDescending) {
        sortedProducts = sortedProducts.sort((a, b) => b.price - a.price);
      } else {
        sortedProducts = sortedProducts.sort((a, b) => a.price - b.price);
      }
      setProducts(sortedProducts);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  const handleSortByPrice = () => {
    setSortByPriceDescending((prevState) => !prevState);
    fetchProducts(); 
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
      await api.delete(`/api/products/${productId}`, {
        headers: {
          'X-CSRF-Token': csrfToken,
        },
      });
      fetchProducts();
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
    }
  };

  return (
    <div>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom={2}
      >
        <Typography variant="h4">Product List</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<IoAddCircleOutline />}
          onClick={() => navigate("/create-product")}
        >
          Cadastrar Novo Produto
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>
                <Button onClick={handleSortByPrice}>
                  Valor {sortByPriceDescending ? <IoArrowDown /> : <IoArrowUp />}
                </Button>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell style={{ textAlign: "right" }}>
                  <Button onClick={() => handleDeleteProduct(product.id)}>
                    <IoTrashBin />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3} style={{ padding: "8px" }}>
                <Typography variant="body2">
                  Total: {products.length} produtos
                </Typography>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ProductList;
