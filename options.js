$(function(){
	var ul = $('ul');
	chrome.storage.local.get(null, function(data){
		var items = data.items;
		for(i = 0, l = items.length; i < l; i++) {
			var item = items[i];
			ul.append(fieldHTML(item.name, item.age, item.sample));
		}
	});

	$('#addPerson').click(function(e){
		e.preventDefault();
		ul.append(fieldHTML('','',''));
	});

	$('#save').click(function(e){
		var items = [];
		$('li').each(function(){
			var li = $(this);
			items.push({name: li.find('.name').val(), age: li.find('.age').val(), sample: li.find('textarea').val()});
		});
		chrome.storage.local.set({items: items}, function(){
			$('#status').addClass('saved');
			setTimeout(function(){$('#status').removeClass()}, 3000);
		});
	});
});

function fieldHTML(name, age, sample) {
	return '<li><label>Name of celebrity<input type="text" class="name" value="'+
				name+'"/><br/><label>Age of person at the moment of the text sample<input type="text" class="age" value="'+
				age+'"/><br/><label>Text sample<textarea>'+
				sample+'</textarea></li>';
}