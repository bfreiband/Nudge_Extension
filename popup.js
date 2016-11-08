var options1 = {
  type: "basic",
  title: "Notifications Activated",
  iconUrl: "icon.png",
  message: "We'll let you know if you get distracted"
}

var options2 = {
  type: "basic",
  title: "Distraction Alert",
  iconUrl: "icon.png",
  message: "There's work to be done"
}

var options3 = {
  type: "basic",
  title: "Notifications Deactivated",
  iconUrl: "icon.png",
  message: "Time to relax"
}

var activeTab;
var goodSite;
var blacklistArray = ['facebook.com','twitter.com'];

function onStart() {
  var minutes = 5; //sets the amount of time inbetween notifications
  var goodTextField = document.getElementById('goodTextField');
  goodSite = goodTextField.value;
  var validURL_re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
  
  if (!validURL_re.test(goodSite) && (goodSite != '')) {
    goodTextField.className = goodTextField.className + ' error';
  }
  else {
    if(hasClass(goodTextField, 'error')) {
      goodTextField.className = goodTextField.className.replace(' error', '');
    }

    var hasHTTP_re = /^(http[s]?:\/\/){0,1}/;

    if(hasHTTP_re.test(goodSite)) {
      goodSite = goodSite.replace(/^(http[s]?:\/\/){0,1}/, '');
    }
    chrome.storage.sync.set({'mySite': goodSite});
    chrome.storage.sync.set({'isActive': true});

    chrome.notifications.create('activation', options1);
    chrome.alarms.clearAll();
    chrome.alarms.create("distractionAlarm", {periodInMinutes: minutes});
  }
}

function onFinish() {
  chrome.storage.sync.get('isActive', function(result) {
    if(result.isActive) {
      chrome.notifications.create('deactivation', options3);
      chrome.alarms.clearAll();
      chrome.storage.sync.set({'isActive': false});
    }
  })
}

/*this function adds the value in the text field to the blacklist*/
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
        blacklistArray = result_blist.blacklist;
        blacklistArray[blacklistArray.length] = textFieldValue;
        var blacklistObj = {
          'blacklist': blacklistArray,
          'prepopulated': result_ppop.prepopulated
        }

        chrome.storage.sync.set(blacklistObj);
      })
    })
  }
}

/* this fuction adds the current tab to the blacklist*/
function onAddToBlacklist2() {
  chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    activeTab = (tabs[0].url);

    var dropdown = document.getElementById('blacklistedSites');
    dropdown.options[dropdown.options.length] = new Option(activeTab, activeTab);

    chrome.storage.sync.get('blacklist', function(result_blist) {
      chrome.storage.sync.get('prepopulated', function(result_ppop) {
        blacklistArray = result_blist.blacklist;
        blacklistArray[blacklistArray.length] = activeTab;
        var blacklistObj = {
          'blacklist': blacklistArray,
          'prepopulated': result_ppop.prepopulated
        }

        chrome.storage.sync.set(blacklistObj);
      })
    })
  })
}

function onRemoveFromBlacklist() {
  var dropdown = document.getElementById('blacklistedSites');
  var dropdownValue = dropdown.value;
  dropdown.remove(dropdown.selectedIndex);

  chrome.storage.sync.get('blacklist', function(result_blist) {
    chrome.storage.sync.get('prepopulated', function(result_ppop) {
      blacklistArray = result_blist.blacklist;
      var itemIndex = blacklistArray.indexOf(dropdownValue);
      if(itemIndex > -1) {
        blacklistArray.splice(itemIndex, 1);
      }

      var blacklistObj = {
        'blacklist': blacklistArray,
        'prepopulated': result_ppop.prepopulated
      }

      chrome.storage.sync.set(blacklistObj);
    })
  })
}

function populateFields() {
  chrome.storage.sync.get("blacklist", function(result) {
    var dropdown = document.getElementById('blacklistedSites');

    for (var index = 0; index < result.blacklist.length; index++) {
      dropdown.options[dropdown.options.length] = new Option(result.blacklist[index], result.blacklist[index]);
    }
  });
}

function hasClass(element, cls) {
  return (' '+element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

chrome.alarms.onAlarm.addListener(function(alarm) {
  //Gets current tab and stores data in activeTab
  chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    activeTab = (tabs[0].url);

    chrome.storage.sync.get("blacklist", function(result) {
      //Checks to see if user is on a "blacklisted" site
      for(var count = 0; count < result.blacklist.length; count++) {
        if(activeTab.includes(result.blacklist[count])) {
          chrome.notifications.create('distraction', options2);
        }
      }
    })
  });
});

chrome.notifications.onClicked.addListener(function(notificationId) {
  if(notificationId == 'distraction') {
    chrome.storage.sync.get('mySite', function(site) {
      if(site.mySite != '') {
        window.open('http://'+site.mySite, '_blank');
      }
    });
  }
});

document.onkeydown = function (evt) {
  var keyCode = evt ? (evt.which ? evt.which : evt.keyCode) : event.keyCode;
  if (keyCode == 13) {
    onStart();
  }
};

document.addEventListener('DOMContentLoaded', function () {
  //Add click listeners to the 'activate', 'deactivate', and 'addToBlacklistButton' buttons
  document.getElementById('activate').addEventListener('click', onStart);
  document.getElementById('deactivate').addEventListener('click', onFinish);
  document.getElementById('addToBlacklistButton').addEventListener('click', onAddToBlacklist);
  document.getElementById('addToBlacklistButton2').addEventListener('click', onAddToBlacklist2);
  document.getElementById('removeFromBlacklistButton').addEventListener('click', onRemoveFromBlacklist);

  //Footer Links
  document.getElementById('source').addEventListener('click', onSource);
  document.getElementById('max').addEventListener('click', onMax);
  document.getElementById('ben').addEventListener('click', onBen);

  //Populate the 'blacklistedSites' dropdown from chrome.storage.sync
  chrome.storage.sync.get('prepopulated', function(data) {
    if(typeof (data.prepopulated) == 'undefined') {
      var blacklistObj = {
        'blacklist': blacklistArray,
        'prepopulated': 1,
        'isActive': false
      }
      chrome.storage.sync.set(blacklistObj, populateFields);
    }
    else {
      populateFields();
    }
  });
});

function onSource() {
  window.open("https://github.com/maxvwalbert/Nudge_Extension", '_blank');
}

function onMax() {
  window.open("http://maxalbert.me", '_blank');
}

function onBen() {
  window.open("http://benfreiband.rocks", '_blank');
}