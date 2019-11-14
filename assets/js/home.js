
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

function homePage() {
  function getLastExoPublished(classId) {
    let url = getPublishContentURL(classId)
    let client = new HttpClient();
    let response = client.getSync(url);
    let parser = new DOMParser();
    var htmlDoc = parser.parseFromString(response, 'text/html');
    return getLastPublishedOfClassObject(htmlDoc, skip)
  }


  const classes = localStorage.getItem("classesInfo")
  if (!classes) {
    $("<h1/>").text("Go to your classes sumary to load usefull classes infos").appendTo($("h1"))
    return
  }

  const currentClass = $("img[alt='Enter Class']")
  for (let i = 0; i < currentClass.length; i++) {
    const classe = $(currentClass[i]).parent().parent().parent()
    console.log(classe)
  }
}