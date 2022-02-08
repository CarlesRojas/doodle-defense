// import { useContext } from "react";
import useGlobalState from "../../hooks/useGlobalState";
// import useThrottle from "../../hooks/useThrottle";

// import { Events } from "../../contexts/Events";
// import { Utils } from "../../contexts/Utils";

export default function UI() {
    // const { emit } = useContext(Events);
    // const { vibrate } = useContext(Utils);

    const [gameDimensions] = useGlobalState("gameDimensions");

    // #################################################
    //   HANDLERS
    // #################################################

    // const handleClick = useThrottle(() => {
    //     vibrate(40);
    //     emit("click");
    // }, 250);

    // #################################################
    //   RENDER
    // #################################################

    const { windowHeight, windowWidth, height, width, left, top } = gameDimensions;

    return (
        <div className="UI">
            <div
                className="gameContainer"
                style={{ height: `${height}px`, width: `${width}px`, left: `${left}px`, top: `${top}px` }}
            ></div>
        </div>
    );
}
