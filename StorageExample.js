//Let's try storing data in chrome storage
var storage = chrome.storage.local;

//Use set to store objects
var anObject = {stuff: "things"};
storage.set(anObject);

//Use get to retrieve the object by it's variable name.
storage.get(anObject, function(result){
    //result is a copy of anObject
    console.log(result.stuff); //>>things
});

