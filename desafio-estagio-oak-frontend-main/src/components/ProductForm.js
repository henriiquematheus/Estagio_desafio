import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Grid,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import api from "./api";

const ProductForm = ({ onSubmit }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "", // Mudança: mantenha como string para permitir valores decimais
    available: "no",
  });
  const [formErrors, setFormErrors] = useState({});
  const [csrfToken, setCsrfToken] = useState(null);

  useEffect(() => {
    api.get('/api/products/csrf', { withCredentials: true })
      .then(response => {
        setCsrfToken(response.data.csrfToken);
        console.log('CSRF Token:', response.data.csrfToken);
      })
      .catch(error => {
        console.error('Erro ao recuperar token CSRF', error);
      });
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Nome do produto é obrigatório";
    }
    if (!formData.description.trim()) {
      errors.description = "Descrição do produto é obrigatória";
    }
    if (!formData.price.trim()) {
      errors.price = "Valor do produto é obrigatório";
    } else if (isNaN(parseFloat(formData.price))) {
      errors.price = "Valor do produto deve ser numérico";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (!csrfToken) {
        console.error("Token CSRF vazio");
        return;
      }

      // Mudança: Parse do preço para float
      const price = parseFloat(formData.price);
      
      const available = formData.available === "yes";
      
      const formDataToSend = {
        name: formData.name,
        description: formData.description,
        price: price,
        available: available,
      };

      api.post('/api/products', formDataToSend, {
        headers: {
          'X-CSRF-Token': csrfToken,
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          console.log(response.data);
          setFormData({
            name: "",
            description: "",
            price: "",
            available: "no",
          });
          navigate("/product-list");
        })
        .catch((error) => {
          console.error("Erro ao enviar dados do formulário", error);
        });
    }
  };

  return (
    <Box sx={{ m: 2 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Cadastrar Produto
      </Typography>
      <Divider sx={{ my: 2 }} />
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={10} md={3}>
            <TextField
              fullWidth
              label="Nome do Produto"
              variant="outlined"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
            />
          </Grid>
          <Grid item xs={10} md={3}>
            <TextField
              fullWidth
              label="Descrição do Produto"
              variant="outlined"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={!!formErrors.description}
              helperText={formErrors.description}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={10} md={3}>
            <TextField
              fullWidth
              label="Valor do Produto"
              variant="outlined"
              name="price"
              type="number" // Mudança: permitir valores decimais
              value={formData.price}
              onChange={handleChange}
              error={!!formErrors.price}
              helperText={formErrors.price}
              sx={{ mt: 2 }}
            />
          </Grid>
        </Grid>
        <FormControl component="fieldset" sx={{ mt: 2 }}>
          <FormLabel component="legend">Disponível para venda</FormLabel>
          <RadioGroup
            row
            name="available"
            value={formData.available}
            onChange={handleChange}
          >
            <FormControlLabel value="yes" control={<Radio />} label="Sim" />
            <FormControlLabel value="no" control={<Radio />} label="Não" />
          </RadioGroup>
        </FormControl>
        <Grid container alignItems="flex-start" sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" type="submit">
            Cadastrar
          </Button>
        </Grid>
      </form>
    </Box>
  );
};

export default ProductForm;
