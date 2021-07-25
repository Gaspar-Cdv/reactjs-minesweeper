import '../styles/Cell.css';

let colors = ['#0000ff', '#008000', '#ff0000', '#000080', '#800000', '#008080', '#000000', '#808080'];

export default function Cell(props) {
    let { x, y, height, width, firstClick, onFirstClick, gameOver, win, activateCell, grid, toggleFlag, mouseDown, setMouseDown, twoButtons, setTwoButtons } = props;

    /******************** EVENT FUNCTIONS ********************/

    let onMouseDown = e => {
        if (gameOver || win) return;
        if (e.button === 0) setMouseDown(x + ' ' + y);
        if (e.buttons === 3) setTwoButtons(true);
    }

    let onMouseEnter = e => {
        if (mouseDown) setMouseDown(x + ' ' + y);
    }

    let onMouseUp = e => {
        if (gameOver || win) return;
        if (e.button === 0 && !twoButtons) { // left click
            firstClick ? onFirstClick(x, y) : activateCell(x, y);
        } else if (e.button === 2 && !twoButtons) { // right click
            toggleFlag(x, y);
        } else if (twoButtons && activated && value === countFlag()) { // release two buttons if enough flags around
            around((i, j) => activateCell(j, i))
            setTwoButtons(null)
        }
        if (e.buttons === 0) setTwoButtons(null)
    }

    /******************** SECONDARY FUNCTIONS ********************/

    function around(callback) { // callback for all cells around the current cell
        for (let i = Math.min(y + 1, height - 1); i >= Math.max(y - 1, 0); i--) {
            for (let j = Math.min(x + 1, width - 1); j >= Math.max(x - 1, 0); j--) {
                callback(i, j);
            }
        }
    }

    function countFlag() { // count flags around cell [x, y]
        let count = 0;
        around((i, j) => grid[i][j].flagged === 'flag' && count++)
        return count;
    }

    function isNext() { // check if a cell is next to the cell hovered when two buttons are clicked
        if (!mouseDown) return false;
        let [X, Y] = mouseDown.split(' ');
        return Math.abs(x - X) < 2 && Math.abs(y - Y) < 2;
    }

    /******************** VARIABLES ********************/

    let value = grid[y]?.[x]?.value;
    let activated = grid[y]?.[x]?.activated;
    let flag = grid[y]?.[x]?.flagged
    let bomb = <img src="./img/bomb.png" alt="x" />;
    activated && (value = value === 'x' ? bomb : value || '');
    flag = flag === 'flag' || (win && value === 'x') ? <img src="./img/flag.png" alt="F" /> : flag || '';
    let mineFound = gameOver === x + ' ' + y;

    /******************** HTML ATTRIBUTES ********************/

    let icon = flag || (gameOver && value === 'x' && bomb) || (activated && value);
    let className = "cell" + (activated ? " activated" : "");
    let style = {
        color: colors[flag ? 6 : value - 1],
        border : !flag && (mouseDown === x + ' ' + y || (twoButtons && isNext()) || (gameOver && value === 'x')) ? '1px solid #808080' : null,
        backgroundColor: mineFound ? 'red' : null
    }

    /******************** RENDER ********************/

    return (
        <div {...{ className }} {...{ style }} {...{ onMouseDown }} {...{ onMouseEnter }} {...{ onMouseUp }}>
            {icon}
        </div>
    );
}