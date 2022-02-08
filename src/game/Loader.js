import WolfSprite from "../resources/Wolf.png";
import BackgroundSprite from "../resources/Background.png";

export default class Loader {
    constructor(global, handleComplete) {
        this.global = global;

        this.global.app.loader.add("sprite_enemy_wolf", WolfSprite);
        this.global.app.loader.add("background", BackgroundSprite);

        this.global.app.loader.onProgress.add(this.#handleProgress.bind(this));
        this.global.app.loader.onComplete.add(handleComplete);
        this.global.app.loader.onError.add(this.#handleError.bind(this));

        this.global.app.loader.load();
    }

    // #################################################
    //   RESIZE
    // #################################################

    #handleProgress({ progress }, { name }) {
        // console.log(`${progress.toFixed(2)}% ${name} loaded`);
    }

    #handleError(error) {
        // console.log(error);
    }
}
