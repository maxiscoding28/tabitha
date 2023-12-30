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