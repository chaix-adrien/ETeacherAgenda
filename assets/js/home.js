
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


  const classes = JSON.parse(localStorage.getItem("classesInfo"))
  if (!classes) {
    $("<h1/>").text("Go to your classes sumary to load usefull classes infos").appendTo($("h1"))
    return
  }
  //search all current classes
  const currentClass = $("img[alt='Enter Class']")
  for (let i = 0; i < currentClass.length; i++) {
    const classe = $(currentClass[i]).parent().parent().parent()
    const classeInfo = classes.find(c => c.name === classe[0].cells[1].innerText)
    if (!classeInfo) return

    //Fetch Exo page in background
    let client = new HttpClient();
    let response = client.getSync(getPublishContentURL(classeInfo.courseID));
    let parser = new DOMParser();
    var doc = parser.parseFromString(response, 'text/html');
    //Parse response and add button
    var checkboxs = Array.prototype.slice.call($(doc).find(".publish-unit"))
    const lastPublish = checkboxs.find((d) => !d.checked).parentNode.childNodes[1].textContent
    $('<button/>').text(lastPublish).css("margin-left", 10)
      .click(() => { })
      .appendTo($(currentClass[i]).parent())
  }
}