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

chrome.tabGroups.onCreated.addListener( tabGroup => {
  chrome.tabs.query({groupId: tabGroup.id}, function(tabsArray){
    let storagePayload = {};
    let tabGroupObjectForStorage = {
      tabGroupMembers: [...tabsArray],
      alias: "",
      collapsed: tabGroup.collapsed,
      id: tabGroup.id,
      title: tabGroup.title,
      color: tabGroup.color
    };
    
    storagePayload[tabGroup.id] = tabGroupObjectForStorage;
    chrome.storage.session.set(storagePayload)
  })
})

// On Updated
chrome.tabGroups.onUpdated.addListener( tabGroup => {
  debugger
})
// Add Title and Color

// On Deleted
// Remove from Storage