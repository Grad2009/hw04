window.onload = startGame();

var cardCounter  = 0,
	canRestartDeck;

function startGame() {
		for(var suit in card.suites) {
			for(var value in card.values){
				createCard (suit, value);
			}	
		}	

		createBoard ();
		
		resetGame();
	}
	
	function showCard(obj) {
		var imgs = obj.getElementsByTagName('IMG');
		obj.classList.add('draggable');
		obj.classList.add('droppable');
		imgs[1].style.display='none';						// backside of card
		
	}
	
	function coverCard(obj) {
		var imgs = obj.getElementsByTagName('IMG');
		obj.classList.remove('draggable');
		obj.classList.remove('droppable');
		imgs[1].style.display='';
		
	}
	
	function dealCards() {
		var cardCounter = 0;
		for(var sevenSetCount=0;sevenSetCount<board.sevenArray.length;sevenSetCount++){
			for(var cardCount=sevenSetCount;cardCount<board.sevenArray.length;cardCount++){
				var obj = document.getElementById('js_seven_card'+cardCount);
				var subs = obj.getElementsByTagName('DIV');
				if(subs.length==0){
					obj.appendChild(card.Arrays[cardCounter]);
					card.Arrays[cardCounter].style.top = '0px';
				}else{
					subs[subs.length-1].appendChild(card.Arrays[cardCounter]);	
					card.Arrays[cardCounter].style.top = '20px';
				}
				
				if(cardCount==sevenSetCount)showCard(card.Arrays[cardCounter]);
				cardCounter++;
			}			
		}		
	}
	
	function sortCards(a,b) {
		return Math.random() - .5;	
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
		if(parentObj.id.indexOf('js_seven_card')>=0){			// This card is on the board of seven set
			var subDivs = parentObj.getElementsByTagName('DIV');
			if(this.parentNode === subDivs[subDivs.length-1]){
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
			setTimeout('canRestartDeck = true', 500);
			
			return false;
		}
	}	
		
	function restartDeck() {

		if(this.id=='js_deck_hidden'){
			var parentObj = document.getElementById('js_deck_shown');
		} else {
			parentObj = getTopDiv(this);
		}
		if(parentObj.id === 'js_deck_shown' && canRestartDeck){

			var destObj = document.getElementById('js_deck_hidden');
			var subDivs = destObj.getElementsByTagName('DIV');
			if(subDivs.length === 0){

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
	
	function resetGame() {
		card.Arrays = card.Arrays.sort(sortCards);

		var deck = document.getElementById('js_deck_hidden');
		for(var i=0;i<card.Arrays.length;i++){
			card.Arrays[i].style.top = '0px';
			coverCard(card.Arrays[i]);		
			card.Arrays[i].style.left = '0px';
			deck.appendChild(card.Arrays[i]);
		}		
		dealCards();
		
		return false;
	}