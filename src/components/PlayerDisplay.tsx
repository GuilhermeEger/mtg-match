
import React, {useState, useEffect} from "react";
import LifeDisplay from "./common/LifeDisplay";

interface PlayerDisplayProps {
   id?: string;
   health: number;
   interacting?: boolean;
   finishInteraction?: (event: React.TouchEvent) => void;
   onTouchStart?: (event: React.TouchEvent) => void;
   onTouchEnd?: (event: React.TouchEvent) => void;
   setHealthPoints: (healthPoints: number) => void;
}

export default function PlayerDisplay({ id, health, interacting, finishInteraction, onTouchStart, onTouchEnd, setHealthPoints }: PlayerDisplayProps) {

    const [initialHealthPoints, setInitialHealthPoints] = useState(40);
    const [healthClass, setHealthClass] = useState("health-normal");

    useEffect(() => {
        setInitialHealthPoints(health);
    }, []);

    useEffect(() => {
        setInitialHealthPoints(health);
    }, [interacting]);

    useEffect(() => {
        handleHealthClass();
    }, [health]);

    function handlePlusClick(event: React.TouchEvent) {
        event.preventDefault();
        setHealthPoints(health + 1);
    }

    function handleMinusClick(event: React.TouchEvent) {
        event.preventDefault();
        setHealthPoints(health - 1);
    }

    function handleItaraction(event: React.TouchEvent) {
        event.preventDefault();

        setHealthClass("health-normal");

        if (finishInteraction) {
            finishInteraction(event);
        }
    }
    
    function handleHealthClass() {
        if (health > initialHealthPoints) {
            setHealthClass("health-increase");
        } else if (health < initialHealthPoints) {
            setHealthClass("health-decrease");
        } else {
            setHealthClass("health-normal");
        }
    }

    function startInteraction(event: React.TouchEvent) {
        event.preventDefault();
        if (onTouchStart) {
            onTouchStart(event);
        }
    }

    function endInteraction(event: React.TouchEvent) {
        event.preventDefault();
        if (onTouchEnd) {
            onTouchEnd(event);
        }
    }

    return (
        <div className="player-display">
            <div 
            onTouchEnd={interacting ? undefined : endInteraction}
            onTouchStart={interacting ? undefined : startInteraction}
            className="player-health">
                <LifeDisplay 
                interacting={interacting}
                healthPoints={health}
                healthClass={interacting ? healthClass : "health-normal"}
                handlePlusClick={handlePlusClick}
                handleMinusClick={handleMinusClick}
                />
            </div>
            {interacting && 
            <div onTouchEnd={handleItaraction} className="action-display">
                Done
            </div>}
        </div>
    );
}
