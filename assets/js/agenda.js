
function strToDate(str, end = false) {
	let date = moment(str.split(",")[1], "MMMM D")
	if (!date.isValid())
		date = moment(str.split(",")[1] + " " + (moment().year() + 1), "MMMM D YYYY")
	if (end && date.isBefore(moment())) {
		return date.add(1, "years")
	} else {
		return date
	}
}

function loadClasses() {
	const classesRow = $("h1").parent().parent().parent().find("tr")
	const infos = []
	for (let i = 4; i < classesRow.length; i++) {
		const childs = $(classesRow[i]).children()
		infos.push({
			name: childs[3].innerText + " " + childs[4].innerText,
			start: strToDate(childs[5].innerText).toString(),
			end: strToDate(childs[6].innerText, true).toString()
		})
	}
	localStorage.setItem("classesInfo", JSON.stringify(infos))
}

function syncCalendar() {
	const classes = JSON.parse(localStorage.getItem("classesInfo"))
	if (!classes) {
		return $('<p/>').text('Allez sur la page "Classes" pour mettre à jour les informations sur vos classes').css("margin-left", 10).click(function () {
			browser.runtime.sendMessage({ classesInfo: localStorage.getItem("classesInfo") });
		}).appendTo($("h1"))
	}
	$("div[title]").each(function (id) {
		let objTxt = this.title.replace("minutes", "")
		objTxt = objTxt.slice(0, -1);
		objTxt = objTxt.replace(/\./g, "\",")
		objTxt = objTxt.replace(/: /g, "\":\"")
		objTxt = objTxt.replace("Starting hour", "start")
		objTxt = objTxt.replace("Ending hour", "end")
		objTxt = objTxt.replace("Lesson length", "length")
		objTxt = objTxt.replace(/ /g, "\"")
		objTxt = "{\"" + objTxt + "}"
		const concernedClasse = classes.find(classe => this.innerText.includes(classe.name))
		if (!concernedClasse) return
		concernedClasse.slot = JSON.parse(objTxt)
	})

	localStorage.setItem("classesInfo", JSON.stringify(classes))
	$('<button/>').text('Sync to Google Calendar').css("margin-left", 10)
		.click(() => browser.runtime.sendMessage({ classesInfo: localStorage.getItem("classesInfo") }))
		.appendTo($("h1"))
	$("<p/>").text("don't forget to display future semester if you want to sync incomming classes.").appendTo($("h1"))
}
