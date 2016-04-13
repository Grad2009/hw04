'use strict';

document.getElementById('js_deck_hidden').onclick = restartDeck;

document.ondragstart = (function(){return false});


document.onmousedown = function(e) {

  var dragElement = e.target.parentNode;
  var dragZone = e.target.parentNode.parentNode;
  var cardHolderNumber = 0;
  var flagOfFinding = false;
  var dropElem;
  var dropped = false;
  var coords, shiftX, shiftY, newX, newY;
  
  if (!dragElement.classList.contains('draggable')) return;
  startDrag(e.clientX, e.clientY);
	
	document.onmousemove = function(e) {
    moveAt(e.clientX, e.clientY);
	};

	dragElement.onmouseup = function() {
    stopMoveCard(dragElement, dragZone);
	};


  function startDrag(clientX, clientY) {
	shiftX = clientX - dragElement.getBoundingClientRect().left;
    shiftY = clientY - dragElement.getBoundingClientRect().top;
	dragElement.style.position = 'fixed';
	document.body.appendChild(dragElement);
	moveAt(clientX, clientY);
  }

  function moveAt(clientX, clientY) {
    newX = clientX - shiftX;
    newY = clientY - shiftY;
    var newBottom = newY + dragElement.offsetHeight;

    if (newBottom > document.documentElement.clientHeight) {
		var docBottom = document.documentElement.getBoundingClientRect().bottom;
		var scrollY = Math.min(docBottom - newBottom, 10);
		if (scrollY < 0) scrollY = 0;

		window.scrollBy(0, scrollY);
		newY = Math.min(newY, document.documentElement.clientHeight - dragElement.offsetHeight);
    }

    if (newY < 0) {
		scrollY = Math.min(-newY, 10);
		if (scrollY < 0) scrollY = 0; // поправим ошибку округления

		window.scrollBy(0, -scrollY);
		newY = Math.max(newY, 0);
    }

    if (newX < 0) newX = 0;
    if (newX > document.documentElement.clientWidth - dragElement.offsetHeight) {
      newX = document.documentElement.clientWidth - dragElement.offsetHeight;
    }

    dragElement.style.left = newX + 'px';
    dragElement.style.top = newY + 'px';
 }

  
	function finishDrag(dragElement) {
		dragElement.style.left = '0px';
		dragElement.style.position = 'absolute';
		document.onmousemove = null;
		dragElement.onmouseup = null;
	}
  
	function getTopPos(inputObj) {
		var returnValue = inputObj.offsetTop;
		while((inputObj = inputObj.offsetParent) != null){
			returnValue += inputObj.offsetTop;
		}
		
		return returnValue;
	}
	
	function getleftPos(inputObj) {
		var returnValue = inputObj.offsetLeft;
		
		while((inputObj = inputObj.offsetParent) != null) {
			returnValue += inputObj.offsetLeft;
		}
		
		return returnValue;
	}
	
	function checkWin () {
		var countWin = 0;
		for (var no=0;no<board.acesArray.length;no++){
			var tmpDivs = board.acesArray[no].getElementsByTagName('DIV');			
				if (tmpDivs.length < 13) {
					return;
				} else {
					countWin++;
				}
		}
		if (countWin === 4) {   // all four suites finished
				return true;
			} else {
				return false;
			}
	}
	
	function rollback (dragElement, dragZone) {
		if(!dragZone.id.indexOf ('js_')) {
				dragElement.style.top = '0px'; 
			} else {
			dragElement.style.top = '20px';
			}
			finishDrag(dragElement);
			dragZone.appendChild(dragElement);		
	}
	
	function appendChild (dropObj, dragElement, topValue) {
		dragElement.style.top = topValue + 'px';
		finishDrag(dragElement);
		dropObj.appendChild(dragElement);
	}
	
	function findDropObj (dragElement, arrayObj) {
		var accuracyValue = 70;
		flagOfFinding = false;
		for(var i=0;i<arrayObj.length;i++){
			var tmpLeft = getleftPos(arrayObj[i]);
			var element = arrayObj[i];
			var left = element.offsetLeft;
			var right = element.offsetLeft + element.offsetWidth;
			var top = element.offsetTop;
			var bottom = element.offsetTop + element.offsetHeight;
			var tmpTop = getTopPos(arrayObj[i]);			
			var subDivs = arrayObj[i].getElementsByTagName('DIV').length;
			if(newX>=tmpLeft-accuracyValue && newX<=tmpLeft+accuracyValue &&
			newY>=tmpTop-100 && newY<=(tmpTop+100 + (subDivs*20))) {
			//	????var topDivTarget = getTopDiv(dragElement);
				cardHolderNumber = i;
				flagOfFinding = true;
			
			return cardHolderNumber, flagOfFinding;
			}
		}	
	}
	
	function checkForCard (dragElement, cardHolderNumber, checkedCard) {
		if (checkedCard === card.values[12]) {
			checkForKing (dragElement, cardHolderNumber);
		} else {
			checkForAce (dragElement, cardHolderNumber);
		}
	}
	
	function checkForKing (dragElement, cardHolderNumber) {
		// card.values[12] matches for King
		if (+dragElement.id.slice(1) === card.values[12]){
			appendChild (board.sevenArray[cardHolderNumber], dragElement, 0)
						
			return dropped = true;
		}
	}
	
	function checkForAce (dragElement, cardHolderNumber) {
		// card.values[0] matches for Ace
		if (+dragElement.id.slice(1) === card.values[0]) {			
			appendChild (board.acesArray[cardHolderNumber], dragElement, 0)
						
			return dropped = true;
		}
	}
	
	function checkForAppendToSevenOrAce (dragElement, arrayObj, tmpDivs) {
		var cardSuitDrag = dragElement.id.substr(0,1);
		var cardValueDrag = +dragElement.id.slice(1);				
		var destDiv = tmpDivs[tmpDivs.length-1];						
		var cardSuitDest = destDiv.id.substr(0,1);						
		var cardValueDest = +destDiv.id.slice(1);
		var quantityOfMovedCards = dragElement.getElementsByTagName('DIV').length+1;
		// rule for seven stack
		if	(arrayObj === board.sevenArray) {
			if(card.colors[cardSuitDest] !== card.colors[cardSuitDrag] 
				&& (cardValueDest-1) === cardValueDrag){
				appendChild (destDiv, dragElement, 20);
				
				return dropped = true;
			}
		} else {
	// rule for aces stack
			if (quantityOfMovedCards > 1) {return;}
			if(cardSuitDest === cardSuitDrag 
				&& cardValueDest === (cardValueDrag-1)) {
				appendChild (destDiv, dragElement, 0);
				dragElement.classList.remove('draggable');
				
				return dropped = true;
			}
		}
	}
	
	function appendToSomeStack(arrayObj, checkedCard, cardHolderNumber) {
		var tmpDivs = arrayObj[cardHolderNumber].getElementsByTagName('DIV');
			if(tmpDivs.length === 0) {
				checkForCard (dragElement, cardHolderNumber, checkedCard);
				return;
			
			} else {						
				checkForAppendToSevenOrAce(dragElement, arrayObj, tmpDivs);
			}
		
	}
	
	function appendToSeven (dragElement) {
		findDropObj (dragElement, board.sevenArray);
		// if dragElement is not over seven stack 
		if (!flagOfFinding) {				
			return;
		} else {
		// card.values[12] matches for King
			appendToSomeStack(board.sevenArray, card.values[12], cardHolderNumber);
		}				
	}
	
	function appendToAces (dragElement) {
		findDropObj (dragElement, board.acesArray);
		// if dragElement is not over aces stack 
		if (!flagOfFinding) {				
			return;
		} else {
		// card.values[0] matches for Ace
			appendToSomeStack(board.acesArray, card.values[0], cardHolderNumber);
		}	
	}

	function stopMoveCard(dragElement, dragZone) {
		appendToSeven (dragElement);
		
		if (dropped) {
			return;
		} else {
			appendToAces (dragElement);
			if(checkWin()) {
				alert ('You win!');
				window.reload;
			}
		}
		
		if (dropped) {
			return;
		} else {
			rollback (dragElement, dragZone);
			return dropped = false;
		}
	}
	// отменим действие по умолчанию на mousedown (выделение текста, оно лишнее)
	return false;
};
