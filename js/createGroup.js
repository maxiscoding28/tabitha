let color = "";
let groupName = "";
let selectedTabs = [];
let onOpenBehavior = true;

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
function colorSelected() {
    if (color.length < 1) {
        let colors = ["grey", "blue", "red", "yellow", "green", "pink", "purple", "cyan", "oragne"]
        let randomIndex = Math.floor(Math.random() * colors.length);
        color = colors[randomIndex];
    }

    return true
}
function nameInputValidated() {
    let input = getElementById("name").value
    if (input.length < 1) {
        alert("Name is required");
        return false
    }
    debugger
    groupName = input
    return true
}
function tabSelected() {
    let tabs = document.querySelectorAll('[data-tab-id]');
    tabs.forEach(tab => {
        if (tab.checked) {
            selectedTabs.push(parseInt(tab.getAttribute("data-tab-id")));
        }
    })

    return true
}
function aliasInputValidated() {
    let input = getElementById("alias")
    if (input.length < 1) {
        alias = groupName;
    }
    aliasName = input.value

    return true;
}
function getDefaultExpandBehaviorSetting(){
    onOpenBehavior= document.getElementById("onOpenBehavior").checked;
    return true
}

function formIsValidated() {
    return (
        colorSelected() &&
        nameInputValidated() &&
        tabSelected() &&
        getDefaultExpandBehaviorSetting()
    );
}

function createGroupInChrome() {
    if (formIsValidated()) {
        chrome.tabs.group({tabIds: selectedTabs}, function(groupId) {
            debugger
            chrome.tabGroups.update(groupId, {
                collapsed: ! onOpenBehavior,
                color: color,
                title: groupName
            }, function(){
                // filter out groupedTabs
                // reset form
            });
        })
    }
}

function addEventHandlers() {
    let createGroupButton = getElementById('create-group-button')
    createGroupButton.addEventListener('click', createGroupInChrome)

    let colorGrid = getElementById('color-grid');
    colorGrid.addEventListener('click', selectColorTile)
}

document.addEventListener('DOMContentLoaded', addEventHandlers);

