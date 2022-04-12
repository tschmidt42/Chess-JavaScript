var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var BOARD_SIZE = 8;
var Piece = /** @class */ (function () {
    function Piece(game, x, y) {
        this.game = game;
        // pieces in the first two rows are white (0) and the last two are black (1)
        this.color = Boolean(Math.floor(x / (BOARD_SIZE - 2)));
        this.x = x;
        this.y = y;
        this.char = 'N';
    }
    Piece.prototype.legal_square = function (x_1, y_1) {
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
    };
    Piece.prototype.incr = function (x_incr, y_incr) {
        var x_1 = this.x + x_incr;
        var y_1 = this.y + y_incr;
        var moves = [];
        while (this.legal_square(x_1, y_1)) {
            moves.push([this, x_1, y_1]);
            x_1 += x_incr;
            y_1 += y_incr;
        }
        return moves;
    };
    return Piece;
}());
var King = /** @class */ (function (_super) {
    __extends(King, _super);
    function King(game, x, y) {
        var _this = _super.call(this, game, x, y) || this;
        _this.char = 'K';
        return _this;
    }
    King.prototype.get_moves = function () {
        var moves = Array();
        for (var x_1 = this.x - 1; x_1 <= this.x + 1; x_1++) {
            for (var y_1 = this.y - 1; y_1 <= this.y + 1; y_1++) {
                // most of this should be in a function
                if (this.legal_square(x_1, y_1)) {
                    moves.push([this, x_1, y_1]);
                }
            }
        }
        return moves;
    };
    return King;
}(Piece));
var Rook = /** @class */ (function (_super) {
    __extends(Rook, _super);
    function Rook(game, x, y) {
        var _this = _super.call(this, game, x, y) || this;
        _this.char = 'R';
        return _this;
    }
    Rook.prototype.get_moves = function () {
        var moves = [];
        for (var i = -1; i <= 1; i += 2) {
            moves = moves.concat(this.incr(i, 0));
            moves = moves.concat(this.incr(0, i));
        }
        return moves;
    };
    return Rook;
}(Piece));
var Bishop = /** @class */ (function (_super) {
    __extends(Bishop, _super);
    function Bishop(game, x, y) {
        var _this = _super.call(this, game, x, y) || this;
        _this.char = 'B';
        return _this;
    }
    Bishop.prototype.get_moves = function () {
        var moves = [];
        for (var i = -1; i <= 1; i += 2) {
            for (var j = -1; j <= 1; j += 2) {
                moves = moves.concat(this.incr(i, j));
            }
        }
        return moves;
    };
    return Bishop;
}(Piece));
var Queen = /** @class */ (function (_super) {
    __extends(Queen, _super);
    function Queen(game, x, y) {
        var _this = _super.call(this, game, x, y) || this;
        _this.char = 'Q';
        return _this;
    }
    Queen.prototype.get_moves = function () {
        var moves = [];
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                moves = moves.concat(this.incr(i, j));
            }
        }
        return moves;
    };
    return Queen;
}(Piece));
var Knight = /** @class */ (function (_super) {
    __extends(Knight, _super);
    function Knight(game, x, y) {
        var _this = _super.call(this, game, x, y) || this;
        _this.char = 'N';
        return _this;
    }
    Knight.prototype.get_moves = function () {
        var moves = Array();
        for (var i = -1; i <= 1; i += 2) {
            for (var j = -2; j <= 2; j += 4) {
                // moves in x direction by one and y by two
                var x_1 = this.x + i;
                var y_1 = this.y + j;
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
    };
    return Knight;
}(Piece));
// maybe board should be typed array 
var piece_row = [Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook];
var null_rows = [];
for (var i = 0; i < 6; i++) {
    null_rows.push(Array(8).fill(null));
}
var STARTING_BOARD = [piece_row].concat(null_rows).concat([__spreadArray([], piece_row, true)]);
var Game = /** @class */ (function () {
    function Game() {
        this.board = STARTING_BOARD;
        for (var x = 0; x < 8; x++) {
            for (var y = 0; y < 8; y++) {
                if (this.board[x][y] != null) {
                    this.board[x][y] = new this.board[x][y](this, x, y);
                }
            }
        }
        this.player = 0;
        this.game_won = false;
    }
    Game.prototype.make_move = function (m) {
        var piece = m[0], x_1 = m[1], y_1 = m[2];
        // check if game is over
        var piece_taken = this.board[x_1][y_1];
        if (piece_taken != null && piece_taken instanceof King) {
            var color = !this.board[x_1][y_1].color;
            console.log("Game Over % wins", color);
            this.game_won = true;
        }
        // update board
        var _a = [piece.x, piece.y], x_0 = _a[0], y_0 = _a[1];
        piece.x = x_1;
        piece.y = y_1;
        this.board[x_1][y_1] = piece;
        this.board[x_0][y_0] = null;
    };
    Game.prototype.make_random_move = function (color) {
        var moves = [];
        for (var x = 0; x < 8; x++) {
            for (var y = 0; y < 8; y++) {
                if (this.board[x][y] != null) {
                    var piece_moves = this.board[x][y].get_moves();
                    if (moves.length == 0) {
                        moves = piece_moves;
                    }
                    else {
                        moves = moves.concat(piece_moves);
                    }
                }
            }
        }
        var m = moves[Math.floor(Math.random() * moves.length)];
        this.make_move(m);
    };
    Game.prototype.print_board = function () {
        for (var x = 0; x < 8; x++) {
            var str = '';
            for (var y = 0; y < 8; y++) {
                var p = this.board[x][y];
                if (p == null) {
                    str += '  ';
                }
                else {
                    str += ' ' + this.board[x][y].char;
                }
            }
            console.log(str);
        }
        console.log('\n\n');
    };
    return Game;
}());
var game = new Game();
game.print_board();
var player = false;
var turns = 0;
while (!game.game_won && turns < 7) {
    game.make_random_move(player);
    game.print_board();
    turns++;
    player = !player;
}
