function getElementById(id) {
    return document.getElementById(id)
}
function selectColorTile(event) {
    if (event.target.classList.contains("color-tile")) {
        for (tileElement of event.target.parentElement.children) {
            if (tileElement.classList.contains("selected")) {
                tileElement.classList.remove("selected")
            }
        }
        event.target.classList.add("selected");
    }
}
function validateNameInput() {
    // Check if Name is added, meets critera maximum 20 characters

}
function validateAliasInput() {
    // Check if Alias is added, maximum of 5 characters, no spaces all plaintext (no emojis or special characters)
}
function getDefaultExpandBehaviorSetting(){
        // Check if Box is checked or not
}

function validateForm() {
    if (validateNameInput() && validateAliasInput() ) {
        let settings = {
            title: getTitle(),
            alias: getAlias(),
            defaultExpandSetting: getDefaultExpandBehaviorSetting()
        }
        createGroupInChrome(settings)
    }
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

function addEventHandlers() {
    let createGroupButton = getElementById('create-group-button')
    createGroupButton.addEventListener('click', validateForm)

    let colorGrid = getElementById('color-grid');
    colorGrid.addEventListener('click', selectColorTile)
}

chrome.tabGroups.onCreated.addListener(function(group) {
    console.log(group.id)
    chrome.tabGroups.update(group.id, {
        color: "pink",
        title: "Test"
    }, function(){});
});

document.addEventListener('DOMContentLoaded', addEventHandlers);

