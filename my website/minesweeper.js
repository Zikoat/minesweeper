/*!
 * Library for making Minesweeper clones
 * https://github.com/binaryluke/Minesweeper
 *
 * Copyright 2015, Luke Howard (@binaryluke)
 *
 * Released under the MIT license
 * http://lukehoward.name/project/minesweeper/license
 */

(function() {
  'use strict';

  /**
   *  CellStateEnum
   */

  var CellStateEnum = {
    CLOSED: 0,
    OPEN: 1
  };

  /**
   *  CellFlagEnum
   */

  var CellFlagEnum = {
    NONE: 0,
    EXCLAMATION: 1,
    QUESTION: 2
  };

  /**
   *  BoardStateEnum
   */

  var BoardStateEnum = {
    PRISTINE: 0,
    IN_PROGRESS: 1,
    LOST: 2,
    WON: 3
  };

  /**
   *  Cell
   */
    
  var Cell = function (x, y, isMine, numAdjacentMines) {
    this.x = x || 0;
    this.y = y || 0;
    this.isMine = isMine ? true : false;
    this.numAdjacentMines = numAdjacentMines || 0;
    this.state = CellStateEnum.CLOSED;
    this.flag = CellFlagEnum.NONE;
  };

  Cell.prototype.getNeigbours = function () {
    
  };

  /**
   *  Board
   */

  var Board = function (mineArray) {
    var isValid;

    try {
      isValid = isMineArrayValid(mineArray);
    } catch (e) {
      isValid = false;
    }
    
    if (!isValid) {
      throw new Error('The mine array supplied to Board constructor was not valid');
    }
    // all these have their own getters
    this._state = BoardStateEnum.PRISTINE;
    this._numRows = mineArray.length;
    this._numCols = mineArray[0].length;
    this._numMines = getNumMinesFromMineArray(mineArray, this._numRows, this._numCols);
    this._grid = generateGridFromMineArray(mineArray, this._numRows, this._numCols);
    this.probability = this._numMines / (this._numRows * this._numCols);
  };

  Board.prototype.state = function () {
    return this._state;
  };

  Board.prototype.numRows = function () {
    return this._numRows;
  };

  Board.prototype.numCols = function () {
    return this._numCols;
  };

  Board.prototype.numMines = function () {
    return this._numMines;
  };

  Board.prototype.grid = function () {
    return this._grid;
  };

  Board.prototype.cell = function (x, y) {
    // console.log(x, y, this._grid[x][y])
    
    if (this._grid[x] == undefined){
      this.generateCell(x, y);
    } else if (this._grid[x][y] == undefined) {
      this.generateCell(x, y);
    }
      
    return this._grid[x][y];
  };

  Board.prototype.cycleCellFlag = function (x, y) {
    var cell = this.cell(x, y), updated = true; // note ---

    if (!cell || cell.state === CellStateEnum.OPEN || 
         this._state === BoardStateEnum.WON || this._state === BoardStateEnum.LOST) {
      return;
    }
    
    if (cell.flag === CellFlagEnum.NONE) {
      cell.flag = CellFlagEnum.EXCLAMATION;
    } else if (cell.flag === CellFlagEnum.EXCLAMATION) {
      cell.flag = CellFlagEnum.QUESTION;
    } else if (cell.flag === CellFlagEnum.QUESTION) {
      cell.flag = CellFlagEnum.NONE;
    } else {
      updated = false;
    }

    // change board state to IN_PROGRESS if we were on a PRISTINE board
    if (updated && this._state === BoardStateEnum.PRISTINE) {
      this._state = BoardStateEnum.IN_PROGRESS;
    }

    // and check if we've entered a WIN / LOSE scenario
    this._updateState();
  };

  Board.prototype.openCell = function (x, y) {
    var cell = this.cell(x, y);

    if (!cell || cell.state === CellStateEnum.OPEN || cell.flag !== CellFlagEnum.NONE ||
         this._state === BoardStateEnum.WON || this._state === BoardStateEnum.LOST) {
      return;
    }

    cell.state = CellStateEnum.OPEN;

    // flood-fill the board
    if (!cell.isMine) {
      this._floodFill(x + 1, y);
      this._floodFill(x - 1, y);
      this._floodFill(x, y + 1);
      this._floodFill(x, y - 1);
      this._floodFill(x + 1, y + 1);
      this._floodFill(x - 1, y - 1);
      this._floodFill(x - 1, y + 1);
      this._floodFill(x + 1, y - 1);
    }

    // change board state to IN_PROGRESS if we were on a PRISTINE board
    if (this._state === BoardStateEnum.PRISTINE) {
      this._state = BoardStateEnum.IN_PROGRESS;
    }

    // and check if we've entered a WIN / LOSE scenario
    this._updateState();


  };

  Board.prototype.getPerimeter = function (x, y) {
    // the perimeter consists of the closed tiles that are surrounded by atleast 1 open cell
    for (let row of grid) {
      row.filter(cell=>!cell.isOpen)
    }
    /*grid.forEach(row=>{
      .filter(isclosed) // get all closed tiles (returns array)
      .getneighbours // (returns array)
      .filter(isopen) // (returns array)
      .length > 0;
    });*/
    for (y = 0; y < this._numRows; y++) {
      for (x = 0; x < this._numCols; x++) {
        cell = this._cell(x,y);
        if(!cell.isOpen){
          if(getNeigbours.filter("isopen").length >= 1){

          }
        }
        // loop through neidhboring cells
        // if this cell is closed, and has a neighbor cell that is open,
        // add this to the returning array

        /*if (getNeigbours.filter("isopen").length > 0) {
          // statement
        }*/
      }
    }
    // ways to get a cell;
    this._grid[y][x];
    // ---
    let a = this.grid(); // simply returns this._grid;
    a[x][y];
    // --
    this._cell(x, y);// this._grid[][] + out of bounds check

    this.cell(j, i);// this._cell with int conversion using unary operator
  }

  // open-up the board using four-way flood-fill algorithm
  // https://en.wikipedia.org/wiki/Flood_fill
  Board.prototype._floodFill = function (x, y) {
    var cell = this.cell(x, y);

    if (cell && !cell.isMine && cell.state === CellStateEnum.CLOSED && cell.flag === CellFlagEnum.NONE) {
      cell.state = CellStateEnum.OPEN;

      if (cell.numAdjacentMines === 0) {
        this._floodFill(x + 1, y);
        this._floodFill(x - 1, y);
        this._floodFill(x, y + 1);
        this._floodFill(x, y - 1);
        this._floodFill(x + 1, y + 1);
        this._floodFill(x - 1, y - 1);
        this._floodFill(x - 1, y + 1);
        this._floodFill(x + 1, y - 1);
      }
    }
  };

  Board.prototype._updateState = function () {
    var x, y, cell, isWin = true;

    for (y = 0; y < this._numRows; y++) {
      for (x = 0; x < this._numCols; x++) {
        cell = this.cell(x,y);

        if(cell.state === CellStateEnum.OPEN) {
          if (cell.isMine) {
            this._state = BoardStateEnum.LOST;
            return;
          }
        } else if (cell.state === CellStateEnum.CLOSED) {
          if (cell.isMine) {
            if(cell.flag !== CellFlagEnum.EXCLAMATION) {
              isWin = false;
            }
          } else {
            isWin = false;
          }
        }
      }
    }

    if (isWin) {
      this._state = BoardStateEnum.WON;
    }
  };
  Board.prototype.generateCell = function (x, y) {
    if(this._grid[y] == undefined) this._grid[y] = {};

    this._grid[y][x] = new Cell(
      x,
      y,
      mineArray[y][x] === 1 ? true : false, // replace with random
      getNumAdjacentMineCount(mineArray, x, y)
    ); 
  }

  /**
   *  generateMineArray
   */

  var generateMineArray = function (options) {
    var i, j, length, rows, cols, mines, mineArray = [];

    options = options || {};
    rows = options.rows || 10;
    cols = options.cols || options.rows || 10;
    mines = options.mines || parseInt((rows * cols) * 0.15, 10) || 0;
    length = rows * cols;

    for (i = 0; i < length; i++) {
      if (i < mines) {
        mineArray.push(1);
      } else {
        mineArray.push(0);
      }
    }

    mineArray = fisherYatesShuffle(mineArray);
    mineArray = singleToMultiDimensionalArray(mineArray, cols);
    
    return mineArray;
  };


  /**
   *  Helpers
   */

  var generateGridFromMineArray = function (mineArray, numRows, numCols) {
    var x,
        y,
        grid = {};

    for (y = 0; y < numRows; y++) {
      grid[y] = {};
      for (x = 0; x < numCols; x++) {
        grid[y][x] = new Cell(
          x,
          y,
          mineArray[y][x] === 1 ? true : false,
          getNumAdjacentMineCount(mineArray, x, y)
        );
      }
    }

    return grid;
  };

  var getNumMinesFromMineArray = function (mineArray, numRows, numCols) {
    var x,
        y,
        mineCount = 0;

    for (y = 0; y < numRows; y++) {
      for (x = 0; x < numCols; x++) {
        if (mineArray[y][x] === 1) {
          mineCount++;
        }
      }
    }

    return mineCount;
  };

  var getNumAdjacentMineCount = function (mineArray, x, y) {
    var idxX,
        idxY,
        endX = x + 1,
        endY = y + 1,
        maxX = mineArray[0].length,
        maxY = mineArray.length,
        mineCount = 0;

    for (idxY = y - 1; idxY <= endY; idxY++) { // cycle from one less than this position to one after it
      for (idxX = x - 1; idxX <= endX; idxX++) { 
        if (idxY !== y || idxX !== x) { // if we arent on the center cell
          if (idxY >= 0 && idxX >= 0 && idxY < maxY && idxX < maxX) { // if we arent outside the border
            if (mineArray[idxY][idxX] === 1) {
              mineCount++;
            }
          }
        }
      }
    }

    return mineCount;
  };

  var isMineArrayValid = function (mineArray) {
    var rowIdx, colIdx, rows, columns, isValid = true;

    if (mineArray && mineArray.length) {
      rows = mineArray.length;
      columns = mineArray[0] ? mineArray[0].length : 0;

      if (columns === 0) {
        isValid = false;
      }
      
      for (rowIdx = 0; rowIdx < rows; rowIdx++) {
        if (mineArray[rowIdx].length !== columns) {
          isValid = false;
        } else {
          for (colIdx = 0; colIdx < columns; colIdx++) {
            if (mineArray[rowIdx][colIdx] !== 0 && mineArray[rowIdx][colIdx] !== 1) {
              isValid = false;
            }
          }
        }
      }  
    } else {
      isValid = false;
    }
    
    return isValid;
  };

  // Credit:
  // http://bost.ocks.org/mike/shuffle/
  var fisherYatesShuffle = function (array) {
    var m = array.length, t, i;

    // While there remain elements to shuffle…
    while (m) {

      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);

      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
  };

  var singleToMultiDimensionalArray = function (array, numCols) {
    var i,
        rows = array.length / numCols,
        multi = [];

    for (i = 0; i < rows; i++) {
      multi.push(array.splice(0, numCols));
    }

    return multi;
  };

  var extend = function ( defaults, options ) {
    var extended = {};
    var prop;
    for (prop in defaults) {
      if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
        extended[prop] = defaults[prop];
      }
    }
    for (prop in options) {
      if (Object.prototype.hasOwnProperty.call(options, prop)) {
        extended[prop] = options[prop];
      }
    }
    return extended;
  };

  /**
   *  Create exportable object
   */

  var minesweeper = {
    Cell: Cell,
    CellStateEnum: CellStateEnum,
    CellFlagEnum: CellFlagEnum,
    Board: Board,
    BoardStateEnum: BoardStateEnum,
    generateMineArray: generateMineArray
  };

  /**
   *  Export this module
   */

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = minesweeper;
  }
  else {
    if (typeof define === 'function' && define.amd) {
      define([], function() {
        return minesweeper;
      });
    }
    else {
      window.minesweeper = minesweeper;
    }
  }
})();