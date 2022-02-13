export default class Wave {
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
