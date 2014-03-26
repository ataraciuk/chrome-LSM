var tabs = [];
var age = null;
var myText = null;
var samples = null;
var results = $('#results');
var bars = results.children('#bars');
var legends = results.children('#legends');
var lastAppended = 1;
var nextTab = 0;
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
		}
		chrome.tabs.executeScript(tabs[nextTab].id, {file: 'input.js'});
	}
}

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    if (request.greeting === "injected") {
    	sendResponse({other: searchSample(sender.tab.id), age: age, myText: myText, delay: searchIndex(sender.tab.id)+1});
    } else if(typeof request.lsm === 'number') {
    	var sample = searchSample(sender.tab.id);
    	sample.lsm = request.lsm;
    	addSampleToGraph(sample);
    	chrome.tabs.remove(sender.tab.id);
    	if(++nextTab < tabs.length) setTimeout(function(){chrome.tabs.executeScript(tabs[nextTab].id, {file: 'input.js'});},100);
    }
});

function searchSample(tabId) {
	for (i = 0, l = samples.length; i < l; i++) {
		var sample = samples[i];
		if (sample.tabId === tabId) return sample;
	}
}

function searchIndex(tabId) {
	for (i = 0, l = samples.length; i < l; i++) {
		var sample = samples[i];
		if (sample.tabId === tabId) return i;
	}
}

function addSampleToGraph(sample) {
	results.show();
	var height = Math.round(sample.lsm*100);
	bars.append('<div class=resultItem title="'+sample.name+'"><div class="bar"><div class="filledBar" style="height:'+height+'%;"></div><div class="barAmount" style="bottom:'+(height)+'%;">'+sample.lsm+'</div></div>'+lastAppended+'</div>');
	legends.append('<div>'+lastAppended+': '+sample.name+'</div>');
	lastAppended++;
	results.css('min-width',(lastAppended*48)+'px');
}