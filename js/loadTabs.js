const DEFAULT_ICON = "../icons/tabitha48.png"

function grabTableBody(domId) {
   return document.getElementById(domId).getElementsByTagName('tbody')[0]
}
function isTabithaTab(url) {
  let pattern = `chrome-extension://${chrome.runtime.id}`;
  return url.startsWith(pattern)
}
function buildTableDataItem(icon, title, url, tabId, groupId){
  let groupDecoration = groupId > 0 ? "group" : "no-group";
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
function renderTabsToTable(tabs){
  let tableBody = grabTableBody('table');
  tableBody.innerHTML = "";
  
  tabs.forEach(function(tab){
    if (! isTabithaTab(tab.url)) {
      tableBody.innerHTML += buildTableDataItem(tab.favIconUrl, tab.title, tab.url, tab.id, tab.groupId);
    }
  })
}
function loadTabs() {
  chrome.tabs.query({}, renderTabsToTable);
}

document.addEventListener('DOMContentLoaded', loadTabs);