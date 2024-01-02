function getCreateGroupButton() {
    return document.getElementById('create-group-button')
}
function formIsValidated() {
    // Check if Color Is Selected, If Not, assign random color

    // Check if Name is added, meets critera maximum 20 characters

    // Check if Alias is added, maximum of 5 characters, no spaces all plaintext (no emojis or special characters)

    // Check if Box is checked or not
}

function createGroupInChrome() {
    if (formIsValidated()) {
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

