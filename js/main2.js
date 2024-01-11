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
let storedTabGroups = {};

// Check if Groups Exists In Storage
chrome.storage.session.get().then( groups => {
    storedTabGroups = groups;
    chrome.tabGroups.query({}, (chromeTabGroups) => {
        chromeTabGroups.forEach(chromeTabGroup => {
            if (! chromeTabGroup.id in storedTabGroups) {
                storedTabGroups[chromeTabGroup.id] = chromeTabGroup;   
            }
        })
        loadActiveTabsInTable();
    })
})
// chrome.storage.session.get().then( storageGroups => {
//     chrome.tabGroups.query({}, (chromeTabGroups) => {
//         debugger
//         chromeTabGroups.forEach(chromeTabGroup => {
//             debugger
//             // if chromeTabGroup.id does not exist in Object.keys(storage)
//                 // save to storage
//         });
//     });
// })


    // If so load them

// Add event handler for creating a group

// Load all open tabs

// Validate form input

// Create group
    // Save in storage

// Reload tabs

// Storage Functions
function setGroupInStorage(group) {
    let message = {};
    message[group.id.toString()] = group;
    chrome.storage.session.set(message).then( () => {
        console.log("Group created")
    })
}
function loadActiveTabsInTable() {
    chrome.storage.session.get().then( groups => {
        const tableBody = document.getElementById("table").getElementsByTagName('tbody')[0];
        tableBody.innerHTML = `
            <tr>
                <th class="small-col">Include?</th>
                <th class="small-col">Group?</th>
                <th>Tab Icon</th>
                <th>Tab Title</th>
                <th>Tab Url</th>
            </tr>`;
            chrome.tabs.query({}, tabs => {
                if (url.startsWith(`chrome-extension://${chrome.runtime.id}`)) {
                    // if (tab.groupId > -1) {
                    //     tab.color = colorMapping[groups[tab.groupId.toString()].color]
                    //     tab.groupName = groups[tab.groupId.toString()].title
                    // }
                    tableBody.innerHTML += buildTableDataItem(
                        tab.favIconUrl, 
                        tab.title, 
                        tab.url, 
                        tab.id, 
                        tab.groupId
                    )
                }
            });
    });
}
function buildTableDataItem(icon, title, url, tabId, groupId){
    let noGroupMembership = "checked";
    if (groupId > -1) {
        groupName
        noGroupMembership = "unchecked"
    }
  return `
    <tr class="" style="background-color:${color};">
        <td class="small-col"><input type="checkbox" ${noGroupMembership} data-tab-id="${tabId}" /></td>
        <td class="small-col">${!! groupName ? groupName : ""}</td>
        <td><img class="tab-icon" src="${icon ? icon : DEFAULT_ICON}"/></td>
        <td class="cell-overflow">${title}</td>
        <td class="cell-overflow">${url}</td>
    </tr>
  `
}