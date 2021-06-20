import * as React from "react";
import "./style.css";
import { GameEndedPhase, GameInProgressPhase, LobbyPhase } from "./TicTacToeGame";

export default class TicTacToeComponent extends React.Component {
    render() {
        return <>
            <div>
                Player {this.props.client.userId} - 
                {this.props.game.child instanceof LobbyPhase && (
                    <>Waiting for <b>{2 - this.props.game.players.length}</b> players</>
                )}
                {this.props.game.child instanceof GameInProgressPhase && (
                    <>Turn: <b>{this.props.game.state.turn}</b> {this.props.game.isTurn(this.props.client.userId) && "(Your turn)"}</>
                )}
                {this.props.game.child instanceof GameEndedPhase && (
                    this.props.game.child.state.winner != null
                        ? <>Winner: <b>{this.props.game.child.state.winner}</b>!</>
                        : <>Draw</>
                )}
            </div>
            <table>
                <tbody>
                    {this.props.game.state.grid.map((row, y) => (
                        <tr key={y}>
                            {this.props.game.state.grid[y].map((cell, x) => (
                                <td key={x}
                                    style={{width: "50px"}}
                                    className={this.canFill(x, y) ? "clickable" : ""}
                                    onClick={this.onCellClick.bind(this, x, y)}>
                                        {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </>;
    }

    onCellClick(x, y) {
        this.props.client.sendAction({
            type: "fill",
            cell: {
                x,
                y
            }
        });
    }

    canFill(x, y) {
        return this.props.game.child instanceof GameInProgressPhase
            && this.props.game.isTurn(this.props.client.userId)
            && this.props.game.state.grid[y][x] == null;
    }
}