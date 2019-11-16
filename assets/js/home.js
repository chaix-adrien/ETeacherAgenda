
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

    function handleHistoric(classeInfo, lastPublish) {
      let historic = JSON.parse(localStorage.getItem("classesHistoric"))
      console.log("post historic", historic)
      historic = historic || {}
      historic[classeInfo.name] = historic[classeInfo.name] || []
      console.log("before historic", historic)

      if (!historic[classeInfo.name][lastPublish.id] || Date.now() - historic[classeInfo.name][historic].date < 3600000 * 2) //if old then ignore(3600000 = 1h)
      {
        console.log("asve it")
        historic[classeInfo.name]["classeInfo"] = classeInfo
        historic[classeInfo.name][lastPublish.id] = { date: Date.now(), unit: lastPublish, validated: false }
        console.log("pre save", historic)
        localStorage.setItem("classesHistoric", JSON.stringify(historic))
        console.log("post save")

      }
      console.log("next historic", historic)
    }

    const currentClass = $("img[alt='Enter Class']")
    console.log("")
    for (let i = 0; i < currentClass.length; i++) {
      const classe = $(currentClass[i]).parent().parent().parent()
      console.log("handle class", classe)
      const classeInfo = classes.find(c => c.name === classe[0].cells[1].innerText)
      if (!classeInfo) return
      console.log("classInfo", classeInfo)
      const classDoc = fetchClassPubhlish(classeInfo.courseID)
      const lastPublish = getLastPublish(classDoc)
      addPublishButton(currentClass[i], lastPublish, classeInfo)
      console.log("end", classeInfo)
      handleHistoric(classeInfo, lastPublish)

    }
  }


  const classes = JSON.parse(localStorage.getItem("classesInfo"))
  console.log("handle classes", classes)
  if (addNoDataWarning()) return
  handleCurrentClasses()
  //search all current classes.

}
//http://office.eteachergroup.com/eTeachert5774041-6F54C40B5B1C372CD8D5A54685BB49C5/teachers/OfficeEx/login/startIW.asp?LessonID=2107569