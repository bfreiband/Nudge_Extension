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

function onStart() {
  chrome.notifications.create(options1);
  chrome.alarms.create("distractionAlarm", {periodInMinutes: .1});
}

function onFinish() {
  chrome.notifications.create(options3);
  chrome.alarms.clearAll();
}

function onAddToBlacklist() {
  var textField = document.getElementById('badTextField');
  var textFieldValue = textField.value.replace(/\s+/g, '');

  //If the text field isn't empty:
  //  Add the contents of it to the dropdown
  //  Clear it
  //  Add its former contents to the chrome.storage.sync 'blacklist' array
  if(textFieldValue != '') {
    var dropdown = document.getElementById('blacklistedSites');

    dropdown.options[dropdown.options.length] = new Option(textFieldValue, textFieldValue);
    textField.value = '';

    chrome.storage.sync.get('blacklist', function(result_blist) {
      chrome.storage.sync.get('prepopulated', function(result_ppop) {
        var theArray = result_blist.blacklist;
        theArray[theArray.length] = textFieldValue;
        var blacklistObj = {
          'blacklist': theArray,
          'prepopulated': result_ppop.prepopulated
        }

        chrome.storage.sync.set(blacklistObj, function() {
        })
      })
    })
  }
}

function setBlacklistDropdown() {
  chrome.storage.sync.get("blacklist", function(result) {
    var dropdown = document.getElementById('blacklistedSites');

    for (var index = 0; index < result.blacklist.length; index++) {
      dropdown.options[dropdown.options.length] = new Option(result.blacklist[index], result.blacklist[index]);
    }
  });
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
  //Add click listeners to the 'activate', 'deactivate', and 'addToBlacklistButton' buttons
  document.getElementById('activate').addEventListener('click', onStart);
  document.getElementById('deactivate').addEventListener('click', onFinish);
  document.getElementById('addToBlacklistButton').addEventListener('click', onAddToBlacklist);

  //Populate the 'blacklistedSites' dropdown from chrome.storage.sync
  chrome.storage.sync.get('prepopulated', function(data) {
    if(typeof (data.prepopulated) == 'undefined') {
      var prepopSites = ["facebook.com", "twitter.com"];
      var blacklistObj = {
        'blacklist': prepopSites,
        'prepopulated': 1
      }
      chrome.storage.sync.set(blacklistObj, setBlacklistDropdown);
    }
    else {
      setBlacklistDropdown();
    }
  });
});