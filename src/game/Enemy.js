export default class Enemy {
    constructor(global, info) {
        this.global = global;
        this.info = info;

        this.handleResize();
    }

    destructor() {}

    // #################################################
    //   RESIZE
    // #################################################

    handleResize() {}

    // #################################################
    //   GAME LOOP
    // #################################################

    gameLoop(deltaTime) {}
}
