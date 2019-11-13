function handleLoginPage() {
  const checked = localStorage.getItem("rememberMe") === "y"
  const pwd = localStorage.getItem("password")
  const username = localStorage.getItem("username")


  if (checked && pwd && username) {
    $("#UserName").val(username)
    $("#Password").val(pwd)
    $("#SubmitLoginForm").click()
  }
  //create button & checkbox
  $('<input />', { type: 'checkbox', id: 'rememberMe', text: "coucou", checked: checked }).appendTo($("#SubmitLoginForm").parent());
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