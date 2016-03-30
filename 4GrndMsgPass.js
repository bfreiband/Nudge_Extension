//We need to define the port connection on this page as well.
var port = chrome.runtime.connect({name: "PortName"});

//now lets send a message.
port.postMessage({Attribute:"where we define the something refferred to in the other file :P"});

//So postMesssage just takes an object and we can define an object and post that instead.

var obj = {attr: "this is an attribute"};

port.postMessage(obj);

