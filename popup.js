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

var penis = 1;

function onStart() {
  console.log("buttsex");
  chrome.notifications.create(options1);
  penis = 1337;
}

function onFinish() {
  console.log(penis);
  chrome.notifications.create(options3);
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('activate').addEventListener('click', onStart);
    document.getElementById('deactivate').addEventListener('click', onFinish);
});