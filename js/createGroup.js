function getCreateGroupButton() {
    return document.getElementById('create-group-button')
}
function createGroupInChrome() {
    chrome.tabs.query({}, function(tabs){
        let tabIds = [];
        tabs.forEach(function(tab) {
            if (! isTabithaTab(tab.url)) {
                tabIds.push(tab.id)
            } 
        });
        
        chrome.tabs.group({tabIds}, function(groupInfo) {
        })
    });

}

function createGroup() {
    let createGroupButton = getCreateGroupButton()
    createGroupButton.addEventListener('click', createGroupInChrome)
}

chrome.tabGroups.onCreated.addListener(function(group) {
    console.log(group.id)
    chrome.tabGroups.update(group.id, {
        color: "pink",
        title: "Test"
    }, function(){});
});

document.addEventListener('DOMContentLoaded', createGroup);

