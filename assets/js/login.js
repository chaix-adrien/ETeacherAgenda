function handleLoginPage() {
  const rememberMe = localStorage.getItem("rememberMe") === "y"
  const pwd = localStorage.getItem("password")
  const username = localStorage.getItem("username")
  const autoLogin = localStorage.getItem("autoLogin") === "y"
  $("#UserName").val(username)
  $("#Password").val(pwd)
  console.log(username, pwd, rememberMe, autoLogin)
  if (autoLogin && pwd && username) {
    $("#SubmitLoginForm").click()
  }
  //create button & checkbox
  $('<input />', { type: 'checkbox', id: 'rememberMe', text: "coucou", checked: rememberMe }).appendTo($("#SubmitLoginForm").parent());
  $("<label>Remember me</label>").appendTo($("#SubmitLoginForm").parent())

  $("#SubmitLoginForm").click(() => {
    localStorage.setItem("rememberMe", $("#rememberMe")[0].checked ? "y" : "n")
    if ($("#rememberMe")[0].checked) {
      localStorage.setItem("username", $("#UserName").val())
      localStorage.setItem("password", $("#Password").val())
    }
  })
  //check if need to auto login
}