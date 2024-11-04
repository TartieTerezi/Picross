let canvas;
let context;

let grid,gridMark;
let sizeCell = 30;
let horizontalHint = [];
let	verticalHint = [];
let life = [];
let isGameOver = false;
let isWon = false;
let greenCell = 0;
let cellToDiscover = 0;
          
window.onload = Init;

function GeneratePicross(){
	grid = [];
	gridMark = [];

	//Set the random Picross
	nbrCells = Math.floor(Math.random() * 4) + 7; 
	for(var i = 0; i < nbrCells; i++){
		grid.push([]);
		gridMark.push([]);

		for(var x = 0;x < nbrCells; x++){
			var RandomCell = Math.floor(Math.random() * 2);
			grid[i].push(RandomCell);

			//RandomCell at 1 is a cell green
			if(RandomCell==1){
				cellToDiscover++;

				var caseDiscover = Math.floor(Math.random() * 100);
				if(caseDiscover > 80)
				{
					gridMark[i][x] = RandomCell;
					cellToDiscover--;
				}
			} 
		}
	}	

	for (var i = 0; i < grid.length; i++) {
		line = grid[i]; //set the line
		horizontalHint.push([]); //new line in tab
		var CountCellByLine = 0; //set a count for the line

		for (var x = 0; x < line.length; x++){
			if (line[x]===1){
				CountCellByLine++;
			} else {
				//add the hint if he has find another valid cell
				if (CountCellByLine > 0) {
					horizontalHint[i].push(CountCellByLine); //add hint
					CountCellByLine = 0;
				}
			}
		}

		//last check
		if (CountCellByLine > 0){
			horizontalHint[i].push(CountCellByLine);
		}
		horizontalHint[i].reverse();
	}

	//same for the vertical Line
	for (var x = 0; x < grid[0].length; x++){
		verticalHint.push([]); 
		var CountCellByLine = 0;
		for (var i = 0;i < grid.length;i++){
			if(grid[i][x]===1){
				CountCellByLine
			} else {

				if(CountCellByLine>0){
					verticalHint[x].push(CountCellByLine);
					CountCellByLine = 0;
				}
			}
		}
		if (CountCellByLine > 0){
			verticalHint[x].push(CountCellByLine);
		}
		verticalHint[x].reverse();
	}
}

function Init() {
	canvas = document.getElementById('game');
	context = canvas.getContext('2d');
	context.font = '16px serif';

	life.push(document.getElementById("heartOne"));
	life.push(document.getElementById("heartTwo"));
	life.push(document.getElementById("heartThree"));

	GeneratePicross();
	canvas.addEventListener("mousedown", function(e){getMousePosition(canvas, e);});
	document.getElementById("btn_reset").addEventListener("click",function(){
		window.location.reload();
	})

	window.requestAnimationFrame(gameLoop);
}

function TakeDamage(){
	life[life.length-1].className = "heart endHeart";
	life.pop()


	console.log(life);
	if(life=="")
	{
		isGameOver = true;
    }
}

function getMousePosition(canvas, event) {
	if(isGameOver)
	{
		return;
	}

	let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    if(y>=100 && x>=100){
    	x = Math.floor((x-100)/sizeCell);
    	y = Math.floor((y-100)/sizeCell);

    	if(gridMark[y][x]>0){
    		//don't do anything if has been clicked
    	} else if(grid[y][x]){
    		gridMark[y][x] = 1;
    		greenCell++;
    		if (cellToDiscover==greenCell) {
    			isGameOver = true;
    			isWon = true;
    		}
    	} else {
    		gridMark[y][x] = 2;
    		TakeDamage();
    	}
   	}   

   	window.requestAnimationFrame(gameLoop);
}

function draw(){
	context.clearRect(0, 0, canvas.width, canvas.height);

	//Draw The empty Grid
	for(var oneCellX = 0; oneCellX < grid.length; oneCellX++){
		for(var OneLine=0; OneLine< verticalHint[oneCellX].length;OneLine++){
			context.strokeText(verticalHint[oneCellX][OneLine],oneCellX*sizeCell+109,95+20*OneLine-sizeCell*OneLine*1.5);
		}

		for(var uneCaseY = 0; uneCaseY < grid[0].length; uneCaseY++){
			context.rect(100+sizeCell*uneCaseY,100+sizeCell*oneCellX,sizeCell,sizeCell);
		}
	}
	
	//Draw the Grid 
	for(var OneLine=0;OneLine< horizontalHint.length;OneLine++){
		for(var index=0;index < horizontalHint[OneLine].length;index++){
			context.strokeText(horizontalHint[OneLine][index],80-index*15,OneLine*30+120);
		}
	}
	context.stroke();

	//Draw the cell with color
	for(var line = 0; line<gridMark.length;line++){
		for (var oneCell = 0; oneCell<gridMark[line].length;oneCell++){
			if(gridMark[line][oneCell]){
				if(gridMark[line][oneCell]===1){
					context.fillStyle = 'green';
				} else if(gridMark[line][oneCell]===2){
					context.fillStyle = 'red';
				}
				context.fillRect(101+sizeCell*oneCell,101+sizeCell*line,sizeCell-2,sizeCell-2);
			} 
		}
	}
}

function gameLoop(timeStamps){
	draw();

	if(isGameOver && isWon)
	{
		alert("Congratulation ! You Won !");
	}
	else if(isGameOver)
	{
		alert("You Loss !");
	}
}

