import { Game, InvalidActionError, Phase } from "@ravens-engine/core/lib/core/index.js";

export class LobbyPhase extends Phase {
    onUserConnection(userId) {
        // Add the player to the game
        this.addPlayer(userId);

        if (this.players.length == 2) {
            // 2 players have connected, start the game!
            this.parent.setChild(GameInProgressPhase);
        }
    }

    onUserDisconnection(userId) {
        // Remove the player
        this.removePlayer(userId);
    }
}

LobbyPhase.id = "lobby";

export class GameInProgressPhase extends Phase {
    applyAction(userId, action) {
        if (action.type == "fill") {
            // Get the symbol associated with this player
            // Assume that the first player in the list is the "O" player,
            // the second is the "X" player.
            const symbol = this.players.indexOf(userId) == 0 ? "O" : "X";

            // Check if the cell has alrady been filled
            if (this.parent.state.grid[action.cell.y][action.cell.x] != null) {
                throw new InvalidActionError("Invalid move: cell already filled");
            }

            // Check that it is indeed their turn
            if (this.parent.state.turn != symbol) {
                throw new InvalidActionError(`Not ${symbol}'s turn to play`);
            }
        
            // Fill the grid with the new value
            this.parent.state.grid[action.cell.y][action.cell.x] = this.parent.state.turn;

            // Set the new turn
            this.parent.state.turn = symbol == "O" ? "X" : "O";

            // Check if the game has ended
            if (this.isVictory()) {
                this.parent.setChild(GameEndedPhase, symbol);
            } else if (this.isDraw()) {
                this.parent.setChild(GameEndedPhase, null);
            }
        }
    }

    isVictory() {
        const lines = [
            [[0, 0], [0, 1], [0, 2]],
            [[1, 0], [1, 1], [1, 2]],
            [[2, 0], [2, 1], [2, 2]],
            [[0, 0], [1, 0], [2, 0]],
            [[0, 1], [1, 1], [2, 1]],
            [[0, 2], [1, 2], [2, 2]],
            [[0, 0], [1, 1], [2, 2]],
            [[2, 0], [1, 1], [0, 2]],
        ];

        // Check if one of the lines specify above is filled with the same symbol
        return ["O", "X"].some(symbol => lines.some(line => line.every(([y, x]) => this.parent.state.grid[y][x] == symbol)));
    }

    isDraw() {
        // If all cells are filled, then it is a draw
        for (let y = 0;y < 3;y++) {
            for (let x = 0;x < 3;x++) {
                if (this.parent.state.grid[y][x] == null) {
                    return false;
                }
            }
        }

        return true;
    }
}

GameInProgressPhase.id = "game-in-progress";

export class GameEndedPhase extends Phase {
    initialize(winner) {
        this.state = {
            winner
        };
    }
}

GameEndedPhase.id = "game-ended";

export default class TicTacToeGame extends Game {
    initialize() {
        this.state = {
            grid: [
                [null, null, null],
                [null, null, null],
                [null, null, null]
            ],
            turn: "O"
        };

        this.setChild(LobbyPhase);
    }

    isTurn(userId) {
        const i = this.players.indexOf(userId);
        const turn = this.state.turn;
        return (i == 0 && turn == "O") || (i == 1 && turn == "X");
    }
}

TicTacToeGame.childPhaseClasses = [LobbyPhase, GameInProgressPhase, GameEndedPhase];