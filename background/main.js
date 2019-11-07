/*global getAccessToken*/
/*global validate*/

function notifyUser(user) {
  browser.notifications.create({
    "type": "basic",
    "title": "Google info",
    "message": `Hi ${user.name}`
  });
}

function logError(error) {
  console.error(`Error: ${error}`);
}

/**
When the button's clicked:
- get an access token using the identity API
- use it to get the user's info
- show a notification containing some of it
*/

function openLoginGoogle(request, sender, sendResponse) {
  localStorage.setItem("classesInfo", request.classesInfo)
  getAccessToken().then(_ => {
    syncGoogleCalendar()
  })
  sendResponse({ response: true })
}


function doFetch(url, type = "GET", body) {
  const requestHeaders = new Headers();
  requestHeaders.append('Authorization', 'Bearer ' + localStorage.getItem("accesToken"));
  requestHeaders.append('Content-Type', 'application/json');
  const driveRequest = new Request(url, {
    method: type,
    headers: requestHeaders,
    body: JSON.stringify(body)
  });
  return fetch(driveRequest).then((response) => response.json());
}


function syncGoogleCalendar() {
  const classesInfo = JSON.parse(localStorage.getItem("classesInfo"))
  if (!classesInfo) return
  classesInfo.forEach((classe, id) => {
    console.log(classe)
    if (!classe.slot) return //is in future semester
    doFetch("https://www.googleapis.com/calendar/v3/calendars/primary/events?q=" + classe.name).then(existing => {
      //console.log("Existing", existing)
      const end = moment(classe.end)
      const startSlot = moment(classe.start).set({ hour: parseInt(classe.slot.start.split(":")[0]), minute: parseInt(classe.slot.start.split(":")[1]) }).day(classe.slot.Day)
      const endSlot = moment(startSlot).add(parseInt(classe.slot.length), "minutes")
      const body = {
        "kind": "calendar#event",
        "summary": classe.name,
        "start": {
          "dateTime": startSlot.format(),
          "timeZone": "Europe/Paris"
        },
        "end": {
          "dateTime": endSlot.format(),
          "timeZone": "Europe/Paris"

        },
        "recurrence": [
          "RRULE:FREQ=WEEKLY;UNTIL=" + end.format("YYYYMMDD")
        ],
        "transparency": "opaque",
      }
      // console.log(body)
      if (existing.items.length) {
        doFetch("https://www.googleapis.com/calendar/v3/calendars/primary/events/" + existing.items[0].id, "PATCH", body).then(console.log)
      } else {
        doFetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", "POST", body).then(console.log)
      }

    })
  })
}

browser.runtime.onMessage.addListener(openLoginGoogle);
//validate(null, localStorage.getItem("accesToken")).then(syncGoogleCalendar).catch(getAccessToken().then(_ => syncGoogleCalendar))
