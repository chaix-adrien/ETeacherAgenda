function reportPage() {
  function getReportTable() {
    var fullTab = document.getElementById("UpdateTeacherCourseSalaryFrm")
    var tabContent = [...fullTab.childNodes]
    tabContent = tabContent.find((obj) => obj.tagName === "TABLE")
    tabContent = [...tabContent.childNodes]
    tabContent = tabContent.find((obj) => obj.tagName === "TBODY")
    tabContent = [...tabContent.childNodes]
    tabContent = tabContent.filter((obj) => obj.tagName === "TR")
    tabContent.shift()
    tabContent.shift()
    tabContent.splice(-2, 2)
    var out = new Array();
    var i = 0;
    tabContent.forEach((obj, id) => {
      if ((id % 2) === 0) {
        out[i] = { id: null, confirm: null, unitSelect: null };
        out[i].className = obj.children[0].innerText
      } else {
        out[i].confirm = obj.getElementsByTagName("SELECT")[0]
        out[i].unitSelect = obj.getElementsByTagName("SELECT")[3]
        out[i].date = moment(obj.children[0].innerText.split(' ')[0], "DD-MM-YYYY")
        i++;
      }
    })
    return out
  }

  function fillReportForm() {
    const reportTable = getReportTable()
    reportTable.forEach(row => {
      const classe = Historic.getCourseByDate(row.className, row.date)
      if (!classe) {
        row.confirm.selectedIndex = 1
      } else {
        console.log(classe.validated)
        if (classe.validated === "missed")
          row.confirm.selectedIndex = 2
        else if (classe.validated === "done")
          row.confirm.selectedIndex = 1
        row.unitSelect.selectedIndex = classe.id
      }
      console.log(classe)
    })
  }

  console.log("HANDLE", handleNotValidatedClasses)
  handleNotValidatedClasses($("h1:contains('Payment Report Courses')"), () => !$("#IsNotReportedOnly")[0].checked ? fillReportForm() : null)
  if (!$("#IsNotReportedOnly")[0].checked) {
    fillReportForm()
  }
}