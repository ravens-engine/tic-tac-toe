import * as React from "react";
import * as ReactDOM from "react-dom";
import { GameComponent } from "@ravens-engine/core/lib/client/index.js";
import TicTacToeGame from "./TicTacToeGame";
import TicTacToeComponent from "./TicTacToeComponent";

ReactDOM.render(
    <GameComponent gameClass={TicTacToeGame} rootComponent={TicTacToeComponent} />,
    document.getElementById("root")
);