const DEFAULT_ICON = "../icons/tabitha48.png"
const COLOR_MAPPING = {
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
let storedTabGroups = {};
let newGroupData = {
    color: "",
    title: "",
    alias: "",
    expandOnCreate: false
};

function mergeTabGroupsToStorage(groups) {
    // Save to object on client side
    storedTabGroups = groups;

    // Retrieve all chrome tab groups
    chrome.tabGroups.query({}, (chromeTabGroups) => {
        chromeTabGroups.forEach(chromeTabGroup => {

            // If chrome tab group doesn't exist in storedTabGroups, create it.
            if (!(chromeTabGroup.id in storedTabGroups)) {
                storedTabGroups[chromeTabGroup.id] = chromeTabGroup;   
            }
        })

        // Load Tabs with Group Decorations
        loadActiveTabsInTable();
    })
}

function getTabGroups() {
    // Check if Groups Exists In Storage
    chrome.storage.session.get().then(groups => mergeTabGroupsToStorage(groups))
}
function resetColorGrid(target) {
    const colorGrid = target.parentElement.children;
    for (tile of colorGrid) {
        if (tile.classList.contains("selected")) {
            tile.classList.remove("selected")
        }
    }
}
function randomColorTile() {
    const colors = Object.keys(COLOR_MAPPING);
    let randomIndex = Math.floor(Math.random() * colors.length);
    newGroupData.color = colors[randomIndex];
}
function nameSelected() {
    return document.getElementById("name").value.length > 0;
}
function addEventListeners() {
    // Select All
    document.getElementById("select-all").addEventListener("click", (event) => {
        // Loop through all tab checkboxes and set value to value of select all checkbox
        [...document.getElementsByClassName("tab-row-checkbox")].forEach(checkbox => {
            checkbox.checked = event.target.checked
        })
    })

    // Color Grid Selector
    document.getElementById("color-grid").addEventListener("click", event => {
        const targetClassList = event.target.classList;
    
        resetColorGrid(event.target)
        
        if (targetClassList.contains("color-tile")) {
            targetClassList.add("selected");
            newGroupData.color = event.target.getAttribute("data-color")
        }
    })
    // Create Button
    document.getElementById("create-group-button").addEventListener("click", (event) => {
        debugger
        if (! newGroupData.color) {
            randomColorTile()
        }
        if (! nameSelected() ) {
            newGroupData.title = ""
        }
        if (! aliasSelected()) {
            if (newGroupData.title.length > 0) {
                newGroupData.alias = newGroupData.title
            }
            else {
                newGroupData.alias = ""
            }
        }
        expandOnCreate = document.getElementById("on-open-behavior").checked;

        // Create Group

        // Add to Storage

    })
}

function createNewGroupInit() {
    getTabGroups()
    addEventListeners()
}



function loadActiveTabsInTable() {

    // Grab table body
    const tableBody = document.getElementById("table").getElementsByTagName('tbody')[0];
    
    // Add headers
    tableBody.innerHTML = `
        <tr>
            <th class="small-col">Include?</th>
            <th class="small-col">Group?</th>
            <th>Tab Icon</th>
            <th>Tab Title</th>
            <th>Tab Url</th>
        </tr>`;

    // Grab all active tabs
    chrome.tabs.query({}, tabs => {
        // sort by whether a tab has a group ID last
        tabs.sort( (a, b) => a.groupId - b.groupId);

        tabs.forEach(tab => {

            // Filter out tabby urls
            if (! tab.url.startsWith(`chrome-extension://${chrome.runtime.id}`)) {

                // Check if tab is member of group
                // If so, lookup color and name
                if (tab.groupId > -1) {
                    tab.groupColor = COLOR_MAPPING[storedTabGroups[tab.groupId.toString()].color]
                    tab.groupName = storedTabGroups[tab.groupId.toString()].title
                }

                // Build the HTML for the tab
                tableBody.innerHTML += buildTableDataItem(
                    tab.favIconUrl, 
                    tab.title, 
                    tab.url, 
                    tab.id,
                    tab.groupColor,
                    tab.groupName
                )
            }
        })

        });
}
function buildTableDataItem(icon, title, url, tabId, groupColor, groupName){

    // Uncheck already grouped tabs by default
    let isNotExistingGroupMember = "checked";
    if (groupColor) {
        isNotExistingGroupMember = "unchecked"
    }
    return `
        <tr style="background-color:${groupColor};">
            <td class="small-col"><input class="tab-row-checkbox" type="checkbox" ${isNotExistingGroupMember} data-tab-id="${tabId}" /></td>
            <td class="small-col">${!! groupName ? groupName : ""}</td>
            <td><img class="tab-icon" src="${icon ? icon : DEFAULT_ICON}"/></td>
            <td class="cell-overflow">${title}</td>
            <td class="cell-overflow">${url}</td>
        </tr>
    `
}

createNewGroupInit()