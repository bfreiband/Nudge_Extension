//This is for longlived connections (like something that is constantly going to be getting messages from outside sources.)
var port = chrome.runtime.connect({name: "PortName"});

//Now we need to listen for new messages.

port.onMessage.addListener(function(msg){
    //Msg is the message object sent into the port.
    if(msg.Attribute == "something we define in sending the message"){
        //do stuff
    }
    
});


//Executing a script on current page.
chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
    //Execute jquery on the page (allows you to use jquery on page)
    chrome.tabs.executeScript(null, { file: "jquery.js" }, function() {
        //Execute next after jquery is loaded on the page.
        chrome.tabs.executeScript(null, { file: "pageOpen.js" });
    });
});
