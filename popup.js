var options1 = {
  type: "basic",
  title: "Homework Mode Activated!",
  iconUrl: "Icon.png",
  message: "We'll let you know if you get distracted"
}

var options2 = {
  type: "basic",
  title: "Distraction Alert!",
  iconUrl: "Icon.png",
  message: "You still have unfinished homework :("
}

var options3 = {
  type: "basic",
  title: "Homework Mode Deactivated",
  iconUrl: "Icon.png",
  message: "No more homework means no more notifications. See you next time! :)"
}

var activeTab;
var blacklist = ['facebook.com', 'twitter.com'];

function onStart() {
  chrome.notifications.create(options1);
  chrome.alarms.create("distractionAlarm", {periodInMinutes: .1});
}

function onFinish() {
  chrome.notifications.create(options3);
  chrome.alarms.clearAll();
}

function onAddToBlacklist() {

}

chrome.alarms.onAlarm.addListener(function(alarm) {
  //Gets current tab and stores data in activeTab
  chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    activeTab = (tabs[0].url);
  });

  console.log(activeTab);

  //Checks to see if user is on one of the "blacklisted" sites
  if(activeTab.includes("facebook.com")) {
    chrome.notifications.create(options2);
  }
});

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('activate').addEventListener('click', onStart);
  document.getElementById('deactivate').addEventListener('click', onFinish);
  document.getElementById('addToBlacklistButton').addEventListener('click', onAddToBlacklist);
  chrome.storage.sync.get('prepopulated', function(data) {
    if(chrome.runtime.lastError) {
      chrome.storage.sync.set({
        blacklist: ['facebook.com','twitter.com'],
        prepopulated: 1
      });
    }

    chrome.storage.sync.get('blacklist', function(result) {
      var blacklistDropdown = document.getElementById('blacklistedSites');
      for(site in result) {
        var option = document.createElement("option");
        option.text = site;
        option.value = site;
        blacklistDropdown.add(option);
      }
    });
  });
});