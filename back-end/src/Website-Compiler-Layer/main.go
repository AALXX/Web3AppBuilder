package main

import (
	"github.com/gin-gonic/gin"

	ExtractProjectData "website_compiler/Services"
)

func main() {
	router := gin.Default()

	router.POST("/api/make-website", ExtractProjectData.CompileWebsite)

	router.Run("192.168.72.81:8200")
}
