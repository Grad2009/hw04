'use strict';

document.getElementById('js_deck_hidden').onclick = restartDeck;

document.ondragstart = (function(){return false});


document.onmousedown = function(e) {

  var dragElement = e.target.parentNode;
  var dragZone = e.target.parentNode.parentNode;
  //var countWin = 0;
  var dropElem;
  var dropped = false;
  //var self = this;

  if (!dragElement.classList.contains('draggable')) return;
  
  

  var coords, shiftX, shiftY;

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
	//dragElement.style.zIndex = 1000;

    document.body.appendChild(dragElement);

    moveAt(clientX, clientY);
  }

  function moveAt(clientX, clientY) {
    var newX = clientX - shiftX;
    var newY = clientY - shiftY;
    
    var newBottom = newY + dragElement.offsetHeight;

    if (newBottom > document.documentElement.clientHeight) {
		var docBottom = document.documentElement.getBoundingClientRect().bottom;
		var scrollY = Math.min(docBottom - newBottom, 10);
		if (scrollY < 0) scrollY = 0;

		window.scrollBy(0, scrollY);
		newY = Math.min(newY, document.documentElement.clientHeight - dragElement.offsetHeight);
    }

    if (newY < 0) {
		var scrollY = Math.min(-newY, 10);
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
  
  function findDroppable(event) {
 dragElement.hidden = true;
// получить самый вложенный элемент под курсором мыши
  var elem = document.elementFromPoint(event.clientX, event.clientY).parentNode;
// показать переносимый элемент обратно
  dragElement.hidden = false;
if (elem === null || !elem.classList.contains('droppable') ) {
 // такое возможно, если курсор мыши "вылетел" за границу окна
    return null;
  }

  return elem.closest('.droppable');
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
				};
		}
		if (countWin === 4) {
				return true;
			} else {
				return false;
			};
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
	
	function appendToSeven (dragElement, topPos, leftPos) {
		for(var no=0;no<board.sevenArray.length;no++){
			var tmpLeft = getleftPos(board.sevenArray[no]);
			var tmpTop = getTopPos(board.sevenArray[no]);			
			var subDivs = board.sevenArray[no].getElementsByTagName('DIV').length;
			if(leftPos>=tmpLeft-80 && leftPos<=tmpLeft+80 && topPos>=tmpTop-80 && topPos<=(tmpTop+80 + (subDivs*10))){
				var topDivTarget = getTopDiv(dragElement);
				if(topDivTarget!=board.sevenArray[no]){
					var tmpDivs = board.sevenArray[no].getElementsByTagName('DIV');					
					var cardTypeThis = dragElement.id.substr(0,1);
					var numericIDThis = dragElement.id.slice(1);					
					if(tmpDivs.length==0){
						if(numericIDThis==13){
							dragElement.style.top = '0px';
							finishDrag(dragElement);
							board.sevenArray[no].appendChild(dragElement);
							
							return dropped = true;
						}						
					}else{						
						var destDiv = tmpDivs[tmpDivs.length-1];						
						var cardTypeDest = destDiv.id.substr(0,1);						
						var numericIDDest = destDiv.id.slice(1);						
						if(card.colors[cardTypeDest]!=card.colors[cardTypeThis] && numericIDDest-1==numericIDThis){
							dragElement.style.top = '20px';
							finishDrag(dragElement);
							destDiv.appendChild(dragElement);
							
							return dropped = true; 
						}
					}
				}	
			}			
		} return dropped = false;
	}
	
	function appendToAces (dragElement, topPos, leftPos) {
		for(var no=0;no<board.acesArray.length;no++){
			
			var tmpLeft = getleftPos(board.acesArray[no]);
			var tmpTop = getTopPos(board.acesArray[no]);			
			var tmpDivs = board.acesArray[no].getElementsByTagName('DIV');			
			
			if(leftPos>=tmpLeft-80 && leftPos<=tmpLeft+80 && topPos>=tmpTop-80 && topPos<=tmpTop+80){
				var topDivTarget = getTopDiv(dragElement);
				if(topDivTarget!=board.acesArray[no]){
					var cardTypeThis = dragElement.id.substr(0,1);
					var numericIDThis = dragElement.id.slice(1);
					if(tmpDivs.length==0){
						if(numericIDThis==1){
							dragElement.style.top = '0px';
							finishDrag(dragElement);
							board.acesArray[no].appendChild(dragElement);
							return dropped = true;
						}
						
					}else{
						var destDiv = tmpDivs[tmpDivs.length-1];						
						var cardTypeDest = destDiv.id.substr(0,1);						
						var numericIDDest = destDiv.id.slice(1);						
						if(cardTypeDest==cardTypeThis && numericIDDest==(numericIDThis-1)){
							dragElement.style.top = '0px';
							finishDrag(dragElement);
							destDiv.appendChild(dragElement);
							dragElement.classList.remove('draggable');
							if (checkWin()) {
								alert("You did it!");
							} 
						
						return dropped = true;
						}
					}   
				}	
			}
		}
	}	
	
	function stopMoveCard(dragElement, dragZone) {
		
		var leftPos = parseInt(dragElement.style.left);
		var topPos = parseInt(dragElement.style.top);	
		
		appendToSeven (dragElement, topPos, leftPos);
		
		if (dropped) {
			return;
		} else {
			appendToAces (dragElement, topPos, leftPos);
		}
		
		if (dropped) {
			return;
		} else {
			rollback (dragElement, dragZone);
			return;
		}
	}
	// отменим действие по умолчанию на mousedown (выделение текста, оно лишнее)
	return false;
}	
