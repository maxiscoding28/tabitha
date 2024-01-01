function sendMessage(key) {
  message = {};
  message[key] = true
  chrome.runtime.sendMessage(message);
}

function grabElement(domId) {
  return document.getElementById(domId);
}

document.getElementById("cmd-input").focus();

document.addEventListener('DOMContentLoaded', function () {
  var addTabGroupButton = grabElement('create-group');
  var editExistingGroupButton = grabElement('edit-existing-group');
  var tabGroupsList = grabElement("tab-groups-list");
  
  addTabGroupButton.addEventListener('click', function () {
    sendMessage("createNewGroup");
  });
  editExistingGroupButton.addEventListener('click', function () {
    sendMessage("editExistingGroup");
  });

  if (tabGroupsList.children.length <= 0) {
    tabGroupsList.innerHTML="<div class=\"flex-center auto-margin rotate flex-column\"><img src=\"../icons/tabitha48.png\" /><div>Nothing here...</div></div>"
  }
});



