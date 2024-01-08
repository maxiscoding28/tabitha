const DEFAULT_ICON = "../icons/tabitha48.png"
const CHROME_EXTENSION_URL=`chrome-extension://${chrome.runtime.id}`;
const addGroupSettings = {
    color: "",
    selectedTabs: [],
    alias: "",
    onOpenBehavior: false
}
const colorMapping = {
    grey: "#CDCED0",
    blue: "#83ADF5",
    red: "#FC938D",
    yellow: "#FFD558",
    green: "#7AC491",
    pink: "#FE8BC6",
    purple: "#BF85F3",
    cyan: "#7FE3F3",
    orange: "#FEAE6F"
}
function getTableBody(domId) {
   return document.getElementById(domId).getElementsByTagName('tbody')[0]
}
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
function getTabIdInteger(tabCheckbox) {
    return parseInt(getAttribute(tabCheckbox, "data-tab-id"));
}
function aliasIsNotSet() {
    return getElementById("alias").length < 1
}
function setAlias() {
    if (aliasIsNotSet()) {
        addGroupSettings.alias = addGroupSettings.name
    }
}
function resetColorGrid(target) {
    const colorGrid = target.parentElement.children;
    for (tile of colorGrid) {
        if (classContains(tile.classList, "selected")) {
            removeClass(tile.classList, "selected")
        }
    }
}
function setOnOpenBehavior(){
    addGroupSettings.onOpenBehavior = getElementById("onOpenBehavior").checked;
}
function isTabithaTab(url) {
    return url.startsWith(CHROME_EXTENSION_URL)
  }
function hasGroupMembership(groupId) {
    return groupId >= 0;
}
function formIsValidated() {
    return nameMeetsRequirements() && tabsSelected();
}
function sortTabsByGroupMembership(tabs) {
    tabs.sort((a, b) => a.groupId - b.groupId);
}
function selectColorTile(event) {
    const targetClassList = event.target.classList;
    
    resetColorGrid(event.target)
    
    if (classContains(targetClassList, "color-tile")) {
        addClass(targetClassList, "selected");
        addGroupSettings.color = getAttribute(event.target, "data-color")
    }
}
function setColorTile() {
    if (addGroupSettings.color.length < 1) {
        const colors = Object.keys(colorMapping);
        let randomIndex = Math.floor(Math.random() * color.length);
        addGroupSettings.color = colors[randomIndex];
    }
}
function nameMeetsRequirements() {
    let input = getElementById("name").value
    if (input.length < 1) {
        alert("A group name is required");
        return false
    }
    if (input.length > 15) {
        alert("Group name can't be more than 15 characters")
        return false;
    }
    return true
}
function setName() {
    addGroupSettings.name = getElementById("name").input;
}
function tabsSelected() {
    let selectedTabCount = 0;
    const [...tabCheckboxes] = document.querySelectorAll('[data-tab-id]');
    tabCheckboxes.forEach(tabCheckbox => {
        const tabIdInteger = getTabIdInteger(tabCheckbox)
        if (tabCheckbox.checked) {
            selectedTabCount += 1;
            addGroupSettings.selectedTabs.push(tabIdInteger);
        }
    })
    
    return selectedTabCount > 0;
}

function groupTabs() {
    // Manage behavior if tab is already part of group
        // Move
        // Duplucate
    // List of tabs with existing group membership
    // Colored and with group title
    // Dropdown to move, duplicate or don't add
    
    chrome.tabs.group({tabIds: addGroupSettings.selectedTabs}, (groupId) => {
        chrome.tabGroups.update(groupId, {
            collapsed: ! addGroupSettings.onOpenBehavior,
            color: addGroupSettings.color,
            title: addGroupSettings.name
        }, (group) => saveGroupToStorage(group));
    })
}
function saveGroupToStorage(group) {
    const message = {};
    const id = group.id.toString()
    message[id] = group;
    chrome.storage.session.set(message).then( () => renderTabsToTable());
}

function buildTableDataItem(icon, title, url, tabId, groupName, color){
    let defaultGroupedTabsUnchecked = "checked";
    console.log(groupName)
    if (groupName > -1) {
        groupDecoration = "group";
        defaultGroupedTabsUnchecked = "unchecked"
    }
  return `
    <tr class="" style="background-color:${color};">
        <td class="small-col"><input type="checkbox" ${defaultGroupedTabsUnchecked} data-tab-id="${tabId}" /></td>
        <td class="small-col">${!! groupName ? groupName : ""}</td>
        <td><img class="tab-icon" src="${icon ? icon : DEFAULT_ICON}"/></td>
        <td class="cell-overflow">${title}</td>
        <td class="cell-overflow">${url}</td>
    </tr>
  `
}
function renderTabsToTable() {
    chrome.storage.session.get().then( groups => {
        const tableBody = getTableBody("table")
        tableBody.innerHTML = `
        <tr>
            <th class="small-col">Include?</th>
            <th class="small-col">Group?</th>
            <th>Tab Icon</th>
            <th>Tab Title</th>
            <th>Tab Url</th>
        </tr>
        `;
        chrome.tabs.query({}, tabs => {
        sortTabsByGroupMembership(tabs)
        tabs.forEach(tab => {
            if (! isTabithaTab(tab.url)) {
                if (hasGroupMembership(tab.groupId)) {
                    tab.color = colorMapping[groups[tab.groupId.toString()].color]
                    tab.groupName = groups[tab.groupId.toString()].title
                }
                tableBody.innerHTML += buildTableDataItem(
                    tab.favIconUrl, 
                    tab.title, 
                    tab.url, 
                    tab.id, 
                    tab.groupName, 
                    tab.color
                )
            }       
        })});    
    })
}
function loadExistingGroupsToStorage() {
    chrome.tabGroups.query({}, (groups) => {
        groups.forEach(group => {
            let data = {};
            let id = group.id.toString()
            data[id] = group;
            chrome.storage.session.set(data).then( () => {
                console.log("Group created")
            })
        })
    })
}
function createTabGroup() {
    if (formIsValidated()) {
        setColorTile();
        setName();
        setAlias();
        setOnOpenBehavior()
        groupTabs();
    }
}
function addEventHandlers() {
    const createGroupButton = getElementById('create-group-button');
    const colorGrid = getElementById('color-grid');

    colorGrid.addEventListener('click', selectColorTile)
    createGroupButton.addEventListener('click', createTabGroup)
}

function initPage() {
    loadExistingGroupsToStorage();
    document.addEventListener('DOMContentLoaded', addEventHandlers);
    document.addEventListener('DOMContentLoaded', renderTabsToTable);
}
initPage();