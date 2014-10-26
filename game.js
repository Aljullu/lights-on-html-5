// disable native touchmove behavior to 
// prevent overscroll
function preventBehavior(e) { 
	e.preventDefault(); 
};
document.addEventListener("touchmove", preventBehavior, false);
// hide the address bar on Android devices
if (/Android/.test(navigator.userAgent)) {
    $("html").height("200%");
    setTimeout(function() {
        window.scrollTo(0, 1);
    }, 0);
}

$(document).ready(function() {
	var click = {
		splash_screen:	function() {
							$('#splash_screen').removeClass('active');
							$('#game_screen').addClass('active');
							activeClass = "game_screen";
							loadMap();
						}
	}
	var activeClass = "splash_screen";
	$('#splash_screen').addClass('active');
	$('#splash_screen').click(function(e) {
		click[activeClass]();
	});
});

var loadMap = function() {
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext('2d');

	// It draws the map
	ctx.strokeStyle = "rgb(0,0,0)"; // border color
	
	var width = 320;
	var height = 480;
	var cellSize = Math.min(320/5,480/7);
	var cellBorder = 1;
	var rows = 7;
	var cols = 5;

	var mapCells = new Array(cols); // create a matrix
	for (var i = 0; i < cols; i++) {
		mapCells[i] = new Array(rows);
	}

	
	var open = {
		color: "rgb(255,255,0)",
		state: "open"
	}
	var closed = {
		color: "rgb(0,0,0)",
		state: "closed"
	}

	for (var j = 0; j < rows; j++) {
		for (var i = 0; i < cols; i++) {
			mapCells[i][j] = closed;
		}
	}

	mapCells[1][2] = open;
	mapCells[2][2] = open;
	mapCells[3][2] = open;
	mapCells[2][3] = open;
	mapCells[1][4] = open;
	mapCells[2][4] = open;
	mapCells[3][4] = open;

	printMap();

	function printMap() {
		var open = 0;
		for (var j = 0; j < rows; j++) {
			for (var i = 0; i < cols; i++) {
				if (mapCells[i][j].state == "open") {
					open++;
				}
				ctx.fillStyle = mapCells[i][j].color; // background color
				ctx.fillRect (i*cellSize+cellBorder, j*cellSize+cellBorder, cellSize-2*cellBorder, cellSize-2*cellBorder); // draw background
			}
		}
		if (open == 0) {
			alert("You win!");
		}
		//$('#open-counter-number').empty().append(open);
	}

	// Interface
	$('#canvas').click(function(e){
		var positionClicked = getCursorPosition(e);
		var col = Math.floor(positionClicked.x/cellSize);
		var row = Math.floor(positionClicked.y/cellSize);
		toggle(row+1,col);
		toggle(row-1,col);
		toggle(row,col);
		toggle(row,col+1);
		toggle(row,col-1);
		printMap();
	});

	function toggle(row,col) {
		if (row >= 0 && row < rows && col >= 0 && col < cols) {
			if (mapCells[col][row].state == "open") {
				mapCells[col][row] = closed;
			}
			else {
				mapCells[col][row] = open;
			}
		}
	}

	// gets the cell where the mouse is poiting
	function getCursorPosition(e) {
		var position = {
			x: 0,
			y: 0
		}
		if (e.pageX || e.pageY) {
			position.x = e.pageX;
			position.y = e.pageY;
		}
		else {
			position.x = e.clientX + $('body').scrollLeft + $(document).scrollLeft;
			position.y = e.clientY + $('body').scrollTop + $(document).scrollTop;
		}
		var canvas = document.getElementById("canvas");
		position.x -= canvas.offsetLeft;
		position.y -= canvas.offsetTop;

		return position;
	}
}
