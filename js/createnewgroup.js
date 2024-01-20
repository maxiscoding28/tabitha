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
const CreateNewGroupComponent = class { 
    static isGroupMember (id) {
        return id > -1;
    }
    static isTabithaTab(url) {
        return url.startsWith(`chrome-extension://${chrome.runtime.id}`)
    }
    constructor() {
        this.selectedTabsToGroup = [];
        this.storedTabGroups = {};
        this. newGroupData = {
            color: "",
            title: "",
            alias: "",
            expandOnCreate: false
        }

        this.getTabGroups()
        this.addEventListeners()
    }
    getTabGroupTitle() {
        return document.getElementById("name").value;
    }
    getTabGroupAlias() {
        return document.getElementById("alias").value;
    }
    getTableBodyElement() {
        return document.getElementById("table").getElementsByTagName('tbody')[0]
    }
    getTabGroups() {
        chrome.storage.session.get().then(groups => this.mergeTabGroupsToStorage(groups))
    }
    getTabGroupHexColor(id) {
        return COLOR_MAPPING[this.storedTabGroups[id.toString()].color]
    }
    getTabGroupTitle(id) {
        return this.storedTabGroups[id.toString()].title
    }
    setTableHeaders() {
        this.getTableBodyElement().innerHTML = `
            <tr>
                <th class="small-col">Include?</th>
                <th class="small-col">Group?</th>
                <th>Tab Icon</th>
                <th>Tab Title</th>
                <th>Tab Url</th>
            </tr>
        `;
    }
    mergeTabGroupsToStorage(groups) {
        this.storedTabGroups = groups;
        this.loadActiveTabsInTable();
    }
    resetColorGrid(target) {
        const colorGrid = target.parentElement.children;
        for (let i = 0; i < colorGrid.length; i++) {
            let tile = colorGrid[i];
            if (tile.classList.contains("selected")) {
                tile.classList.remove("selected")
            }
        }
    }
    randomColorTile() {
        const colors = Object.keys(COLOR_MAPPING);
        let randomIndex = Math.floor(Math.random() * colors.length);
        newGroupData.color = colors[randomIndex];
    }
    nameSelected() {
        return document.getElementById("name").value.length > 0;
    }
    aliasSelected() {
        return document.getElementById("alias").value.length > 0;
    }
    loadActiveTabsInTable() {
        this.setTableHeaders()
        chrome.tabs.query({}, tabs => {
            let checkedIfNoGroupMembership = "checked";
            tabs.sort( (a, b) => a.groupId - b.groupId);
            tabs.forEach(tab => {
                if (! CreateNewGroupComponent.isTabithaTab(tab.url) ) {
                    if (CreateNewGroupComponent.isGroupMember(tab.groupId)) {
                        tab.groupColor = this.getTabGroupHexColor(tab.groupId)
                        tab.groupTitle = this.getTabGroupTitle(tab.groupId)
                        checkedIfNoGroupMembership = "unchecked"
                    }
                    this.getTableBodyElement().innerHTML += this.buildTableDataItem(
                        tab.favIconUrl, 
                        tab.title, 
                        tab.url, 
                        tab.id,
                        tab.groupColor,
                        tab.groupTitle,
                        checkedIfNoGroupMembership
                    )
                }
            })
        });
    }
    addEventListeners() {
        document.getElementById("select-all").addEventListener("click", (event) => {
            [...document.getElementsByClassName("tab-row-checkbox")].forEach(checkbox => {
                checkbox.checked = event.target.checked
            })
        })
    
        document.getElementById("color-grid").addEventListener("click", event => {
            const targetClassList = event.target.classList;
            this.resetColorGrid(event.target)
            
            if (targetClassList.contains("color-tile")) {
                targetClassList.add("selected");
                this.newGroupData.color = event.target.getAttribute("data-color")
            }
        })
        document.getElementById("create-group-button").addEventListener("click", (event) => {
            if (! this.newGroupData.color) {
                this.randomColorTile()
            }
            if (! this.nameSelected() ) {
                this.newGroupData.title = "";
            }
            else {
                newGroupData.title = this.getTabGroupTitle();
            }
            if (! aliasSelected()) {
                if (newGroupData.title.length > 0) {
                    newGroupData.alias = newGroupData.title
                }
                else {
                    newGroupData.alias = ""
                }
            }
            else {
                newGroupData.alias = this.getTabGroupAlias;
            }
            newGroupData.expandOnCreate = document.getElementById("on-open-behavior").checked;
    
    
            // Create Group
            let selectedTabCount = 0;
            const [...tabCheckboxes] = document.querySelectorAll('[data-tab-id]');
            tabCheckboxes.forEach(tabCheckbox => {
                const tabIdInteger = parseInt(tabCheckbox.getAttribute("data-tab-id"));
                if (tabCheckbox.checked) {
                    selectedTabCount += 1;
                    selectedTabsToGroup.push(tabIdInteger);
                }
            })
            // Need validation if no tabs selected
    
            chrome.tabs.group({tabIds: selectedTabsToGroup}, (data) => {
                chrome.tabGroups.update(
                    data,
                    {
                        collapsed: ! newGroupData.expandOnCreate,
                        color: newGroupData.color,
                        title: newGroupData.title
                    }, (data) => {
                        let payload = {}
                        payload[data.id] = data;
                        chrome.storage.session.set(payload)
                    }
                )
            })
            // Add to Storage
        })
    }
    buildTableDataItem(icon, title, url, tabId, groupColor, groupName, noGroupMemberChecked){
        return `
            <tr style="background-color:${groupColor};">
                <td class="small-col"><input class="tab-row-checkbox" type="checkbox" ${noGroupMemberChecked} data-tab-id="${tabId}" /></td>
                <td class="small-col">${!! groupName ? groupName : ""}</td>
                <td><img class="tab-icon" src="${icon ? icon : DEFAULT_ICON}"/></td>
                <td class="cell-overflow">${title}</td>
                <td class="cell-overflow">${url}</td>
            </tr>
        `
    }
}

new CreateNewGroupComponent()