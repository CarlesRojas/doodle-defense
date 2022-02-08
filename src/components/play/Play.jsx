import { useRef, useEffect, useCallback } from "react";

import UI from "./UI";

import useResize from "../../hooks/useResize";

export default function Play() {
    const container = useRef();

    // #################################################
    //   RESIZE
    // #################################################

    const handleResize = () => {
        // const width = container.current.clientWidth;
        // const height = container.current.clientHeight;
    };

    useResize(handleResize, false);

    // #################################################
    //   INIT
    // #################################################

    const init = useCallback(() => {
        // const width = container.current.clientWidth;
        // const height = container.current.clientHeight;
    }, []);

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
