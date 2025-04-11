'use client'

import React, { useState, useEffect, useRef } from "react";
import PlayerDisplay from "@/components/PlayerDisplay";
import LifeDisplay from "@/components/common/LifeDisplay";


export default function GameHandler() {
  const quadrantsRef = useRef<HTMLDivElement[]>([]); // Referências para os quadrantes
  const [arrow, setArrow] = useState<{ startX: number; startY: number; endX: number; endY: number } | null>(null);
  const [players, setPlayers] = useState([
    { id: "1", name: "Player 1", interacting: false, healthPoints: 40 },
    { id: "2", name: "Player 2", interacting: false, healthPoints: 40 },
    { id: "3", name: "Player 3", interacting: false, healthPoints: 40 },
    { id: "4", name: "Player 4", interacting: false, healthPoints: 40 },
  ]);
  const [damageType, setDamageType] = useState("");
  const [damagingPlayerId, setDamagingPlayerId] = useState("");
  const [pingDamage, setPingDamage] = useState(0);

  function handleDamageType(damageType: string, startPlayerId: string) {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) => {
        if (damageType === "allPlayers") {
          return { ...player, interacting: true };
        } else if (damageType === "allOpponents") {
          return player.id !== startPlayerId
            ? { ...player, interacting: true }
            : { ...player, interacting: false };
        }
        return player;
      })
    );
  }

  const handleTouchStart = (e: React.TouchEvent, id: string) => {
    const quadrant = quadrantsRef.current.find((q) => q?.id === id);
    setDamagingPlayerId(id);
    if (quadrant) {
      const touch = e.changedTouches[0]; // Obtém o ponto final do toque
      const centerX = touch.clientX;
      const centerY = touch.clientY;

      setArrow({
        startX: centerX,
        startY: centerY,
        endX: centerX,
        endY: centerY,
      });

    }  
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (arrow) {
      const touch = e.touches[0];
      setArrow({
        ...arrow,
        endX: touch.clientX,
        endY: touch.clientY,
      });
    }
  };

  function checkIfTouchEndedInElement(element: Element | null, x: number, y: number): boolean {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  }
  
  function handleSpecialZones(x: number, y: number, startPlayerId: string): boolean {
    const allPlayersElement = document.querySelector(".multiple-damage-display-title:nth-child(1)");
    const allOpponentsElement = document.querySelector(".multiple-damage-display-title:nth-child(2)");
  
    if (checkIfTouchEndedInElement(allPlayersElement, x, y)) {
      setDamageType("allPlayers");
      handleDamageType("allPlayers", startPlayerId);
      return true;
    }
  
    if (checkIfTouchEndedInElement(allOpponentsElement, x, y)) {
      setDamageType("allOpponents");
      handleDamageType("allOpponents", startPlayerId);
      return true;
    }
  
    return false;
  }
  
  function findMatchedQuadrant(x: number, y: number): HTMLDivElement | null {
    return quadrantsRef.current.find((quadrant) => {
      if (!quadrant) return false;
      const rect = quadrant.getBoundingClientRect();
      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    }) || null;
  }
  
  function handleTouchEnd(e: React.TouchEvent) {
    const touch = e.changedTouches[0];
    const x = touch.clientX;
    const y = touch.clientY;
  
    const startPlayerId = damagingPlayerId
  
    if (handleSpecialZones(x, y, startPlayerId)) {
      setArrow(null);
      return;
    }
  
    const matchedQuadrant = findMatchedQuadrant(x, y);
  
    if (matchedQuadrant) {
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player.id === matchedQuadrant.id ? { ...player, interacting: true } : player
        )
      );
    } else {
      console.log("Touch ended outside any quadrante");
    }
  
    setArrow(null);
  }

  function applyDamage() {
    if (damageType === "allPlayers") {
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) => ({
          ...player,
          healthPoints: player.healthPoints - 1, // Dano para todos os jogadores
        }))
      );
    } else if (damageType === "allOpponents") {
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player.id !== damagingPlayerId
            ? { ...player, healthPoints: player.healthPoints - 1 } // Dano para todos os oponentes
            : player
        )
      );
    }
  }
  
  function removeDamage() {

    if(pingDamage <= 0) return;

    if (damageType === "allPlayers") {
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) => ({
          ...player,
          healthPoints: player.healthPoints + 1, // Remover dano de todos os jogadores
        }))
      );
    } else if (damageType === "allOpponents") {
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player.id !== damagingPlayerId
            ? { ...player, healthPoints: player.healthPoints + 1 } // Remover dano de todos os oponentes
            : player
        )
      );
    }
  }

  return (
    <div>

      <div>

        <div className="match-board">

          {arrow && (
            <svg
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
              }}
            >
              <line
                x1={arrow.startX}
                y1={arrow.startY}
                x2={arrow.endX}
                y2={arrow.endY}
                stroke="red"
                strokeWidth="2"
              />
            </svg>
          )}

          {(arrow || (damageType === "allPlayers" || damageType === "allOpponents")) && <div className="multiple-damage-display">
            {damageType == "" &&
            <>
              <div className="multiple-damage-display-title">
                All players
              </div>
              <div className="multiple-damage-display-title">
                All opponents
              </div>
            </>}
            {(damageType === "allPlayers" || damageType === "allOpponents") &&
            <div>

              <LifeDisplay 
                healthPoints={pingDamage}
                interacting={true}
                handlePlusClick={() => {
                  setPingDamage((prev) => prev + 1);
                  applyDamage(); 
                }}
                handleMinusClick={() => {
                  setPingDamage((prev) => Math.max(0, prev - 1));
                  removeDamage(); 
                }}
              />

                <div onTouchEnd={(e) => {
                  e.preventDefault();
                  setDamageType("");
                  setPingDamage(0);
                  setPlayers((prevPlayers) =>
                  prevPlayers.map((player) => ({ ...player, interacting: false }))
                  );
                }}>
                  done
                </div>

            </div>}
          </div>}
            
          {players.map((player, index) => (
            <div
              key={player.id}
              id={player.id.toString()}
              ref={(el) => {
                if (el) quadrantsRef.current[index] = el; 
              }}        
              onTouchMove={handleTouchMove}
              className="quadrant"
            >
              <PlayerDisplay 
              onTouchStart={(e) => handleTouchStart(e, player.id.toString())}
              onTouchEnd={handleTouchEnd}
              health={player.healthPoints}
              setHealthPoints={(healthPoints) => {
                  setPlayers((prevPlayers) =>
                    prevPlayers.map((p) => (p.id === player.id ? { ...p, healthPoints } : p))
                  );
                } 
              }
              finishInteraction={() => {
                setPlayers((prevPlayers) =>
                  prevPlayers.map((p) => (p.id === player.id ? { ...p, interacting: false } : p))
                );
              }} 
              interacting={player.interacting}
               id={player.id.toString()} />
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
