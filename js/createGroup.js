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
function getAttribute(element, attribute) {
    return element.getAttribute(attribute)
}
function selectColorTile(event) {
    if (classContains(event.target.classList, "color-tile")) {
        let colorGrid = event.target.parentElement.children;
        for (tile of colorGrid) {
            if (classContains(tile.classList, "selected")) {
                removeClass(tile.classList, "selected")
            }
        }
        addClass(event.target.classList, "selected");
        color = getAttribute(event.target, "data-color")
    }
}
function selectRandomColorIfNoColorSelected() {
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
    if (tabs.length < 1) {
        alert("Please select the tabs you would like grouped.")
        return false
    }
    tabs.forEach(tab => {
        if (tab.checked) {
            let tabId = getAttribute(tab, "data-tab-id")
            selectedTabs.push(parseInt(tabId));
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
    onOpenBehavior= getElementById("onOpenBehavior").checked;
}

function formIsValidated() {
    return nameInputValidated() && tabSelected();
}

function createGroupInChrome() {
    selectRandomColorIfNoColorSelected()
    getDefaultExpandBehaviorSetting()
    
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

