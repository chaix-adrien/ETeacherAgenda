class Historik {
  constructor() {
    console.log("create historic object")
    this.historic = this.getHistoric()
  }

  getHistoric() {
    //localStorage.removeItem("classesHistoric")
    const hist = JSON.parse(localStorage.getItem("classesHistoric")) || {}
    console.log("Get historic", hist)
    return hist
  }

  addClass(classeInfo, lastPublish) {
    console.log("add class to historic", classeInfo)
    this.historic[classeInfo.name] = this.historic[classeInfo.name] || {}
    this.historic[classeInfo.name]["classeInfo"] = classeInfo
    if (!this.historic[classeInfo.name][lastPublish.id])
      this.historic[classeInfo.name][lastPublish.id] = { date: Date.now(), unit: lastPublish.name, validated: false }
    console.log("save this historic", this.historic)
    localStorage.setItem("classesHistoric", JSON.stringify(this.historic))
  }

  setValidated(className, courseId, state) {
    console.log("set validated", className, courseId, state)
    this.historic[className][courseId].validated = state
    console.log("set THEN", JSON.stringify(this.historic))
    localStorage.setItem("classesHistoric", JSON.stringify(this.historic))
    console.log("after save", JSON.parse(localStorage.getItem("classesHistoric")))
  }

  getHistoricAsArray() {
    console.log("getHistoricArray")
    const out = []
    Object.entries(this.historic).forEach(([className, classHist]) => {
      Object.entries(classHist).forEach(([id, value]) => {
        if (id !== "classeInfo") {
          value.class = classHist.classeInfo
          value.id = parseInt(id)
          out.push(value)
        }
      })
    })
    console.log("getHistoricArray", out)
    return out
  }

  getNotValidated() {
    const out = this.getHistoricAsArray().filter(classe => !classe.validated).sort((a, b) => a.date - b.date)
    console.log("getNotValidated", this.getHistoricAsArray().filter(classe => !classe.validated))
    return out
  }
}

const Historic = new Historik()