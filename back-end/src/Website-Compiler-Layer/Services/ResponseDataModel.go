package ExtractProjectData

type MaterialColor struct {
	Red   int `json:"r"`
	Green int `json:"g"`
	Blue  int `json:"b"`
	Alpha int `json:"a"`
}

//*project materials structs
type ProjectMaterialsData struct {
	Name    string        `json:"name"`
	Diffuse string        `json:"diffuse"`
	Color   MaterialColor `json:"tint"`
}

type ProjectMaterials struct {
	Materials []ProjectMaterialsData `json:"materials"`
}

//*main project data structs
type ObjectComponents struct {
	ComponentName string `json:"name"`
	ComponentType string `json:"type"`
	PargraphType  string `json:"paragraphType"`
	TextContent   string `json:"textContent"`
	FontSize      int    `json:"font-Size"`
	Width         int    `json:"width"`
	Height        int    `json:"height"`
	MaterialName  string `json:"materialName"`
}

type PageObjects struct {
	ObjectName       string             `json:"name"`
	ObjectComponents []ObjectComponents `json:"components"`
}

type PageConfig struct {
	Name         string `json:"name"`
	Width        int    `json:"width"`
	Height       int    `json:"height"`
	MaterialName string `json:"materialName"`
}

type Page struct {
	PageConfig PageConfig    `json:"pageConfig"`
	Objects    []PageObjects `json:"objects"`
}

type prjData struct {
	ProjectName string `json:"name"`
	Id          int    `json:"id"`
	Page        Page   `json:"page"`
}

type responsePrjPageData struct {
	Error         bool             `json:"error"`
	PrjPages      ProjectPages     `json:"projectPages"`
	PageData      prjData          `json:"pageData"`
	MaterialsData ProjectMaterials `json:"materialsData"`
}

//* project pages
type ProjectPages struct {
	Pages []ProjectPagesData `json:"pages"`
}

type ProjectPagesData struct {
	PageName        string `json:"name"`
	PageDescription string `json:"description"`
	PrjPageFile     string `json:"file"`
}
