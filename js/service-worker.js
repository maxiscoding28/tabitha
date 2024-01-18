// Listener, if new tabgroup is created
// Query active tabs for membership
// Add alias parameter

chrome.runtime.onMessage.addListener(function (message) {
    if (message.createNewGroup) {
      chrome.tabs.create({url: "../html/createnewgroup.html"}, function(tab) {
        console.log(tab);
    })

  }
  if (message.editExistingGroup) {
    chrome.tabs.create({url: "../html/editexistinggroup.html"}, function(tab) {
      console.log(tab);
    })
  }
});