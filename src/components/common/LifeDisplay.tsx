import React from 'react';
import Icon from './Icon'; // Certifique-se de ajustar o caminho para o componente Icon

interface LifeDisplayProps {
    interacting?: boolean;
    healthPoints: number;
    healthClass?: string;
    handlePlusClick:  (event: React.TouchEvent) => void;
    handleMinusClick:  (event: React.TouchEvent) => void;
}

export default function LifeDisplay({
    interacting,
    healthPoints,
    healthClass,
    handlePlusClick,
    handleMinusClick,
}: LifeDisplayProps) {
    return (
        <div className="life-display-container">
            {interacting && (
                <div onTouchEnd={handlePlusClick} className="life-handler-icon">
                    <Icon icon="plus" />
                </div>
            )}
            <div className={`health-points ${healthClass}`}>
                {healthPoints}
            </div>
            {interacting && (
                <div onTouchEnd={handleMinusClick} className="life-handler-icon">
                    <Icon icon="minus" />
                </div>
            )}
        </div>
    );
}