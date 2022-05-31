
const easy = [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
];
const medium = [
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
];
const hard = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
];

//Create variables
var lives;
var selectedNum;
var selectedTile;
var disableSelect;

window.onload = function () {

    const x = localStorage.getItem('time');

    if(x){
        const e = document.createElement('div');
        e.innerHTML = "Last game at: ".concat(JSON.parse(x))
        const y = document.getElementById("game-stats");
        y.append(e);
        e.id ="last-game";
    }
    
    //Run create game function when button is clicked
    id("new-game").addEventListener("click", startGame);

    //Add event listener to each number in number picker
    for (let i = 0; i < id("number-container").children.length; i++) {
        id("number-container").children[i].addEventListener("click", function (){
            //If selecting is not disabled
            if (!disableSelect) {
                //If number is already selected
                if (this.classList.contains("selected")) {
                    //Removes selection
                    this.classList.remove("selected");
                    selectedNum = null;
                } else {
                    //Deselect all other numbers
                    for (let i = 0; i < 9; i++) {
                        id("number-container").children[i].classList.remove("selected");
                    }

                    //Select and update selectedNum
                    this.classList.add("selected");
                    selectedNum = this;
                    updateMove();
                }
            }
        });
    }

    //Shows solution of the game
    id("solution").addEventListener("click", showSolution);

    //Saves game to local storage
    id("save").addEventListener("click", saveGame);

}

function saveGame(){

}

function showSolution() {
    let board;

    //Difficulty selection
    if(id("difficulty-easy").checked) board = easy[1];
    else if (id("difficulty-medium").checked) board = medium[1];
    else board = hard[1];

    //Set lives to 3, selecting numbers and tiles
    lives = 3;
    disableSelect = false;
    id("lives").textContent = "Lives remaining: " + lives;

    //Generating board based on difficulty
    generateBoard(board);

    //Show number picker
    id("number-container").classList.remove("hidden");
}

function startGame() {
    let board;

    //Difficulty selection
    if(id("difficulty-easy").checked) board = easy[0];
    else if (id("difficulty-medium").checked) board = medium[0];
    else board = hard[0];

    //Set lives to 3, selecting numbers and tiles
    lives = 3;
    disableSelect = false;
    id("lives").textContent = "Lives remaining: " + lives;

    //Generating board based on difficulty
    generateBoard(board);

    //Show number picker
    id("number-container").classList.remove("hidden");
}

function id(id) {
    return document.getElementById(id);
}

function generateBoard(board) {
    //Clear previous board
    clearPrevious();

    //Let used to increment tile ids
    let idCount = 0;

    //Create 81 tiles
    for (let i = 0; i < 81; i++) {
        //Create new paragraph element
        let tile = document.createElement("p");

        if (board.charAt(i) != "-") {
            //Set tile text to correct number
            tile.textContent = board.charAt(i);
        } else {
            //Add click event listener to tile
            tile.addEventListener("click", function () {
                if (!disableSelect) {
                    //If the tile is already selected
                    if (tile.classList.contains("selected")) {
                        tile.classList.remove("selected");
                        selectedTile = null;
                    } else {
                        //Deselect all other tiles
                        for (let i = 0; i < 81; i++) {
                            qsa(".tile")[i].classList.remove("selected");
                        }
                        //Add selection and update variable
                        tile.classList.add("selected");
                        selectedTile = tile;
                        updateMove();
                    }
                }
            })
        }

        //Assign tile id
        tile.id = idCount;

        //Increment fot next tile
        idCount ++;

        //Add tile class to all tiles
        tile.classList.add("tile");

        if ((tile.id > 17 && tile.id < 27) || (tile.id > 44 & tile.id < 54)) {
            tile.classList.add("bottomBorder");
        }

        if ((tile.id + 1) % 9 == 3 || (tile.id +1) % 9 == 6) {
            tile.classList.add("rightBorder");
        }
        //Add tile to board
        id("board").appendChild(tile);
    }
}

function updateMove(){
    //If a tile and number is selected
    if (selectedTile && selectedNum) {
        //Set the tile to the correct number
        selectedTile.textContent = selectedNum.textContent;

        //If the number matches the corresponding number in the solution key
        if (checkCorrect(selectedTile)) {
            //Deselect the tile
            selectedTile.classList.remove("selected");
            selectedNum.classList.remove("selected");

            //Clear the selected variables
            selectedNum = null;
            selectedTile = null;

            //Check if board is completed
            if (checkDone()) {
                endGame();
            }
        }
        //If the number does not match the solution key
        else {
            //Disable selecting new numbers for one second
            disableSelect = true;

            //Make the tile turn red
            selectedTile.classList.add("incorrect");

            //Run in one second
            setTimeout(function () {
                //Substract lives by one
                lives --;

                //If no lives left
                if (lives === 0) {
                    endGame();
                } else {
                    //If lives is not equal to zero
                    //Update lives text
                    id("lives").textContent = "Lives Remaining: " + lives;

                    //Renable selecting numbers and tiles
                    disableSelect = false;
                }
                //Restore tile color and remove selected from both
                selectedTile.classList.remove("incorrect");
                selectedTile.classList.remove("selected");
                selectedNum.classList.remove("selected");

                //Clear the tiles text and clear selected variables
                selectedTile.textContent = "";
                selectedTile = null;
                selectedNum = null;

            }, 1000);
        }
    }
}

function checkDone() {
    let tiles = qsa(".tile");
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i].textContent === "") {
            return false
        }
    }
    return true;
}

function endGame() {
    //Disable moves
    disableSelect = true;

    //Display win or loss message
    if (lives === 0) {
        id("lives").textContent = "☠️ You lost ☠️";
        localStorage.setItem('time', JSON.stringify(new Date().toLocaleDateString()));
    } else {
        id("lives").textContent = "🎉 You won 🎉";
        localStorage.setItem('time', JSON.stringify(new Date().toLocaleDateString()));
    }
}

function checkCorrect(tile) {
    //Set solution based on difficulty selection
    let solution;

    if(id("difficulty-easy").checked) solution = easy[1];
    else if (id("difficulty-medium").checked) solution = medium[1];
    else solution = hard[1];

    //If tile's number is equal to solution's number
    return solution.charAt(tile.id) === tile.textContent;
}

function clearPrevious(){
    //Access all of the tiles
    let tiles = qsa(".tile");

    //Remove each tile
    for (let i = 0; i < tiles.length; i++) {
        tiles[i].remove();
    }

    //Deselect any numbers
    for (let i = 0; i < id("number-container").children.length; i++) {
        id("number-container").children[i].classList.remove("selected");
    }

    //Clear selected variables
    selectedTile = null;
    selectedNum = null;
}

function qsa(selector) {
    return document.querySelectorAll(selector);
}
