import { useRef, useEffect, useContext, useCallback } from "react";

import UI from "./UI";
import Controller from "../../game/Controller";

import useResize from "../../hooks/useResize";

import { GlobalState } from "../../contexts/GlobalState";
import { Events } from "../../contexts/Events";

export default function Play() {
    const globalState = useContext(GlobalState);
    const events = useContext(Events);

    const container = useRef();
    const controller = useRef();

    // #################################################
    //   RESIZE
    // #################################################

    const handleResize = () => {
        const width = container.current.clientWidth;
        const height = container.current.clientHeight;

        controller.current.handleResize({ width, height });
    };

    useResize(handleResize, false);

    // #################################################
    //   INIT
    // #################################################

    const init = useCallback(() => {
        const width = container.current.clientWidth;
        const height = container.current.clientHeight;

        controller.current = new Controller({ container, state: globalState, events, width, height });
    }, [globalState, events]);

    useEffect(() => {
        init();
    }, [init]);

    // #################################################
    //   RENDER
    // #################################################

    return (
        <div className="Play">
            <div className="playContainer" ref={container}></div>
            <UI />
        </div>
    );
}
