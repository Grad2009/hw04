document.onmousedown = function(e) {

  var dragElement = e.target.parentNode;
  var dragZone = e.target.parentNode.parentNode;
  var countWin = 0;
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

    document.body.appendChild(dragElement);

    moveAt(clientX, clientY);
  }

  function moveAt(clientX, clientY) {
    // новые координаты
    var newX = clientX - shiftX;
    var newY = clientY - shiftY;

    // ------- обработаем вынос за нижнюю границу окна ------
    // новая нижняя граница элемента
    var newBottom = newY + dragElement.offsetHeight;

    // если новая нижняя граница вылезает вовне окна - проскроллим его
    if (newBottom > document.documentElement.clientHeight) {
      // координата нижней границы документа относительно окна
      var docBottom = document.documentElement.getBoundingClientRect().bottom;

      // scrollBy, если его не ограничить - может заскроллить за текущую границу документа
      // обычно скроллим на 10px
      // но если расстояние от newBottom до docBottom меньше, то меньше
      var scrollY = Math.min(docBottom - newBottom, 10);

      // ошибки округления при полностью прокрученной странице
      // могут привести к отрицательному scrollY, что будет означать прокрутку вверх
      // поправим эту ошибку
      if (scrollY < 0) scrollY = 0;

      window.scrollBy(0, scrollY);

      // резким движением мыши элемент можно сдвинуть сильно вниз
      // если он вышел за нижнюю границу документа -
      // передвигаем на максимально возможную нижнюю позицию внутри документа
      newY = Math.min(newY, document.documentElement.clientHeight - dragElement.offsetHeight);
    }


    // ------- обработаем вынос за верхнюю границу окна ------
    if (newY < 0) {
      // проскроллим вверх на 10px, либо меньше, если мы и так в самом верху
      var scrollY = Math.min(-newY, 10);
      if (scrollY < 0) scrollY = 0; // поправим ошибку округления

      window.scrollBy(0, -scrollY);
      // при резком движении мыши элемент мог "вылететь" сильно вверх, поправим его
      newY = Math.max(newY, 0);
    }


    // зажать в границах экрана по горизонтали
    // здесь прокрутки нет, всё просто
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


	
	//var verticalSpaceBetweenCards = 15;
	
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
		for (var no=0;no<acesStackArray.length;no++){
			var tmpDivs = acesStackArray[no].getElementsByTagName('DIV');			
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
			dragElement.style.top = verticalSpaceBetweenCards + 'px';
			}
			finishDrag(dragElement);
			dragZone.appendChild(dragElement);		
	}
	
	function appendToSeven (dragElement, topPos, leftPos) {
		for(var no=0;no<sevenStackArray.length;no++){
			var tmpLeft = getleftPos(sevenStackArray[no]);
			var tmpTop = getTopPos(sevenStackArray[no]);			
			var subDivs = sevenStackArray[no].getElementsByTagName('DIV').length;
			if(leftPos>=tmpLeft-80 && leftPos<=tmpLeft+80 && topPos>=tmpTop-80 && topPos<=(tmpTop+80 + (subDivs*10))){
				var topDivTarget = getTopDiv(dragElement);
				if(topDivTarget!=sevenStackArray[no]){
					var tmpDivs = sevenStackArray[no].getElementsByTagName('DIV');					
					var cardTypeThis = dragElement.id.substr(0,1);
					var numericIDThis = dragElement.id.replace(/[^\d]/g,'');					
					if(tmpDivs.length==0){
						if(numericIDThis==13){
							dragElement.style.top = '0px';
							finishDrag(dragElement);
							sevenStackArray[no].appendChild(dragElement);
							
							return dropped = true;
						}						
					}else{						
						var destDiv = tmpDivs[tmpDivs.length-1];						
						var cardTypeDest = destDiv.id.substr(0,1);						
						var numericIDDest = destDiv.id.replace(/[^\d]/g,'');						
						if(cardColors[cardTypeDest]!=cardColors[cardTypeThis] && numericIDDest-1==numericIDThis){
							dragElement.style.top = verticalSpaceBetweenCards + 'px';
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
		for(var no=0;no<acesStackArray.length;no++){
			
			var tmpLeft = getleftPos(acesStackArray[no]);
			var tmpTop = getTopPos(acesStackArray[no]);			
			var tmpDivs = acesStackArray[no].getElementsByTagName('DIV');			
			
			if(leftPos>=tmpLeft-80 && leftPos<=tmpLeft+80 && topPos>=tmpTop-80 && topPos<=tmpTop+80){
				var topDivTarget = getTopDiv(dragElement);
				if(topDivTarget!=acesStackArray[no]){
					var cardTypeThis = dragElement.id.substr(0,1);
					var numericIDThis = dragElement.id.replace(/[^\d]/g,'');
					if(tmpDivs.length==0){
						if(numericIDThis==1){
							dragElement.style.top = '0px';
							finishDrag(dragElement);
							acesStackArray[no].appendChild(dragElement);
							return dropped = true;
						}
						
					}else{
						var destDiv = tmpDivs[tmpDivs.length-1];						
						var cardTypeDest = destDiv.id.substr(0,1);						
						var numericIDDest = destDiv.id.replace(/[^\d]/g,'');						
						if(cardTypeDest==cardTypeThis && numericIDDest==(numericIDThis-1)){
							dragElement.style.top = '0px';
							finishDrag(dragElement);
							destDiv.appendChild(dragElement);
							dragElement.classList.remove('draggable');
							if (checkWin()) {
								alert("Congratulations! - you did it.");
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
