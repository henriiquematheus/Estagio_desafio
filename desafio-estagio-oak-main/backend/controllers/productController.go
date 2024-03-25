package controllers

import (
	"backend-desafio-estagio-oak/db"
	"backend-desafio-estagio-oak/models"
	"context"
	"log"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ProductController struct {
	Database *db.Database
}

func (pc *ProductController) CreateProduct(c *fiber.Ctx) error {
	var product models.Product
	if err := c.BodyParser(&product); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Pedido Inválido"})
	}

	if product.Price < 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Preço não pode ser negativo"})
	}

	existingProduct := pc.getProductByName(product.Name)
	if existingProduct != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Já tem um produto com esse nome"})
	}

	_, err := pc.Database.Collection.InsertOne(context.Background(), product)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Falha ao cadastrar produto"})
	}

	return c.Status(fiber.StatusCreated).JSON(product)
}

func (pc *ProductController) getProductByName(name string) *models.Product {
	var product models.Product
	err := pc.Database.Collection.FindOne(context.Background(), bson.M{"name": name}).Decode(&product)
	if err != nil {
		return nil
	}
	return &product
}

func (pc *ProductController) GetAllProducts(c *fiber.Ctx) error {

	cursor, err := pc.Database.Collection.Find(context.Background(), bson.M{})
	if err != nil {
		log.Println("Erro ao buscar produtos:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Falha ao buscar produtos"})
	}
	defer cursor.Close(context.Background())

	var products []models.Product
	if err := cursor.All(context.Background(), &products); err != nil {
		log.Println("Erro ao buscar produtos:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Falha ao buscar produtos"})
	}

	return c.JSON(products)
}

func (pc *ProductController) UpdateProduct(c *fiber.Ctx) error {
	idParam := c.Params("id")
	objID, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ID de produto inválido"})
	}

	var updatedProduct models.Product
	if err := c.BodyParser(&updatedProduct); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Pedido inválido"})
	}

	// Atualizar apenas os campos modificados
	update := bson.M{}
	if updatedProduct.Name != "" {
		update["name"] = updatedProduct.Name
	}
	if updatedProduct.Description != "" {
		update["description"] = updatedProduct.Description
	}
	if updatedProduct.Price != 0 {
		update["price"] = updatedProduct.Price
	}
	if updatedProduct.Available {
		update["available"] = updatedProduct.Available
	}

	// Atualizar o produto no MongoDB usando o ID convertido
	_, err = pc.Database.Collection.UpdateOne(context.Background(), bson.M{"_id": objID}, bson.M{"$set": update})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Falha ao atualizar produto"})
	}

	return c.JSON(updatedProduct)
}

func (pc *ProductController) DeleteProduct(c *fiber.Ctx) error {

	id := c.Params("id")

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		log.Println("Erro ao converter ID para ObjectID:", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ID de produto inválido"})
	}

	_, err = pc.Database.Collection.DeleteOne(context.Background(), bson.M{"_id": objID})
	if err != nil {
		log.Println("Erro ao excluir produto:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Falha ao excluir produto"})
	}

	return c.SendStatus(fiber.StatusNoContent)
}
