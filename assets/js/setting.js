function settingPage() {
  const autoLogin = localStorage.getItem("autoLogin") === "y"

  //create button & checkbox
  $('<input />', { type: 'checkbox', id: 'autoLogin', checked: autoLogin })
    .click(function (e) {
      console.log("clicked", e)
      localStorage.setItem("autoLogin", e.target.checked ? "y" : "n")
    }).appendTo($("#SubmitUpdateTeacherDetails").parent());
  $("<label>Auto Login</label>").appendTo($("#SubmitUpdateTeacherDetails").parent())

  $('<button/>').text('Remove stored credentials').css("margin-left", 10)
    .click(() => {
      localStorage.removeItem("username")
      localStorage.removeItem("password")
      localStorage.setItem("rememberMe", "n")
    })
    .appendTo($("#SubmitUpdateTeacherDetails").parent())
}