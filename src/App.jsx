import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './App.css';

const socket = io('https://backend-concurso-de-preguntas-production.up.railway.app/');

export default function BuzzerApp() {
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [confirmed, setConfirmed] = useState(!!localStorage.getItem('username'));
  const [winner, setWinner] = useState(null);
  const [gameActive, setGameActive] = useState(false);
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    socket.on('first_buzzer', (name) => {
      setWinner(name);
    });

    socket.on('reset_buzzer', () => {
      setWinner(null);
      setGameActive(false);
      setCountdown(null);
    });

    socket.on('countdown_start', () => {
      console.log("⏳ Cuenta regresiva iniciada...");
      setCountdown(3);
      let count = 3;

      const interval = setInterval(() => {
        count -= 1;
        setCountdown(count);
        if (count === 0) {
          setTimeout(() => {
            setCountdown("¡YA!");
            setTimeout(() => {
              setCountdown(null);
              setGameActive(true); // Habilita los botones después de "YA!"
            }, 1000);
          }, 1000);
          clearInterval(interval);
        }
      }, 1000);
    });

    socket.on('question_started', () => {
      console.log("🚀 Pregunta iniciada, activando botones...");
      setGameActive(true);
    });

    return () => {
      socket.off('first_buzzer');
      socket.off('reset_buzzer');
      socket.off('countdown_start');
      socket.off('question_started');
    };
  }, []);

  const handleBuzz = () => {
    if (confirmed && gameActive) {
      socket.emit('buzz', username);
    }
  };

  const handleConfirmName = () => {
    const cleanedName = username.trim();
    if (cleanedName.length >= 2) {
      setUsername(cleanedName);
      setConfirmed(true);
      localStorage.setItem('username', cleanedName); // Guarda el nombre en localStorage
    } else {
      alert("El nombre debe tener al menos 2 caracteres sin contar espacios.");
    }
  };

  const handleChangeName = () => {
    setConfirmed(false); // Permite cambiar el nombre
  };

  return (
    <div className="container">
      <h1 className="title">🎉 Concurso de Preguntas 🎉</h1>

      {!confirmed ? (
        <div className="name-box">
          <h2>¡Ingresa tu nombre!</h2>
          <input
            className="input-field"
            type="text"
            placeholder="Escribe tu nombre"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button className="confirm-button" onClick={handleConfirmName}>
            ✅ Confirmar Nombre
          </button>
        </div>
      ) : (
        <>
          {countdown !== null && (
            <div className="countdown-box">
              {countdown}
            </div>
          )}

          <button
            className={`buzzer-button ${!gameActive || winner ? "disabled" : ""}`}
            onClick={handleBuzz}
            disabled={!gameActive || !!winner}
          >
            🚀 Presiona para Responder
          </button>

          <button className="change-name-button" onClick={handleChangeName}>
            ✏️ Cambiar Nombre
          </button>
        </>
      )}

      {winner && (
        <div className="winner-box">
          🎉 {winner} fue el más rápido en presionar! 🎉
        </div>
      )}
    </div>
  );
}
