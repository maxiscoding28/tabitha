let color = "xx";

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
        color = event.target.getAttribute("data-color")
    }
}
function validateNameInput() {
    input = getElementById("name").value
    if (input.length < 1) {
        alert("Name is required");
    }
    // Check if Name is added, meets critera maximum 20 characters

}
function validateAliasInput() {
    // Check if Alias is added, maximum of 5 characters, no spaces all plaintext (no emojis or special characters)
}
function getDefaultExpandBehaviorSetting(){
        // Check if Box is checked or not
}

function formIsValidated() {
    // validateNameInput();

    return true
    // if (validateNameInput() && validateAliasInput() ) {
    //     let settings = {
    //         title: getTitle(),
    //         alias: getAlias(),
    //         defaultExpandSetting: getDefaultExpandBehaviorSetting()
    //     }
    //     createGroupInChrome(settings)
    // }
}

function createGroupInChrome() {
    if (formIsValidated()) {
        let name = getElementById("name").value
        chrome.tabs.query({}, function(tabs){
            let tabIds = [];
            tabs.forEach(function(tab) {
                if (! isTabithaTab(tab.url)) {
                    tabIds.push(tab.id)
                } 
            });   
            chrome.tabs.group({tabIds}, function(groupId) {
                chrome.tabGroups.update(groupId, {
                    collapsed: true,
                    color: color,
                    title: name
                }, function(){});
            })
        });
    }
}

function addEventHandlers() {
    let createGroupButton = getElementById('create-group-button')
    createGroupButton.addEventListener('click', createGroupInChrome)

    let colorGrid = getElementById('color-grid');
    colorGrid.addEventListener('click', selectColorTile)
}

document.addEventListener('DOMContentLoaded', addEventHandlers);

