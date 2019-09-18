const gameBoard = () => {
  //
  // toggler for alternating
  // users
  //
  let userToggle = true;
  //
  // toggles whether board
  // will be rerendered
  //
  let freezeboard = false;
  //
  // the overall board state
  //
  let boardArray = ["", "", "", "", "", "", "", "", ""];
  //
  // all the combinations
  // of indexes in boardArray
  // that, if "set", constitute
  // a win.
  //
  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  //
  // rebuilds the board
  // from the current state
  // of boardArray
  //
  const updateBoard = () => {
    const buttondisplay = document.getElementById("button-display");
    //
    // clear out the
    // button display div
    //
    while (buttondisplay.firstChild) {
      buttondisplay.removeChild(buttondisplay.firstChild);
    }
    const grid = document.getElementById("display");
    //
    // clear out display div
    //
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }
    //
    // create board divs
    //
    for (let i = 0; i < boardArray.length; i++) {
      let box = document.createElement("div");
      box.classList.add("box");
      box.setAttribute("data-id", i);
      box.innerHTML = boardArray[i];
      box.addEventListener("click", makeMove);
      grid.appendChild(box);
    }
    //
    // create the button group
    //
    const button = document.createElement("button");
    button.id = "reset-button";
    button.addEventListener("click", clearBoard);
    button.innerHTML = "Reset Board";
    buttondisplay.appendChild(button);
    const infobox = document.createElement("div");
    infobox.id = "info-box";
    infobox.style.gridColumn = "2/span 2";
    infobox.innerHTML = "Game notes will show here.";
    buttondisplay.appendChild(infobox);
  };
  //
  // callback for when one of the boxes
  // is clicked. The data-id of that element
  // is passed in via the event object and used
  // to identify the box to be updated.
  //
  const markBox = (event, user) => {
    const id = event.target.getAttribute("data-id");
    if (event.target.innerHTML != "") {
      utilityMessage(`Square ${Number(id) + 1} already played! Try again...`);
      return false;
    }
    boardArray = boardArray.map((value, index, arr) => {
      if (index == id) {
        return user;
      } else {
        return value;
      }
    });
    //
    // after every successful check of a box,
    // meaning our state in boardArray
    // has been changed, we:
    // 1) force a rerender
    // of the board,
    // 2) check to see if the move
    // resulted in a win,
    // 3) else check for a draw
    //
    updateBoard();
    utilityMessage(`${user} played square ${Number(id) + 1}`);
    if (!checkForWin()) {
      checkForDraw();
    }
    return true;
  };
  //
  // reset every element
  // in the board to empty string
  //
  const clearBoard = () => {
    userToggle = true;
    freezeboard = false;
    boardArray = boardArray.map((value, index, arr) => {
      return "";
    });
    updateBoard();
  };
  //
  // the winConditions list has all the sets
  // of indexes in the grid that constitute
  // a win. Iterate over that set and check
  // if all indexes in the grid are a) not
  // "" and b) all 3 are the same character.
  // if so, set freezeboard which stops the
  // update of the board.
  // else return false
  //
  const checkForWin = () => {
    for (let i = 0; i < winConditions.length; i++) {
      let [a, b, c] = [
        boardArray[winConditions[i][0]],
        boardArray[winConditions[i][1]],
        boardArray[winConditions[i][2]]
      ];
      if (a === b && a === c && c != "") {
        utilityMessage(`${a} wins!`);
        freezeboard = true;
        highlightWin(
          winConditions[i][0],
          winConditions[i][1],
          winConditions[i][2]
        );
        return true;
      }
    }
    return false;
  };
  //
  // changes background of
  // 3 boxes. Generally the
  // 3 winning boxes found in
  // checkForWin
  //
  const highlightWin = (a, b, c) => {
    const boxes = document.getElementById("display").children;
    for (let i = 0; i < boxes.length; i++) {
      let id = boxes[i].getAttribute("data-id");
      if (id == a || id == b || id == c) {
        boxes[i].style.backgroundImage =
          "linear-gradient(to right,red,orange,yellow,green,blue,indigo,violet)";
      }
    }
  };
  //
  // a draw is every element
  // in the list with something
  // other than "" in them, but
  // with the
  // check for a winner having failed.
  //
  const checkForDraw = () => {
    if (boardArray.indexOf("") == -1) {
      utilityMessage("Draw!");
      freezeboard = true;
    }
  };
  //
  // closure that
  // alternates between each
  // "user", identified basically as
  // just "X" and "O", calling
  // markBox with the appropriate
  // "user" passed in.
  // In case freezboard is set,
  // the result of a win or a
  // draw, we don't want to
  // mark any more boxes, so just
  // return.
  //
  const toggleUser = () => {
    const usera = "X";
    const userb = "O";

    return event => {
      if (freezeboard) {
        return;
      }
      if (userToggle) {
        if (markBox(event, usera)) {
          userToggle = !userToggle;
        }
      } else {
        if (markBox(event, userb)) {
          userToggle = !userToggle;
        }
      }
    };
  };

  const utilityMessage = message => {
    document.getElementById("info-box").innerHTML = message;
  };
  //
  // the actual event listener callback
  // bound to the grid squares above.
  //
  const makeMove = toggleUser();

  return { updateBoard };
};

const { updateBoard } = gameBoard();

updateBoard();
