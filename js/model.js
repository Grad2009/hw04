	'use strict';
	
	var cardBackground = ('images/card_bg001.bmp');
	var cardTypes = ['s','d','h','c'];
	var cardColors = {'s':0,'d':1,'h':1,'c':0};
	var verticalSpaceBetweenCards = 15;
	var cardObjectArray = [];
	var cardCounter  = 0;
	//var countWin = 0;
	var sevenStackArray = [];
	var acesStackArray = [];
	var canRestartDeck;
	//var gameFinished;
	
	
	function sortCards(a,b) {
		return Math.random() - Math.random();	
	}
	
	function revealCard(divObj) {
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
				
				if(no2==no)revealCard(cardObjectArray[cardCounter]);
				cardCounter++;
			}			
		}		
	}
	
	/*function getAvailableEndStack(initID) {
		var numericID = initID.replace(/[^\d]/g,'');
		var obj = document.getElementById('js_End' + no);
		var subObj = obj.getElementsByTagName('DIV');
		if(numericID==1){
			for(var no=0;no<4;no++){
				if(subObj.length==0)return obj;	
			}		
		}else{
			var type = initID.substr(0,1);
			for(var no=0;no<4;no++){
				if(subObj.length>0){
					if(subObj[subObj.length-1].id == type + (numericID-1))return obj;		
				}				
			}			
		}
		
		return false;
	}
	
	
	function finishCard() {
		var dest = getAvailableEndStack(this.parentNode.id);
		var subDivs = this.parentNode.getElementsByTagName('DIV');
		if(subDivs.length>0)return;
		if(this.parentNode.parentNode.id=='js_deck_shown'){
			var parent = this.parentNode.parentNode;
			var subDivs = parent.getElementsByTagName('DIV');
			if(this.parentNode!=subDivs[subDivs.length-1])return;	
			
		}
	
		
		if(dest){
			this.parentNode.style.top = '0px';
			this.parentNode.style.left = '0px';
			dest.appendChild(this.parentNode);
		}
		gameFinished = true;
		for(var no=0;no<acesStackArray.length;no++){
			var tmpDivs = acesStackArray[no].getElementsByTagName('DIV');
			if(tmpDivs.length<13)return;			
		}		
		alert("Congratulations! - you did it.");
	}   */
	
	function getTopDiv(inputDiv){
		while(inputDiv.parentNode && inputDiv.tagName!='BODY'){			
			if(inputDiv.id.indexOf('js_')>=0)return inputDiv;
			inputDiv = inputDiv.parentNode;
		}
		
		return inputDiv;
	}

	//var canRestartDeck = false;
	function initRevealCard() {
		
		var parentObj = getTopDiv(this);
		//var canRestartDeck;
		if(parentObj.id.indexOf('js_seven_card')>=0){	// This card is on the "board" of seven cards
			var subDivs = parentObj.getElementsByTagName('DIV');
			if(this.parentNode==subDivs[subDivs.length-1]){
				revealCard(this.parentNode);		
			}		
		}		
		
		if(parentObj.id=='js_deck_hidden'){
			subDivs = parentObj.getElementsByTagName('DIV');
			var innerDeckCount = subDivs.length-1;
			//var minIndex = Math.max(-3,maxIndex-3);

			if(subDivs.length>0){
				var divsShown = document.getElementById('js_deck_shown').getElementsByTagName('DIV');
				for(var no=0;no<divsShown.length;no++){
					divsShown[no].style.left='0px';
				}					
			}
			//for(var no=maxIndex;no>minIndex+2;no--){
				revealCard(subDivs[innerDeckCount]);
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
		}else{
			parentObj = getTopDiv(this);
		}
		if(parentObj.id=='js_deck_shown' && canRestartDeck){

			var destObj = document.getElementById('js_deck_hidden');
			var subDivs = destObj.getElementsByTagName('DIV');
			if(subDivs.length==0){

				var movingCards = parentObj.getElementsByTagName('DIV');
				canRestartDeck = false;
				for(var no=movingCards.length-1;no>=0;no--){
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
		//var imageArray = new Array();
		
		for(var no=0;no<cardTypes.length;no++){
			//imageArray[no] = new Array();
			
			for(var no2=1;no2<=13;no2++){
				//imageArray[no][no2] = new Image();
				//imageArray[no][no2].src = 'images/bg_' + cardTypes[no] + no2 + '.gif';
				
				var div = document.createElement('DIV');
				div.id = cardTypes[no] + no2;
				div.className='card';
				div.style.left = '0px';
				var img = document.createElement('IMG');
				img.src = 'images/bg_' + cardTypes[no] + no2 + '.gif';
				/*img.style.position = 'absolute';
				img.style.top = '0px';
				img.style.paddingLeft = '1px';
				img.style.paddingRight = '2px';
				img.style.paddingTop = '5px';
				img.style.paddingBottom = '1px';
				img.style.backgroundColor='#FFF';*/
				//img.onselectstart = cancelEvent;
				img.ondragstart = cancelEvent;
				//img.ondblclick = finishCard;
				//img.onmousedown = initCardMove;
				
				var coverImage = document.createElement('IMG');
				
				coverImage.src = cardBackground;
				coverImage.style.position = 'absolute';
				//coverImage.style.zIndex = '2';				
				//coverImage.onselectstart = cancelEvent;
				coverImage.ondragstart = cancelEvent;
				coverImage.onclick = initRevealCard;
				//coverImage.style.border = '1px solid #000000';			
				coverImage.style.paddingLeft = '0px';
				coverImage.style.paddingRight = '0px';
				//coverImage.style.backgroundColor='#CCC';
				div.appendChild(img);
				div.appendChild(coverImage);				
				cardObjectArray.push(div);				
				cardCounter++;
			}	
		}	

		var js_aces = document.getElementById('js_aces');
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