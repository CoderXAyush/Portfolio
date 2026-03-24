import { useEffect, useRef, useState } from 'react';

const WORDS = [
  // Tech words
  'react', 'golang', 'docker', 'linux', 'vite',
  'node', 'redis', 'nginx', 'rust', 'python',
  'git', 'api', 'css', 'html', 'firebase',
  'kafka', 'mongo', 'swift', 'flutter', 'sql',
  // Random words
  'ocean', 'galaxy', 'pixel', 'dream', 'storm',
  'ghost', 'flame', 'cloud', 'night', 'spark',
  'frost', 'shade', 'blade', 'drift', 'orbit',
  'flash', 'cyber', 'laser', 'ultra', 'prism',
  'alpha', 'delta', 'omega', 'sigma', 'nexus',
  'chaos', 'logic', 'blend', 'crisp', 'swift',
  'quest', 'pulse', 'surge', 'float', 'climb',
];

const TypingGame = () => {
  const [active, setActive] = useState(false);
  const [word, setWord] = useState('');
  const [typed, setTyped] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameOver, setGameOver] = useState(false);
  const inputRef = useRef(null);

  const pickWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];

  const startGame = () => {
    setActive(true);
    setScore(0);
    setTimeLeft(15);
    setGameOver(false);
    setWord(pickWord());
    setTyped('');
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // Timer
  useEffect(() => {
    if (!active || gameOver) return;
    if (timeLeft <= 0) {
      setGameOver(true);
      setActive(false);
      return;
    }
    const t = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [active, timeLeft, gameOver]);

  const handleInput = (e) => {
    const val = e.target.value.toLowerCase();
    setTyped(val);
    if (val === word) {
      setScore(prev => prev + 1);
      setWord(pickWord());
      setTyped('');
    }
  };

  if (!active && !gameOver) {
    return (
      <div className="mini-game">
        <button className="game-start-btn" onClick={startGame}>
          ▶ Type Speed Challenge
        </button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="mini-game">
        <div className="game-result">
          <span className="game-score-final">{score}</span>
          <span className="game-score-label">words in 15s</span>
        </div>
        <button className="game-start-btn" onClick={startGame}>
          ↻ Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mini-game active">
      <div className="game-hud">
        <span className="game-timer">{timeLeft}s</span>
        <span className="game-score">{score}</span>
      </div>
      <div className="game-word">
        {word.split('').map((char, i) => (
          <span
            key={i}
            className={`game-char ${i < typed.length ? (typed[i] === char ? 'correct' : 'wrong') : ''}`}
          >
            {char}
          </span>
        ))}
      </div>
      <input
        ref={inputRef}
        type="text"
        className="game-input"
        value={typed}
        onChange={handleInput}
        autoFocus
        spellCheck={false}
        autoComplete="off"
      />
    </div>
  );
};

export default TypingGame;
