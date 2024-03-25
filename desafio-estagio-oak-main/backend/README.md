
# backend

O projeto foi feito em go persistindo os dados no mongodb, foi utilizado go fiber para melhor manipulação das rotas e dos controllers. foi utilizado cache para melhorar o desempenho, e as rotas estão mais seguras evitando ataques xss e crsf.
Para rodar o projeto `cd backend` `go run main.go`


## Documentação da API

Para fazer uma requisição POST ou PUT, é necessario passar o token csrf no header para ser validado. para pegar o token 

```http
  GET localhost:8000/api/products/csrf
```

#### Retorna todos os itens

```http
  GET localhost:8000/api/products
```

#### Posta um item

```http
  POST localhost:8000/api/products
```

#### Atualiza um item

```http
  PUT localhost:8000/api/products${id}
```

#### Deleta um item

```http
  DELETE localhost:8000/api/products${id}
```


