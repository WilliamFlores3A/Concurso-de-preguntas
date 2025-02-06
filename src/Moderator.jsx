import { useState } from 'react';
import { io } from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:3001');

export default function Moderator() {
    const [gameActive, setGameActive] = useState(false);

    const startQuestion = () => {
        socket.emit('start_question');
        setGameActive(true);
    };

    const resetGame = () => {
        socket.emit('reset');
        setGameActive(false);
    };

    return (
        <div className="container">
            <h1 className="title">🔴 Panel del Moderador 🔴</h1>
            <button className="start-button" onClick={startQuestion} disabled={gameActive}>
                🏁 Iniciar Pregunta
            </button>
            <button className="reset-button" onClick={resetGame}>
                🔄 Reiniciar
            </button>
        </div>
    );
}
