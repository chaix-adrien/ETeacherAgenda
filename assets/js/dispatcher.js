
function dispatchByURL(matchs) {
  matchs.forEach(match => document.URL.toLowerCase().indexOf(match.path.toLowerCase()) !== -1 ? match.goTo() : null)
}

dispatchByURL([
  {
    path: "/courses/schedule.asp",
    goTo: () => syncCalendar(),
  },
  {
    path: "courses/courses.asp",
    goTo: () => loadClasses(),
  }, {
    path: "login.asp",
    goTo: () => handleLoginPage(),
  },
  {
    path: "MyProfile.asp",
    goTo: () => settingPage(),
  },
  {
    path: "default.asp",
    goTo: () => homePage(),
  },
])
