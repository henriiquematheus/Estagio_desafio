package main

import (
	"backend-desafio-estagio-oak/controllers"
	"backend-desafio-estagio-oak/db"
	"backend-desafio-estagio-oak/routes"
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cache"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {

	connectionString := "mongodb+srv://admin:admin@products-oak.mavbd9p.mongodb.net/?retryWrites=true&w=majority&appName=products-oak"
	dbName := "oak"
	collectionName := "products"

	database, err := db.NewDatabase(connectionString, dbName, collectionName)
	if err != nil {
		log.Fatal(err)
	}

	pc := &controllers.ProductController{
		Database: database,
	}

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:3000",
		AllowCredentials: true,
	}))

	//middleware para proteção contra injeção de SQL, XSS e CSRF
	app.Use(cache.New(cache.Config{
		Next: func(c *fiber.Ctx) bool {
			return c.Query("noCache") != "true"
		},
		Expiration: 30 * time.Minute,
		KeyGenerator: func(c *fiber.Ctx) string {
			return c.OriginalURL()
		},
	}))

	routes.SetupProductRoutes(app, pc)

	log.Fatal(app.Listen(":8000"))
}
