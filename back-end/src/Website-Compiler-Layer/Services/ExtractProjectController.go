package ExtractProjectData

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

/**
Get project data files
*/
func extractProjectPageData(context *gin.Context) responsePrjPageData {

	resp, err := http.Get("http://192.168.72.81:7000/api/design-tool-manager/get-project-json-data/kw8rybzkj4ova9uyj1/TestProject")
	if err != nil {
		log.Printf("Request Failed: %s", err)
	}

	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)

	//* Unmarshal result
	response := responsePrjPageData{}
	err = json.Unmarshal(body, &response)

	if err != nil {
		log.Printf("Reading body failed: %s", err)
	}

	return response
}

//*binary search the material
func findMaterialByName(imagesArray []ProjectMaterialsData, targetMatName string) ProjectMaterialsData {
	begin := 0

	finish := len(imagesArray) - 1

	for begin <= finish {
		middle := (begin + finish) / 2

		if imagesArray[middle].Name == targetMatName {
			return imagesArray[middle]
		}

		if imagesArray[middle].Name < targetMatName {
			begin = middle + 1
		} else {
			finish = middle - 1
		}
	}

	if begin == len(imagesArray) || imagesArray[finish].Name != targetMatName {
		return ProjectMaterialsData{}
	}

	return ProjectMaterialsData{}
}

/**
-----------------------------------------------------------------------------------------------
|							 Create the HTML files from json data							  |
-----------------------------------------------------------------------------------------------
*/
func CompileHtmlFile(extractedPageData responsePrjPageData) {
	exampleFile, err := os.Open("Resources/exampleHtml.txt")

	if err != nil {
		log.Printf("Reading body failed: %s", err)
		return
	}

	examplePageData := make([]byte, 3000)
	exampleFile.Read(examplePageData)
	exampleFile.Close()

	bodyString := ""

	for j := 0; j < len(extractedPageData.PageData.Page.Objects); j++ {

		if len(extractedPageData.PageData.Page.Objects) == 0 {
			log.Printf("Page has no content")
			break
		}

		for k := 0; k < len(extractedPageData.PageData.Page.Objects[j].ObjectComponents); k++ {

			switch extractedPageData.PageData.Page.Objects[j].ObjectComponents[k].ComponentType {
			case "text":
				bodyString = bodyString + ("<" + extractedPageData.PageData.Page.Objects[j].ObjectComponents[k].PargraphType + ` class="` + extractedPageData.PageData.Page.Objects[j].ObjectName + `Class" >` + extractedPageData.PageData.Page.Objects[j].ObjectComponents[k].TextContent + "</" + extractedPageData.PageData.Page.Objects[j].ObjectComponents[k].PargraphType + `>` + "\n")
			case "sprite":
				bodyString = bodyString + `<img class="` + extractedPageData.PageData.Page.Objects[j].ObjectName + `Class" src="` + findMaterialByName(extractedPageData.MaterialsData.Materials, extractedPageData.PageData.Page.Objects[j].ObjectComponents[k].MaterialName).Diffuse + `"/>` + "\n"
			}
		}

	}

	replacer := strings.NewReplacer(
		"{name}", extractedPageData.PrjPages.Pages[0].PageName,
		"{body}", bodyString,
	)

	customPage := replacer.Replace(string(examplePageData))

	htmlPage, err := os.Create("Resources/index.html")

	if err != nil {
		log.Printf("Reading body failed: %s", err)
		return
	}

	htmlPage.Write([]byte(customPage))
	htmlPage.Close()
}

/**
-----------------------------------------------------------------------------------------------
|							 Create the CSS files from json data							  |
-----------------------------------------------------------------------------------------------
*/

func CompileCSSFile(extractedPageData responsePrjPageData) {
	exampleFile, err := os.Open("Resources/exampleCss.txt")

	if err != nil {
		log.Printf("Reading body failed: %s", err)
		return
	}

	examplePageData := make([]byte, 3000)
	exampleFile.Read(examplePageData)
	exampleFile.Close()

	bodyCssString := CreateBodyCssClass(findMaterialByName(extractedPageData.MaterialsData.Materials, extractedPageData.PageData.Page.PageConfig.MaterialName).Color)
	csstring := ""

	for j := 0; j < len(extractedPageData.PageData.Page.Objects); j++ {

		if len(extractedPageData.PageData.Page.Objects) == 0 {
			log.Printf("Page has no content")
			break
		}

		for k := 0; k < len(extractedPageData.PageData.Page.Objects[j].ObjectComponents); k++ {

			switch extractedPageData.PageData.Page.Objects[j].ObjectComponents[k].ComponentType {

			case "text":
				csstring = csstring + (CreateTextCssClass(extractedPageData.PageData.Page.Objects[j].ObjectName, extractedPageData.PageData.Page.Objects[j].ObjectComponents[k].FontSize) + "\n")
			case "sprite":
				csstring = csstring + CreateImageCssClass(extractedPageData.PageData.Page.Objects[j].ObjectName, extractedPageData.PageData.Page.Objects[j].ObjectComponents[k].Width, extractedPageData.PageData.Page.Objects[j].ObjectComponents[k].Height) + "\n"

			}
		}

	}

	replacer := strings.NewReplacer(
		"{bodyCss}", bodyCssString,
		"{css}", csstring,
	)

	customPage := replacer.Replace(string(examplePageData))
	log.Println(string(customPage))

	htmlPage, err := os.Create("Resources/Page.css")

	if err != nil {
		log.Printf("Reading body failed: %s", err)
		return
	}

	htmlPage.Write([]byte(customPage))
	htmlPage.Close()
}

func CreateBodyCssClass(PageColor MaterialColor) string {
	return "body" + "{ \n" +
		"background-color: rgb(" + strconv.Itoa(PageColor.Red) + "," + strconv.Itoa(PageColor.Green) + "," + strconv.Itoa(PageColor.Blue) + "); \n" +
		"} \n"
}

func CreateImageCssClass(objectName string, width int, height int) string {

	return "." + objectName + "Class" + "{ \n" +
		"width: " + strconv.Itoa(width/4) + "px;\n" +
		"height: " + strconv.Itoa(height/4) + "px;\n" +
		"} \n"
}

func CreateTextCssClass(objectName string, fontSize int) string {
	return "." + objectName + "Class" + "{ \n" +
		"font-size: " + strconv.Itoa(fontSize) + "px;\n" +
		"} \n"
}

/**
compile the recived project data into a website
*/
func CompileWebsite(context *gin.Context) {

	extractedPageData := extractProjectPageData(context)
	CompileHtmlFile(extractedPageData)
	CompileCSSFile(extractedPageData)

}
