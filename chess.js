const BOARD_SIZE = 8;

class Piece {
    constructor(game, x, y) {
        this.game = game;
        // pieces in the first two rows are white (0) and the last two are black (1)
        this.color = Math.floor(x / (BOARD_SIZE - 2));
        this.x = x;
        this.y = y;
        this.char = 'N';
    }
    
    legal_square(x_1, y_1) {
        // check square in on the board
        if (x_1 < 0 || x_1 >= BOARD_SIZE || y_1 < 0 || y_1 >= BOARD_SIZE) {
            return false;
        }
        // check square is does not have a piece of the same color
        if (this.game.board[x_1][y_1] != null && this.game.board[x_1][y_1].color == this.color) {
            return false;
        }
        // check move would move the piece
        if (this.x == x_1 && this.y == y_1) {
            return false;
        }
        return true;
    }

    incr(x_incr, y_incr) {
        let x_1 = this.x + x_incr;
        let y_1 = this.y + y_incr;
        let moves = [];
        while (this.legal_square(x_1, y_1)) {
            moves.push([this, x_1, y_1]);
            x_1 += x_incr;
            y_1 += y_incr;
        }
        return moves;
    }
}

class King extends Piece {
    constructor(game, x, y) {
        super(game, x, y);
        this.char = 'K';
    }

    get_moves() {
        let moves = Array();
        for (let x_1 = this.x - 1; x_1 <= this.x + 1; x_1++) {
            for (let y_1 = this.y - 1; y_1 <= this.y + 1; y_1++) {
                // most of this should be in a function
                if (this.legal_square(x_1, y_1)) {
                    moves.push([this, x_1, y_1]);
                }
            }
        } 
        return moves;
    }
}

class Rook extends Piece {
    constructor(game, x, y) {
        super(game, x, y);
        this.char = 'R';
    }

    get_moves() {
        let moves = [];
        for (let i = -1; i <= 1; i += 2) {
            moves = moves.concat(this.incr(i, 0));
            moves = moves.concat(this.incr(0, i));
        } 
        return moves;
    }
}

class Bishop extends Piece {
    constructor(game, x, y) {
        super(game, x, y);
        this.char = 'B';
    }

    get_moves() {
        let moves = [];
        for (let i = -1; i <= 1; i += 2) {
            for (let j = -1; j <= 1; j += 2) {
                moves = moves.concat(this.incr(i, j));
            }
        } 
        return moves;
    }
}

class Queen extends Piece {
    constructor(game, x, y) {
        super(game, x, y);
        this.char = 'Q';
    }

    get_moves() {
        let moves = [];
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                moves = moves.concat(this.incr(i, j));
            }
        } 
        return moves;
    }
}

class Knight extends Piece {
    constructor(game, x, y) {
        super(game, x, y);
        this.char = 'N';
    }

    get_moves() {
        let moves = Array();
        for (let i = -1; i <= 1; i += 2) {
            for (let j = -2; j <= 2; j += 4) {
                // moves in x direction by one and y by two
                let x_1 = this.x + i;
                let y_1 = this.y + j;
                if (this.legal_square(x_1, y_1)) {
                    moves.push([this, x_1, y_1]);
                }
                // moves in y direction by two and y by one
                x_1 = this.x + j;
                y_1 = this.y + i;
                if (this.legal_square(x_1, y_1)) {
                    moves.push([this, x_1, y_1]);
                }
            }
        } 
        return moves;
    }
}

// maybe board should be typed array 
const piece_row = [Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook];
let null_rows = [];
for (i = 0; i < 6; i++) {
    null_rows.push(Array(8).fill(null));
}
const STARTING_BOARD = [piece_row].concat(null_rows).concat([[...piece_row]]);

class Game {
    constructor(){
        this.board = STARTING_BOARD;
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                if (this.board[x][y] != null) {
                    this.board[x][y] = new this.board[x][y](this, x, y);
                }
            }
        }
        this.player = 0;
        this.game_won = false;
    }

    make_move(m) {
        let [piece, x_1, y_1] = m;
        // check if game is over
        let piece_taken = this.board[x_1][y_1]; 
        if (piece_taken != null && piece_taken instanceof King) {
            let color = !this.board[x_1][y_1].color;
            console.log("Game Over % wins", color);
            this.game_won = true;
        }
        // update board
        let [x_0, y_0] = [piece.x, piece.y];
        piece.x = x_1;
        piece.y = y_1;
        this.board[x_1][y_1] = piece;
        this.board[x_0][y_0] = null;
    }

    make_random_move(color) {
        let moves = [];
        for (let x = 0; x < 8; x++){
            for (let y = 0; y < 8; y++) {
                if (this.board[x][y] != null) {
                    let piece_moves = this.board[x][y].get_moves();
                    if (moves.length == 0) {
                        moves = piece_moves;
                    } else {
                        moves = moves.concat(piece_moves);
                    }
                }
            }
        }
        let m = moves[Math.floor(Math.random() * moves.length)];
        this.make_move(m);
    }

    print_board() {
        for (let x = 0; x < 8; x++) {
            let str = '';
            for (let y = 0; y < 8; y++) {
                let p = this.board[x][y];
                if (p == null) {
                    str += '  ';
                } else {
                    str += ' ' + this.board[x][y].char;
                }
            }
            console.log(str);
        }
        console.log('\n\n');
    }
}

let game = new Game();
game.print_board();
let player = 0
let turns = 0;
while (!game.game_won && turns < 7) {
    game.make_random_move(player);
    game.print_board();
    turns++;
    player = !player;
}
