package routes

import (
	"backend-desafio-estagio-oak/controllers"
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cache"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/csrf"
)

func SetupProductRoutes(app *fiber.App, pc *controllers.ProductController) {
	productGroup := app.Group("/api/products")

	productGroup.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:3000",
		AllowCredentials: true,
	}))

	productGroup.Use(csrf.New(csrf.Config{
		KeyLookup:  "header:X-CSRF-Token",
		CookieName: "__csrf",
	}))

	productGroup.Get("/csrf", func(c *fiber.Ctx) error {
		token := c.Cookies("__csrf")
		return c.JSON(fiber.Map{"csrfToken": token})
	})

	productGroup.Use(func(c *fiber.Ctx) error {
		c.Set("X-XSS-Protection", "1; mode=block")
		return c.Next()
	})

	productGroup.Get("/", cache.New(cache.Config{
		Next: func(c *fiber.Ctx) bool {
			log.Println("Cache", c.Path())
			return true
		},
		Expiration:   2 * time.Minute,
		CacheControl: true,
	}), pc.GetAllProducts)

	productGroup.Post("/", pc.CreateProduct)
	productGroup.Put("/:id", pc.UpdateProduct)
	productGroup.Delete("/:id", pc.DeleteProduct)
}
