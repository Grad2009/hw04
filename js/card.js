'use strict';

var card = {};
	card.suites = ['s','d','h','c'];
	card.colors = {'s':0,'d':1,'h':1,'c':0};
	card.values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
	card.Arrays = [];
		
var board = {
	acesArray: [],
	sevenArray: []
}


function createCard (i, j) {
	var element = document.createElement('div');
    element.classList.add('card');
	element.id = card.suites[i] + card.values[j];
	var img = document.createElement('img');
	img.src = 'images/bg_' + card.suites[i] + card.values[j] + '.gif';
	element.appendChild(img);
	//img.ondragstart = cancelEvent;
    var coverImage = document.createElement('IMG');
	coverImage.src = 'images/card_bg001.bmp';
	coverImage.onclick = initRevealCard;
	coverImage.classList.add('cover');
	element.appendChild(coverImage);
	card.Arrays.push(element);
	return card.Arrays;
}

function createBoard () {
	var	ace, seven;
// aces stack (four aces)
	var js_aces = document.getElementById('js_aces');
	for(var i=0;i<4;i++){
		ace = document.createElement('DIV');
		ace.classList.add('ace');
		ace.style.left = 85 + (i*150) + 'px';
		ace.id = 'js_End' + i;			
		js_aces.appendChild(ace);	
		board.acesArray.push(ace);	
	}

//seven stack
	var js_seven = document.getElementById('js_seven');
	for( i=0;i<7;i++){
		seven = document.createElement('DIV');
		seven.id = 'js_seven_card'+i;
		seven.style.left = 50 + (i*130) + 'px';
		js_seven.appendChild(seven);	
		board.sevenArray.push(seven);
	}
	
	return  board.acesArray, board.sevenArray;
}

