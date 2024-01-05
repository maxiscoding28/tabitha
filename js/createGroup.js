let color = "";
let groupName = "";
let selectedTabs = [];
let onOpenBehavior = true;

function getElementById(id) {
    return document.getElementById(id)
}
function classContains(classList, className) {
    return classList.contains(className)
}
function removeClass(classList, className) {
    classList.remove(className)
}
function addClass(classList, className) {
    classList.add(className)
}
function selectColorTile(event) {
    if (classContains(event.target.classList, "color-tile")) {
        let colorGrid = event.target.parentElement.children;
        console.log(colorGrid)
        for (tile of colorGrid) {
            console.log(tile)
            if (classContains(tile.classList, "selected")) {
                removeClass(tile.classList, "selected")
            }
        }
        addClass(event.target.classList, "selected");
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
            chrome.tabGroups.update(groupId, {
                collapsed: ! onOpenBehavior,
                color: color,
                title: groupName
            }, function(){
                // add group color to tab elements that are grouped
                // Place at bottom of the table
                // Select All Non Grouped Tabs by Default
                // If group create and non group tabs are selected, popup dialog to either move to new group or duplicate
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

