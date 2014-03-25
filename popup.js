var tabs = [];
var age = null;
var myText = null;
var samples = null;
var results = $('#results');
$(function(){
	$('button').click(function(){
		age = $('#age').val();
		myText = $('#myText').val();
		tabs = [];
		chrome.storage.local.get(null, function(data){
			samples = data.items;
			for(i = 0, l = samples.length; i < l; i++) {
				chrome.tabs.create({
					url: 'http://secretlifeofpronouns.com/exercise/synch/input.php',
					active: false
				}, onTabCreated);
			}
		});
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
    if (request.greeting === "injected") {
    	sendResponse({other: searchSample(sender.tab.id), age: age, myText: myText});
    } else if(typeof request.lsm === 'number') {
    	var sample = searchSample(sender.tab.id);
    	sample.lsm = request.lsm;
    	addSampleToGraph(sample);
    	chrome.tabs.remove(sender.tab.id);
    }
});

function searchSample(tabId) {
	for (i = 0, l = samples.length; i < l; i++) {
		var sample = samples[i];
		if (sample.tabId === tabId) return sample;
	}
}

function addSampleToGraph(sample) {
	results.show();
	results.append('<div class=resultItem title="'+sample.name+'"><div class="bar"><div style="height:'+Math.round(sample.lsm*100)+'%;"></div></div>'+sample.lsm+'</div>');
}