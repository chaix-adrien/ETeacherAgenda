class Historik {
  constructor() {
    console.log("create historic object")
    this.historic = this.getHistoric()
  }

  getHistoric() {
    const hist = this.historic || JSON.parse(localStorage.getItem("classesHistoric")) || {}
    console.log("Get historic", hist)
    return hist
  }

  addClass(classeInfo, lastPublish) {
    console.log("add class to historic", classeInfo)
    this.historic[classeInfo.name] = this.historic[classeInfo.name] || {}
    this.historic[classeInfo.name]["classeInfo"] = classeInfo
    this.historic[classeInfo.name][lastPublish.id] = { date: Date.now(), unit: lastPublish.name, validated: false }
    console.log("save this historic", this.historic)
    localStorage.setItem("classesHistoric", JSON.stringify(this.historic))
  }

  setValidated(course, state) {
    this.getHistoricAsArray().find(c => c === course).validated = state
    localStorage.setItem("classesHistoric", JSON.stringify(this.historic))
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
    console.log("getNotValidated", out)
    return out
  }
}

const Historic = new Historik()