var tabs = [];
var age = null;
var myText = null;
$(function(){
	$('button').click(function(){
		age = $('#age').val();
		myText = $('#myText').val();
		tabs = [];
		for(i = 0, l = samples.length; i < l; i++) {
			chrome.tabs.create({
				url: 'http://secretlifeofpronouns.com/exercise/synch/input.php',
				active: false
			}, onTabCreated);
		}
	});
});

function onTabCreated(tab) {
	tabs.push(tab);
	//waiting all to load for sync issues
	if(tabs.length === samples.length) {
		for(i = 0, l = samples.length; i < l; i++) {
			console.log(tabs[i].id);
			samples[i].tabId = tabs[i].id;
			chrome.tabs.executeScript(tabs[i].id, {file: 'input.js'});
		}
	}
}

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    if (request.greeting == "injected") {
    	console.log('got message');
    	sendResponse({other: searchSample(sender.tab.id), age: age, myText: myText});
    }
});

function searchSample(tabId) {
	for (i = 0, l = samples.length; i < l; i++) {
		var sample = samples[i];
		if (sample.tabId === tabId) return sample;
	}
}