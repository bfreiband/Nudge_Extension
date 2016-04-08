var options1 = {
  type: "basic",
  title: "Homework Mode Activated!",
  iconUrl: "Icon.png",
  body: "We'll let you know if you get distracted"
}

var options2 = {
  type: "basic",
  title: "Distraction Alert!",
  iconUrl: "Icon.png",
  body: "You still have unfinished homework :("
}

var options3 = {
  type: "basic",
  title: "Homework Mode Deactivated",
  iconUrl: "Icon.png",
  body: "No more homework means no more notifications. See you next time! :)"
}

function onStart() {
  console.log("buttsex");
  chrome.notifications.create(options1);
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('activate').addEventListener('click', function() {
    onStart();
  });
});