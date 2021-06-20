import { Server } from "@ravens-engine/core/lib/server/index.js";
import TicTacToeGame from "./TicTacToeGame.js";

const server = new Server({
    gameClass: TicTacToeGame
});

server.start();
