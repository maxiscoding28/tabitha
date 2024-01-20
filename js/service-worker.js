chrome.runtime.onMessage.addListener(function (message) {
    if (message.createNewGroup) {
      chrome.tabs.create({url: "../html/createnewgroup.html"}, function(tab) {
    })

  }
  if (message.editExistingGroup) {
    chrome.tabs.create({url: "../html/editexistinggroup.html"}, function(tab) {})
  }
});

chrome.tabGroups.onCreated.addListener( tabGroup => {
  // Check if it already exists in storage - tabitha created
  // If not then store
  debugger
  
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
    // Check if it already exists in storage - tabitha created

    // Find group in storage
    // Update color and title
    // Add alias
    // Save to storage
    debugger
})

// On Deleted
// Remove from Storage