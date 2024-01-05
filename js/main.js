const DEFAULT_ICON = "../icons/tabitha48.png"
const addGroupSettings = {
    color: "",
    selectedTabs: [],
    alias: "",
    onOpenBehavior: false
}
const groupIdToColorNameMapping = {

}
function getTableBody(domId) {
   return document.getElementById(domId).getElementsByTagName('tbody')[0]
}
function isTabithaTab(url) {
  const pattern = `chrome-extension://${chrome.runtime.id}`;
  return url.startsWith(pattern)
}
function buildTableDataItem(icon, title, url, tabId, groupId){
  const groupDecoration = groupId > 0 ? "group" : "no-group";
  return `
  <tr class="${groupDecoration}">
    <td class="small-col"><input type="checkbox" checked data-tab-id="${tabId}" /></td>
    <td class="small-col">GroupName</td>
    <td><img class="tab-icon" src="${icon ? icon : DEFAULT_ICON}"/></td>
    <td class="cell-overflow">${title}</td>
    <td class="cell-overflow">${url}</td>
  </tr>
  `
}
function renderTabsToTable() {
    const tableBody = getTableBody("table")
    tableBody.innerHTML = "";
    chrome.tabs.query({}, tabs => {
        // Need Tab's Group ID and Color For Group
        sortTabsByGroupMembership(tabs)
        tabs.forEach(tab => {
            if (! isTabithaTab(tab.url)) {
                tableBody.innerHTML += buildTableDataItem(tab.favIconUrl, tab.title, tab.url, tab.id, tab.groupId)
            }       
        })
    });
}
function buildGroupIdToColorNameMapping() {
    chrome.tabGroups.query({}, (groups) => {
        groups.forEach(group => {
            groupIdToColorNameMapping[group.id] = {
                name: group.title,
                color: group.color
            };
        })
    })
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
function resetColorGrid() {
    const colorGrid = event.target.parentElement.children;
    for (tile of colorGrid) {
        if (classContains(tile.classList, "selected")) {
            removeClass(tile.classList, "selected")
        }
    }
}
function selectColorTile(event) {
    const targetClassList = event.target.classList;
    
    resetColorGrid()
    
    if (classContains(targetClassList, "color-tile")) {
        addClass(targetClassList, "selected");
        addGroupSettings.color = getAttribute(event.target, "data-color")
    }
}
function setColorTile() {
    if (addGroupSettings.color.length < 1) {
        let colors = ["grey", "blue", "red", "yellow", "green", "pink", "purple", "cyan", "orange"]
        let randomIndex = Math.floor(Math.random() * colors.length);
        addGroupSettings.color = colors[randomIndex];
    }
    return true
}
function setAlias() {
    if (getElementById("alias").length < 1) {
        addGroupSettings.alias = addGroupSettings.name
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
    addGroupSettings.name = input;
    return true
}
function getTabIdInteger(tabCheckbox) {
    return parseInt(tabCheckbox.getAttribute("data-tab-id"));
}
function tabSelected() {
    let selectedTabCount = 0;
    const [...tabCheckboxes] = document.querySelectorAll('[data-tab-id]');
    tabCheckboxes.forEach(tabCheckbox => {
        let tabIdInteger = getTabIdInteger(tabCheckbox)
        if (tabCheckbox.checked) {
            selectedTabCount += 1;
            addGroupSettings.selectedTabs.push(tabIdInteger);
        }
    })
    
    return selectedTabCount > 0;
}
function setOnOpenBehavior(){
    addGroupSettings.onOpenBehavior= getElementById("onOpenBehavior").checked;
}
function hasGroupMembership(groupId) {
    return groupId >= 0;
}
function formIsValidated() {
    return nameMeetsRequirements() && tabSelected();
}
function sortTabsByGroupMembership(tabs) {
    tabs.sort((a, b) => a.groupId - b.groupId);
}
function createTabGroup() {
    if (formIsValidated()) {
        setColorTile();
        setAlias();
        setOnOpenBehavior()
        chrome.tabs.group({tabIds: addGroupSettings.selectedTabs}, (groupId) => {
            chrome.tabGroups.update(groupId, {
                collapsed: ! addGroupSettings.onOpenBehavior,
                color: addGroupSettings.color,
                title: addGroupSettings.name
            }, (group) => {
                let id = group.id
                chrome.storage.local.set({id: group}).then(() => {
                    debugger
                })
                // Get the groupID for all tabs
                // Get the color associated with the groupID
                // Get the title associated with the groupID
                // Rerender the table with the color and titles
                debugger
            });
        })
    }
}

function addEventHandlers() {
    const createGroupButton = getElementById('create-group-button');
    const colorGrid = getElementById('color-grid');

    colorGrid.addEventListener('click', selectColorTile)
    createGroupButton.addEventListener('click', createTabGroup)
}
function initPage() {
    buildGroupIdToColorNameMapping();
    document.addEventListener('DOMContentLoaded', addEventHandlers);
    document.addEventListener('DOMContentLoaded', renderTabsToTable);
}

initPage();