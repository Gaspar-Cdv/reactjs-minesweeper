import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import Game from './components/Game';
import Settings from './components/Settings';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            difficulty: 'beginner',
            height: 9,
            width: 9,
            mines: 10,
            minesLeft: 10,
            grid: [], // initialised in componentDidMount
            time: 0,
            timer: null, // setInterval
            gameOver: false,
            win: false,
            firstClick: true
        };
        this.functions = { onFirstClick: this.onFirstClick, resetGame: this.resetGame, activateCell: this.activateCell, toggleFlag: this.toggleFlag }
    }

    componentDidMount = () => this.setState({ grid: this.resetGrid() });

    onFirstClick = (x, y) => { // start game
        this.setState({
            firstClick: false,
            timer: setInterval(() => this.setState({ time: this.state.time + 1 }), 1000), // start timer
            grid: this.getRandomGrid(x, y) // generate grid
        }, () => this.activateCell(x, y));
    }

    resetGame = values => { // values : {difficulty, height, width, mines}
        clearInterval(this.state.timer);
        this.setState(
            { ...values, minesLeft: values.mines, time: 0, timer: null, gameOver: false, win: false, firstClick: true },
            () => this.setState({ grid: this.resetGrid() }));
    }

    // activateCell2 = (x, y) => { // pas optimisé, beaucoup plus de récursions que nécessaire...
    //     if (this.state.grid[y][x].activated || this.state.grid[y][x].flagged) return; // cell already activated or flagged
    //     let dontNeedToContinue = false;
    //     this.setState(prevState => {
    //         prevState = { ...prevState };
    //         dontNeedToContinue = prevState.grid[y][x].activated || prevState.grid[y][x].flagged;
    //         prevState.grid[y][x].activated = true;
    //         return prevState;
    //     }, () => {
    //         if (dontNeedToContinue) return; // cell already activated or flagged
    //         let cell = this.state.grid[y][x].value;
    //         if (cell === 0) { // recursive activation for cells around
    //             for (let i = Math.min(y + 1, this.state.height - 1); i >= Math.max(y - 1, 0); i--) {
    //                 for (let j = Math.min(x + 1, this.state.width - 1); j >= Math.max(x - 1, 0); j--) {
    //                     (!(this.state.grid[i][j].activated || this.state.grid[i][j].flagged)) && this.activateCell(j, i);
    //                 }
    //             }
    //         } else if (cell === 'x') { // game over
    //             clearInterval(this.state.timer);
    //             this.setState({ gameOver: x + ' ' + y });
    //         }
    //         if (this.state.grid.flat().filter(x => x.activated).length === this.state.height * this.state.width - this.state.mines) { // win
    //             clearInterval(this.state.timer);
    //             this.setState({ win: true, minesLeft: 0 })
    //         }
    //     })
    // }

    // activateCell3 = (x, y) => {
    //     if (this.state.grid[y][x].activated || this.state.grid[y][x].flagged) return; // cell already activated or flagged
    //     let grid = this.state.grid.map(x => x.map(y => { return { ...y } })); // deep copy
    //     grid[y][x].activated = true;
    //     let stack = [[x, y]];
    //     while (stack.length) { // BFS
    //         [x, y] = stack.shift();
    //         if (grid[y][x].value !== 0) continue;
    //         for (let i = Math.min(y + 1, this.state.height - 1); i >= Math.max(y - 1, 0); i--) {
    //             for (let j = Math.min(x + 1, this.state.width - 1); j >= Math.max(x - 1, 0); j--) {
    //                 if (!grid[i][j].activated && !grid[i][j].flagged) {
    //                     stack.push([j, i]);
    //                     grid[i][j].activated = true;
    //                 }
    //             }
    //         }
    //     }
    //     this.setState({ grid });
    //     if (grid.flat().filter(x => x.activated).length === this.state.height * this.state.width - this.state.mines) { // win
    //         clearInterval(this.state.timer);
    //         this.setState({ win: true, minesLeft: 0 })
    //     } else if (grid[y][x].value === 'x') { // game over
    //         clearInterval(this.state.timer);
    //         this.setState({ gameOver: x + ' ' + y });
    //     }
    // }

    activateCell = (x, y) => {
        this.setState(state => {
            if (state.grid[y][x].activated || state.grid[y][x].flagged) return; // cell already activated or flagged
            if (state.grid[y][x].value === 'x') { // game over
                clearInterval(state.timer);
                return { gameOver: x + ' ' + y };
            }
            let grid = state.grid;
            grid[y][x].activated = true;
            let stack = [[x, y]];
            while (stack.length) { // BFS (activate all connected cells)
                [x, y] = stack.shift();
                if (grid[y][x].value !== 0) continue;
                for (let i = Math.min(y + 1, state.height - 1); i >= Math.max(y - 1, 0); i--) {
                    for (let j = Math.min(x + 1, state.width - 1); j >= Math.max(x - 1, 0); j--) {
                        if (!grid[i][j].activated && !grid[i][j].flagged) {
                            stack.push([j, i]);
                            grid[i][j].activated = true;
                        }
                    }
                }
            }
            if (grid.flat().filter(x => x.activated).length === state.height * state.width - state.mines) { // you win
                clearInterval(state.timer);
                return { grid, win: true, minesLeft: 0 }
            }
            return { grid }; // default
        })
    }

    toggleFlag = (x, y) => {
        if (this.state.grid[y][x].activated) return; // cell already activated
        let flagged = this.state.grid[y][x].flagged
        this.setState(state => {
            let {grid, minesLeft} = state;
            grid[y][x].flagged = !flagged ? 'flag' : flagged === 'flag' ? '?' : false;
            minesLeft += !flagged ? -1 : flagged === 'flag';
            return {grid, minesLeft};
        })
    }

    getRandomGrid = (x, y) => {
        let h = this.state.height;
        let w = this.state.width;
        let mines = this.state.mines;
        let coordinates = [];

        for (let i = 0; i < h; i++) { // create every coordinates
            for (let j = 0; j < w; j++) {
                if (!((i === y && j === x) || (mines < h * w - 9 && i > y - 2 && i < y + 2 && j > x - 2 && j < x + 2))) { // except where the click is and around
                    coordinates.push([j, i]);
                }
            }
        }

        while (coordinates.length !== mines) { // delete random coordinates until the desired number
            // pour être optimisé : si le nombre de mines dépasse la moitié du nombre de cellules,
            // supprimer les mines plutôt que les cases vides, donc
            // (coordinates = cases vides) plutôt que (coordinates == mines).
            coordinates.splice(Math.floor(Math.random() * coordinates.length), 1);
        }

        let grid = this.state.grid; // to keep flags before start game. Else use let grid = this.resetGrid()
        coordinates.forEach(([x, y]) => {
            grid[y][x].value = 'x'; // display bomb on the grid
            for (let i = Math.min(y + 1, h - 1); i >= Math.max(y - 1, 0); i--) { // increment values around
                for (let j = Math.min(x + 1, w - 1); j >= Math.max(x - 1, 0); j--) {
                    grid[i][j].value !== 'x' && grid[i][j].value++;
                }
            }
        })

        return grid;
    }

    resetGrid() {
        let h = this.state.height;
        let w = this.state.width;
        return [...Array(h)].map(y => [...Array(w)].map(() => { return { value: 0, activated: false, flagged: false } }));
    }

    render() {
        return (
            <React.StrictMode>
                <Settings onSubmit={this.resetGame} />
                <Game {...this.state} {...this.functions} />
            </React.StrictMode>
        );
    }
}

ReactDOM.render(<App />, document.querySelector('#app'));