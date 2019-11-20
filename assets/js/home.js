var HttpClient = function () {
  this.get = function (aUrl, aCallback) {
    var anHttpRequest = new XMLHttpRequest();
    anHttpRequest.onreadystatechange = function () {
      if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
        aCallback(anHttpRequest.responseText);
    }

    anHttpRequest.open("GET", aUrl, true);
    anHttpRequest.send(null);
  }
  this.getSync = function (theUrl, cookie) {
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.open("GET", theUrl, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
  }
}

function getBaseURL() {
  var curURL = document.URL
  curURL = curURL.substring(0, curURL.indexOf("officeEX/")) + "officeEX/"
  return curURL
}

function getPublishContentURL(classId) {
  console.log("CLASS", classId)
  let url = getBaseURL() + "courses/OneCourse/Materials.asp?CourseID=" + classId
  return url
}


function homePage() {
  function getLastExoPublished(classId) {
    let url = getPublishContentURL(classId)
    let client = new HttpClient();
    let response = client.getSync(url);
    let parser = new DOMParser();
    var htmlDoc = parser.parseFromString(response, 'text/html');
    return getLastPublishedOfClassObject(htmlDoc, skip)
  }

  function addNoDataWarning() {
    if (!classes) {
      $("<h1/>").text("Go to your classes sumary to load usefull classes infos").appendTo($("h1"))
      return true
    }
    return false
  }

  function handleCurrentClasses() {
    function fetchClassPubhlish(courseID) {
      let client = new HttpClient();
      let response = client.getSync(getPublishContentURL(courseID));
      let parser = new DOMParser();
      return parser.parseFromString(response, 'text/html');
    }

    function getLastPublish(doc) {
      const checkboxs = Array.prototype.slice.call($(doc).find(".publish-unit"))
      const lastPublish = checkboxs.find((d) => !d.checked).parentNode.childNodes[1].textContent
      const lastPublishId = lastPublish.match(/\d+/g).map(Number)[0]
      return { name: lastPublish, id: lastPublishId }
    }

    function addPublishButton(appendTo, lastPublish, classeInfo) {
      $('<button/>').text(lastPublish.name).css("margin-left", 10)
        .click(() => window.open(getPublishContentURL(classeInfo.courseID), '_blank'))
        .appendTo($(appendTo).parent())
    }

    const currentClass = $("img[alt='Enter Class']")
    console.log("handleCurrent Classs", currentClass)
    for (let i = 0; i < currentClass.length; i++) {
      const classe = $(currentClass[i]).parent().parent().parent()
      console.log("handle class", classe)
      const classeInfo = classes.find(c => c.name === classe[0].cells[1].innerText)
      if (!classeInfo) return
      console.log("classInfo", classeInfo)
      const classDoc = fetchClassPubhlish(classeInfo.courseID)
      const lastPublish = getLastPublish(classDoc)
      addPublishButton(currentClass[i], lastPublish, classeInfo)
      if (!historic[classeInfo.name][lastPublish.id] || Date.now() - historic[classeInfo.name][lastPublish.id].date < 3600000 * 1) { //add only if older than (3600000 = 1h) after class end 
        Historic.addClass(classeInfo, lastPublish)
      }
      console.log("end", classeInfo)
      //addClassToHistoric(classeInfo, lastPublish)
    }
    console.log("end handle class")

  }

  function handleNotValidatedClasses() {
    const notValidated = Historic.getNotValidated()
    console.log("handleHisto", notValidated)

    function addDateLine(date) {
      $("<h3/>").text(date.format("dddd") + " " + date.format('LL')).insertBefore(anchor)
    }

    function addCourseLine(course, courseDate) {
      const div = $("<div/>").insertBefore(anchor)
      const title = $("<h4/>").text(course.class.name + " -- " + course.unit).appendTo(div)
      const b1 = $("<button/>").text("Missed").css("margin-left", "10px").css("background-color", "#e57373").click(() => {
        Historic.setValidated(course, "missed")
        div.remove();
      }).appendTo(div)
      const b2 = $("<button/>").text("Done").css("margin-left", "10px").css("background-color", "#4caf50").click(() => {
        Historic.setValidated(course, "done")
        div.remove();
      }).appendTo(div)
    }

    const anchor = $("h2:contains('Lessons On Air')")
    let lastDate = moment().year(2010)
    if (notValidated.length)
      $("<h2/>").text("Waiting for report.").insertBefore(anchor)
    notValidated.forEach(course => {
      const courseDate = moment(course.date)
      if (courseDate.diff(lastDate, 'days') >= 1)
        addDateLine(courseDate)
      addCourseLine(course, courseDate)
    })
  }


  const classes = JSON.parse(localStorage.getItem("classesInfo"))
  /*console.log("handle classes", classes)
  localStorage.removeItem("classesHistoric")
  const classeInfo = classes.find(c => c.name === "Build Your First App Beginners - ELEM - FRA 47")
  console.log("info", classeInfo, localStorage.getItem("classesHistoric"))
  let historic = JSON.parse(localStorage.getItem("classesHistoric"))
  console.log("histo start", historic)
  historic = historic || {}
  historic["Build Your First App Beginners - ELEM - FRA 47"] = historic["Build Your First App Beginners - ELEM - FRA 47"] || {}
  historic["Build Your First App Beginners - ELEM - FRA 47"]["classeInfo"] = classeInfo
  historic["Build Your First App Beginners - ELEM - FRA 47"][9] = { date: Date.now(), unit: "Unit 9: beauty", validated: false }
  console.log("pre save", historic)
  localStorage.setItem("classesHistoric", JSON.stringify(historic))*/
  if (addNoDataWarning()) return
  handleCurrentClasses()
  handleNotValidatedClasses()
  //search all current classes.

}
//http://office.eteachergroup.com/eTeachert5774041-6F54C40B5B1C372CD8D5A54685BB49C5/teachers/OfficeEx/login/startIW.asp?LessonID=2107569