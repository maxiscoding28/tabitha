const DEFAULT_ICON = "../icons/tabitha48.png"

function grabTableBody(domId) {
   return document.getElementById(domId).getElementsByTagName('tbody')[0]
}
function isTabithaTab(url) {
  let pattern = `chrome-extension://${chrome.runtime.id}`;
  return url.startsWith(pattern)
}
function buildTableDataItem(icon, title, url, tabId){
  return `
  <tr>
    <td style="max-width: 10px"><input type="checkbox" checked data-tab-id="${tabId}" /></td>
    <td>GroupName</td>
    <td><img class="tab-icon" src="${icon ? icon : DEFAULT_ICON}"/></td>
    <td class="cell-overflow">${title}</td>
    <td class="cell-overflow">${url}</td>
  </tr>
  `
}
function renderTabsToTable(tabs){
  let tableBody = grabTableBody('table');
  
  tabs.forEach(function(tab){
    if (! isTabithaTab(tab.url)) {
      tableBody.innerHTML += buildTableDataItem(tab.favIconUrl, tab.title, tab.url, tab.id);
    }
  })
}
function loadTabs() {
  chrome.tabs.query({}, renderTabsToTable);
}

document.addEventListener('DOMContentLoaded', loadTabs);