import * as PIXI from "pixi.js";
import constants from "../constants";
import MazeGenerator from "amazejs";

export default class Maze {
    constructor(global) {
        this.global = global;
        this.container = new PIXI.Container();
        this.global.app.stage.addChild(this.container);

        this.path = [];
        this.playerPlaza = [];
        this.enemyPlaza = [];

        this.#createMaze();
        this.#drawMaze();
        this.handleResize();
    }

    destructor() {}

    // #################################################
    //   Create maze
    // #################################################

    #createMaze() {
        const { gridX, gridY } = constants;

        const leftDeadCells = 4;
        const rightDeadCells = 2;
        const topDeadCells = 1;
        const bottomDeadCells = 3;

        const mazeWidth = gridX - leftDeadCells - rightDeadCells;
        const mazeHeight = gridY - topDeadCells - bottomDeadCells;

        // CREATE MAZE
        let mazeGenerator = new MazeGenerator.Backtracker(mazeWidth, mazeHeight);
        mazeGenerator.generate();

        const maze = [];
        for (let i = 0; i < mazeHeight; i++) {
            const column = [];
            for (let j = 0; j < mazeWidth; j++) column.push(mazeGenerator.grid[i * mazeWidth + j]);
            maze.push(column);
        }

        // CHOOSE RANDOM ENTER
        let randomEntry = 0;
        do randomEntry = Math.floor(Math.random() * (mazeHeight - 2)) + 1;
        while (!maze[randomEntry][1]);

        // CHOOSE RANDOM EXIT
        let randomExit = 0;
        do randomExit = Math.floor(Math.random() * (mazeHeight - 2)) + 1;
        while (!maze[randomExit][mazeWidth - 2] && randomEntry !== randomExit);

        var start = [randomEntry, 1];
        var end = [randomExit, mazeWidth - 2];
        var solve = mazeGenerator.solve(start, end);

        this.path = [];
        for (let i = 0; i < solve.length; i++) {
            const [y, x] = solve[i];
            if (i === 0) this.path.push({ x: x + leftDeadCells - 1, y: y + topDeadCells });
            this.path.push({ x: x + leftDeadCells, y: y + topDeadCells });
            if (i === solve.length - 1) this.path.push({ x: x + leftDeadCells + 1, y: y + topDeadCells });
        }
    }

    #drawMaze() {
        // PATH
        for (let i = 0; i < this.path.length; i++) {
            const { x, y } = this.path[i];

            if (i === 0 || i === this.path.length - 1) {
                this.#drawCell(this.path[i], "track_horizontal");
                continue;
            }

            const { x: prevX, y: prevY } = this.path[i - 1];
            const { x: nextX, y: nextY } = this.path[i + 1];

            if (x === prevX && x === nextX) this.#drawCell(this.path[i], "track_vertical");
            else if (y === prevY && y === nextY) this.#drawCell(this.path[i], "track_horizontal");
            else if ((x > prevX && y > nextY) || (x > nextX && y > prevY))
                this.#drawCell(this.path[i], "track_bottomRight");
            else if ((x > prevX && y < nextY) || (x > nextX && y < prevY))
                this.#drawCell(this.path[i], "track_topRight");
            else if ((x < prevX && y > nextY) || (x < nextX && y > prevY))
                this.#drawCell(this.path[i], "track_bottomLeft");
            else if ((x < prevX && y < nextY) || (x < nextX && y < prevY))
                this.#drawCell(this.path[i], "track_topLeft");
        }

        // PLAYER PLAZA
        this.playerPlaza = [];
        for (let i = 0; i < 3; i++) {
            const column = [];
            for (let j = 0; j < 3; j++) column.push({ x: this.path[0].x - (i + 1), y: this.path[0].y - (j - 1) });
            this.playerPlaza.push(column);
        }

        for (let i = 0; i < this.playerPlaza.length; i++)
            for (let j = 0; j < this.playerPlaza[i].length; j++) {
                if (i === 0 && j === 0) this.#drawCell(this.playerPlaza[i][j], "plaza_bottomRight");
                else if (i === 0 && j === 1) this.#drawCell(this.playerPlaza[i][j], "plaza_pointsRight");
                else if (i === 0 && j === 2) this.#drawCell(this.playerPlaza[i][j], "plaza_topRight");
                else if (i === 1 && j === 0) this.#drawCell(this.playerPlaza[i][j], "plaza_horizontalBottom");
                else if (i === 1 && j === 1) continue;
                else if (i === 1 && j === 2) this.#drawCell(this.playerPlaza[i][j], "plaza_horizontalTop");
                else if (i === 2 && j === 0) this.#drawCell(this.playerPlaza[i][j], "plaza_bottomLeft");
                else if (i === 2 && j === 1) this.#drawCell(this.playerPlaza[i][j], "plaza_verticalLeft");
                else if (i === 2 && j === 2) this.#drawCell(this.playerPlaza[i][j], "plaza_topLeft");
            }

        // ENEMY PLAZA
        this.enemyPlaza.push({ x: this.path[this.path.length - 1].x + 1, y: this.path[this.path.length - 1].y });
        this.#drawCell(this.enemyPlaza[0], "plaza_right");
    }

    #drawCell(obj, type) {
        const cell = PIXI.Sprite.from(this.global.app.loader.resources[type].texture);

        obj.type = type;
        obj.object = cell;
        this.container.addChild(obj.object);
    }

    // #################################################
    //   RESIZE
    // #################################################

    handleResize() {
        const { left, top, cellSize } = this.global.gameDimensions;

        // PATH
        for (let i = 0; i < this.path.length; i++) {
            const { x, y } = this.path[i];

            this.path[i].object.x = left + x * cellSize;
            this.path[i].object.y = top + y * cellSize;
            this.path[i].object.width = cellSize;
            this.path[i].object.height = cellSize;
        }

        // PLAYER PLAZA
        for (let i = 0; i < this.playerPlaza.length; i++)
            for (let j = 0; j < this.playerPlaza[i].length; j++) {
                if (!("object" in this.playerPlaza[i][j])) continue;

                const { x, y } = this.playerPlaza[i][j];

                this.playerPlaza[i][j].object.x = left + x * cellSize;
                this.playerPlaza[i][j].object.y = top + y * cellSize;
                this.playerPlaza[i][j].object.width = cellSize;
                this.playerPlaza[i][j].object.height = cellSize;
            }

        // ENEMY PLAZA
        for (let i = 0; i < this.enemyPlaza.length; i++) {
            const { x, y } = this.enemyPlaza[i];

            this.enemyPlaza[i].object.x = left + x * cellSize;
            this.enemyPlaza[i].object.y = top + y * cellSize;
            this.enemyPlaza[i].object.width = cellSize;
            this.enemyPlaza[i].object.height = cellSize;
        }
    }

    // #################################################
    //   GAME LOOP
    // #################################################

    gameLoop(deltaTime) {}
}