import { useContext, useState, useCallback, useEffect } from "react";
import useGlobalState from "../../hooks/useGlobalState";
import useThrottle from "../../hooks/useThrottle";

import { Events } from "../../contexts/Events";
import { Utils } from "../../contexts/Utils";

import DrawPile from "../../resources/sprites/ui/DrawPile.png";
import DiscardPile from "../../resources/sprites/ui/DiscardPile.png";

export default function UI() {
    const { emit, sub, unsub } = useContext(Events);
    const { vibrate } = useContext(Utils);

    const [gameDimensions] = useGlobalState("gameDimensions");

    // #################################################
    //   HANDLERS
    // #################################################

    const handleDrawPileClick = useThrottle(() => {
        vibrate(40);
        emit("drawPileClicked"); // ROJAS do something when this is clicked
    }, 250);

    const handleDiscardPileClick = useThrottle(() => {
        vibrate(40);
        emit("discardPileClicked"); // ROJAS do something when this is clicked
    }, 250);

    // #################################################
    //   CARD PILES
    // #################################################

    const [drawPile, setDrawPile] = useState(0);
    const [discardPile, setDiscardPile] = useState(0);

    const handleUpdateDrawPile = useCallback((drawPileNum) => {
        setDrawPile(drawPileNum);
    }, []);

    const handleUpdateDiscardPile = useCallback((discardPileNum) => {
        setDiscardPile(discardPileNum);
    }, []);

    useEffect(() => {
        sub("updateDrawPile", handleUpdateDrawPile);
        sub("updateDiscardPile", handleUpdateDiscardPile);

        return () => {
            unsub("updateDrawPile", handleUpdateDrawPile);
            unsub("updateDiscardPile", handleUpdateDiscardPile);
        };
    }, [sub, unsub, handleUpdateDrawPile, handleUpdateDiscardPile]);

    // #################################################
    //   RENDER
    // #################################################

    const { height, width, left, top, cellSize } = gameDimensions;

    return (
        <div className="UI">
            <div
                className="gameContainer"
                style={{ height: `${height}px`, width: `${width}px`, left: `${left}px`, top: `${top}px` }}
            ></div>

            <div className="cardPiles" style={{ height: `${cellSize * 2}px` }}>
                <div
                    className="pile"
                    style={{ height: `${cellSize * 2}px`, width: `${cellSize * 2}px`, padding: `${cellSize * 0.4}px` }}
                >
                    <img src={DrawPile} alt="" className="icon" onClick={handleDrawPileClick} />
                    <p className="numOfCards">{drawPile}</p>
                </div>

                <div
                    className="pile"
                    style={{ height: `${cellSize * 2}px`, width: `${cellSize * 2}px`, padding: `${cellSize * 0.4}px` }}
                >
                    <img src={DiscardPile} alt="" className="icon" onClick={handleDiscardPileClick} />
                    <p className="numOfCards discard">{discardPile}</p>
                </div>
            </div>
        </div>
    );
}
