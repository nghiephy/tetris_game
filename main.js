const canvas = document.getElementById("canvas")
const ctext = canvas.getContext("2d")

const ROW = 18
const COL = 10
const SQ = 40
const COLOR = "WHITE"

let score = 0

function drawSquare(x, y, color) {
    ctext.fillStyle = color
    ctext.fillRect(x*SQ, y*SQ, SQ, SQ)

    ctext.strokeStyle = "#ccc"
    ctext.strokeRect(x*SQ, y*SQ, SQ, SQ)
}

let board = []
for(r=0; r<ROW; r++) {
    board[r] = []
    for(c=0; c<COL; c++) {
        board[r][c] = COLOR
    }
}

console.log(board)

function drawBoard() {
    for(r=0; r<ROW; r++) {
        for(c=0; c<COL; c++) {
            drawSquare(c, r, board[r][c])
        }
    }
}

drawBoard()

class Piece {
    constructor(tetromino, color) {
        this.tetromino = tetromino
        this.color = color

        this.tetrominoN = 0
        this.activeTetromino = this.tetromino[this.tetrominoN]

        this.x = 3
        this.y = -2
    }

    fill(color) {
        for(let r=0; r<this.activeTetromino.length; r++) {
            for(let c=0; c<this.activeTetromino.length; c++) {
                if(this.activeTetromino[r][c]) {
                    drawSquare(this.x + c, this.y + r, color)
                }
            }
        }
    }

    draw() {
        this.fill(this.color)
    }

    unDraw() {
        this.fill(COLOR)
    }

    moveDown() {
        if(!this.collision(0, 1, this.activeTetromino)) {
            this.unDraw()
            this.y++
            this.draw()
        }else {
            this.lock()
            p = randomPiece()
        }
    }

    moveLeft() {
        if(!this.collision(-1, 0, this.activeTetromino)) {
            this.unDraw()
            this.x--
            this.draw()
        }
    }

    moveRight() {
        if(!this.collision(1, 0, this.activeTetromino)) {
            this.unDraw()
            this.x++
            this.draw()
        }
    }

    rotate() {
        let nextPattern = this.tetromino[(this.tetrominoN+1) % this.tetromino.length]
        let move = 0

        if(this.collision(0, 0, nextPattern)) {
            if(this.x > COL/2) {
                move = -1
                if(this.x == COL-2){
                    move = -2
                }
            }else {
                move = 1
                if(this.x == -2){
                    move = 2
                }
            }
        }
        
        // Check this.x value to rotate tetromino
        let xValue = this.x
        console.log(xValue, move)
        if(this.x < 0) { //Rotate tetromino I in left border
            if(!this.collision(this.x*(-1), 0, nextPattern)) {
                this.unDraw()
                this.x += move
                this.tetrominoN = (this.tetrominoN+1) % this.tetromino.length
                this.activeTetromino = this.tetromino[this.tetrominoN]
                this.draw()
            }
        }else if(this.x >= COL-3) { //Rotate tetromino I in right border
            if(!this.collision(this.x-COL, 0, nextPattern)) {
                this.unDraw()
                this.x += move
                this.tetrominoN = (this.tetrominoN+1) % this.tetromino.length
                this.activeTetromino = this.tetromino[this.tetrominoN]
                this.draw()
            }
        }else { //Rotate other tetromino
            if(!this.collision(0, 0, nextPattern)) {
                this.unDraw()
                this.x += move
                this.tetrominoN = (this.tetrominoN+1) % this.tetromino.length
                this.activeTetromino = this.tetromino[this.tetrominoN]
                this.draw()
            }
        }
    }

    // Check collision of tetromino 
    collision(x, y, piece) {
        for(let r=0; r<piece.length; r++){
            for(let c=0; c<piece.length; c++){
                if(!piece[r][c]){
                    continue
                }

                let newX = this.x + c + x
                let newY = this.y + r + y

                if(newX<0 || newX>=COL || newY>=ROW) {
                    return true
                }

                if(newY<0){
                    continue
                }

                if(board[newY][newX] != COLOR) {
                    return true
                }
            }
        }
        return false
    }

    // Handle stop when tetromino in bottom and top
    lock() {
        for(let r=0; r<this.activeTetromino.length; r++){
            for(let c=0; c<this.activeTetromino.length; c++){
                if(!this.activeTetromino[r][c]){
                    continue
                }

                if(this.y + r < 0) {
                    alert('Game Over!!')
                    gameOver = true
                    break;
                }
                console.log(this.y + r, this.x + c)
                board[this.y + r][this.x + c] = this.color
            }
        }

        // Handle score player
        for(let r=0; r<ROW; r++) {
            let isFull = true
            for(let c=0; c<COL; c++) {      // Find the row is full
                isFull = isFull && (board[r][c] != COLOR)
            }

            // Delete the row full 
            if(isFull) {
                for(let y=r; y>1; y--) {
                    for(let c=0; c<COL; c++) {
                        board[y][c] = board[y-1][c]
                    }
                }
                
                // Make the top row is white (in case game board is full)
                for(let c=0; c<COL; c++) {    
                    board[0][c] = COLOR
                }

                score += 10
            }
        }

        drawBoard()
        document.querySelector("#score").innerText = score
    }
}

const PIECES = [
    [Z, "red"],
    [S, "green"],
    [T, "yellow"],
    [O, "blue"],
    [L, "purple"],
    [I, "cyan"],
    [J, "orange"],
];

function randomPiece() {
    let random = Math.floor(Math.random() * PIECES.length)
    return new Piece(PIECES[random][0], PIECES[random][1])
}

let p = randomPiece()
console.log(p)

document.addEventListener('keydown', function(e) {
    if(e.keyCode == 37) {
        p.moveLeft()
    } else if(e.keyCode == 39) {
        p.moveRight()
    } else if(e.keyCode == 38) {
        p.rotate()
    } else if(e.keyCode == 40) {
        p.moveDown()
    }
})

let gameOver = false
let interval

function drop() {
    interval = setInterval(function() {
        if(!gameOver) {
            p.moveDown()
        }else {
            clearInterval(interval)
        }
    }, 1000)
}

drop()
