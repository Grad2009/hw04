	'use strict';
	
	var cardBackground = ('images/card_bg001.bmp');
	var cardTypes = ['s','d','h','c'];
	var cardColors = {'s':0,'d':1,'h':1,'c':0};
	var verticalSpaceBetweenCards = 15;
	var cardObjectArray = [];
	var cardCounter  = 0;
	var sevenStackArray = [];
	var acesStackArray = [];
	var canRestartDeck;
	
	
	function sortCards(a,b) {
		return Math.random() - Math.random();	
	}
	
	function showCard(divObj) {
		var imgs = divObj.getElementsByTagName('IMG');
		divObj.classList.add('draggable');
		imgs[1].style.display='none';						// backside of card
		
	}
	
	function coverCard(divObj) {
		var imgs = divObj.getElementsByTagName('IMG');
		divObj.classList.remove('draggable');
		imgs[1].style.display='';
		
	}
	
	function dealCards() {
		var cardCounter = 0;
		for(var no=0;no<7;no++){
			for(var no2=no;no2<7;no2++){
				var obj = document.getElementById('js_seven_card'+no2);
				var subs = obj.getElementsByTagName('DIV');
				if(subs.length==0){
					obj.appendChild(cardObjectArray[cardCounter]);
					cardObjectArray[cardCounter].style.top = '0px';
				}else{
					subs[subs.length-1].appendChild(cardObjectArray[cardCounter]);	
					cardObjectArray[cardCounter].style.top = verticalSpaceBetweenCards + 'px';
				}
				
				if(no2==no)showCard(cardObjectArray[cardCounter]);
				cardCounter++;
			}			
		}		
	}
	
	
	function getTopDiv(inputDiv){
		while(inputDiv.parentNode && inputDiv.tagName!='BODY'){			
			if(inputDiv.id.indexOf('js_')>=0)return inputDiv;
			inputDiv = inputDiv.parentNode;
		}
		
		return inputDiv;
	}

	function initRevealCard() {
		
		var parentObj = getTopDiv(this);
		if(parentObj.id.indexOf('js_seven_card')>=0){			// This card is on the "board" of seven cards
			var subDivs = parentObj.getElementsByTagName('DIV');
			if(this.parentNode==subDivs[subDivs.length-1]){
				showCard(this.parentNode);		
			}		
		}		
		
		if(parentObj.id=='js_deck_hidden'){
			subDivs = parentObj.getElementsByTagName('DIV');
			var innerDeckCount = subDivs.length-1;
			
			if(subDivs.length>0){
				var divsShown = document.getElementById('js_deck_shown').getElementsByTagName('DIV');
				for(var no=0;no<divsShown.length;no++){
					divsShown[no].style.left='0px';
				}					
			}
				showCard(subDivs[innerDeckCount]);
				subDivs[innerDeckCount].style.left = '0px'; 
				document.getElementById('js_deck_shown').appendChild(subDivs[innerDeckCount]);
			
			canRestartDeck = false;
			setTimeout('canRestartDeck = true', 200);

			return false;
		}
	}	
		
	function restartDeck() {

		if(this.id=='js_deck_hidden'){
			var parentObj = document.getElementById('js_deck_shown');
		} else {
			parentObj = getTopDiv(this);
		}
		if(parentObj.id=='js_deck_shown' && canRestartDeck){

			var destObj = document.getElementById('js_deck_hidden');
			var subDivs = destObj.getElementsByTagName('DIV');
			if(subDivs.length==0){

				var movingCards = parentObj.getElementsByTagName('DIV');
				canRestartDeck = false;
				for(var no = movingCards.length-1; no>=0; no--) {
					coverCard(movingCards[no]);		
					movingCards[no].style.left = '0px';			
					destObj.appendChild(movingCards[no]);
				}
			}			
		}
	}
	
	function cancelEvent() {
		return false;
	}
	
	function resetGame() {
		cardObjectArray = cardObjectArray.sort(sortCards);

		var deck = document.getElementById('js_deck_hidden');
		for(var no=0;no<cardObjectArray.length;no++){
			cardObjectArray[no].style.top = '0px';
			coverCard(cardObjectArray[no]);		
			cardObjectArray[no].style.left = '0px';
			deck.appendChild(cardObjectArray[no]);
		}		
		dealCards();
		
		return false;
	}
	
	function initSolitaire() {
		for(var no=0;no<cardTypes.length;no++){
			
			for(var no2=1;no2<=13;no2++){
		
		// siut side of cards		
				var div = document.createElement('DIV');
				div.id = cardTypes[no] + no2;
				div.className='card';
				div.style.left = '0px';
				var img = document.createElement('IMG');
				img.src = 'images/bg_' + cardTypes[no] + no2 + '.gif';
				img.ondragstart = cancelEvent;
				
		// backside of cards		
				var coverImage = document.createElement('IMG');
				coverImage.src = cardBackground;
				coverImage.style.position = 'absolute';
				coverImage.ondragstart = cancelEvent;
				coverImage.onclick = initRevealCard;
				coverImage.style.paddingLeft = '0px';
				coverImage.style.paddingRight = '0px';
				div.appendChild(img);
				div.appendChild(coverImage);				
				cardObjectArray.push(div);				
				cardCounter++;
			}	
		}	

		var js_aces = document.getElementById('js_aces');
		
		// aces stack 
			for( no=0;no<4;no++){
			div = document.createElement('DIV');
			div.style.width = '72px';
			div.style.position = 'absolute';
			div.style.top = '20px';
			div.style.left = 20 + (no*110) + 'px';
			div.style.height = '98px';
			div.style.border='1px dotted #CCC';
			div.style.backgroundColor = '#ACD5AC';
			div.id = 'js_End' + no;			
			js_aces.appendChild(div);	
			acesStackArray.push(div);	
		}
		
		//seven stack
		var js_seven = document.getElementById('js_seven');
		for( no=0;no<7;no++){
			div = document.createElement('DIV');
			div.style.width = '100px';
			div.style.position = 'absolute';
			div.style.top = '20px';
			div.id = 'js_seven_card'+no;
			div.style.left = 20 + (no*105) + 'px';
			div.style.height = '100px';
			js_seven.appendChild(div);	
			sevenStackArray.push(div);
		}	
		
		document.getElementById('js_deck_hidden').onclick = restartDeck;
		
		resetGame();
	}
