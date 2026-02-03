import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

interface QuizGameProps {
  petName: string;
  onWin: (reward: { coins: number; exp: number; happiness: number }) => void;
  onLose: () => void;
  onClose: () => void;
}

const QuizGame: React.FC<QuizGameProps> = ({ petName, onWin, onLose, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const questions = [
    {
      category: 'tamagotchi-lore',
      question: '¿Qué necesita tu mascota para estar feliz?',
      answers: ['Solo comida', 'Comida, juego y cariño', 'Solo dormir', 'Solo monedas'],
      correct: 1
    },
    {
      category: 'general',
      question: '¿Cuánto tiempo suele dormir un gato al día?',
      answers: ['2-4 horas', '8-10 horas', '12-16 horas', '20-24 horas'],
      correct: 2
    },
    {
      category: 'math',
      question: 'Si tu mascota tiene 3 monedas y gana 5, ¿cuántas tiene ahora?',
      answers: ['5', '6', '7', '8'],
      correct: 3
    },
    {
      category: 'tamagotchi-lore',
      question: '¿Qué sucede si no limpias a tu mascota?',
      answers: ['Nada', 'Se pone triste', 'Puede enfermarse', 'Gana más monedas'],
      correct: 2
    },
    {
      category: 'general',
      question: '¿Cuál es el alimento principal de la mayoría de las mascotas virtuales?',
      answers: ['Pizza', 'Comida especial', 'Pescado', 'Vegetales'],
      correct: 1
    }
  ];

  const currentQ = questions[currentQuestion];

  const handleAnswer = useCallback((answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);

    if (answerIndex === currentQ.correct) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      setShowFeedback(false);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 2000);
  }, [currentQuestion, currentQ.correct, questions.length]);

  const getReward = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) {
      return { coins: 50, exp: 40, happiness: 45 };
    } else if (percentage >= 60) {
      return { coins: 35, exp: 25, happiness: 30 };
    } else if (percentage >= 40) {
      return { coins: 20, exp: 15, happiness: 20 };
    } else {
      return { coins: 10, exp: 5, happiness: 10 };
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tamagotchi-lore': return 'var(--arcade-pink)';
      case 'general': return 'var(--arcade-purple)';
      case 'math': return 'var(--arcade-cyan)';
      default: return 'var(--arcade-pink)';
    }
  };

  if (showResult) {
    const reward = getReward();
    const won = score >= questions.length * 0.6;

    return (
      <motion.div
        className="quiz-game-container"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="quiz-header">
          <h2 className="quiz-title">🎯 Quiz Tamagotchi</h2>
          <button onClick={onClose} className="quiz-close">✕</button>
        </div>

        <div className="quiz-result">
          <div className="result-icon">{won ? '🎉' : '📚'}</div>
          <h3 className="result-title">
            {won ? '¡Excelente!' : 'Sigue estudiando'}
          </h3>
          <p className="result-score">
            Obtuviste {score} de {questions.length} respuestas correctas
          </p>
          
          {won && (
            <div className="reward-display">
              <div className="reward-item">🪙 +{reward.coins}</div>
              <div className="reward-item">⭐ +{reward.exp} EXP</div>
              <div className="reward-item">😊 +{reward.happiness}</div>
            </div>
          )}

          <div className="result-buttons">
            <button 
              onClick={() => {
                if (won) {
                  onWin(reward);
                } else {
                  onLose();
                }
              }}
              className="quiz-button primary"
            >
              {won ? '¡Gané!' : 'Terminar'}
            </button>
            <button 
              onClick={() => {
                setCurrentQuestion(0);
                setScore(0);
                setShowResult(false);
                setSelectedAnswer(null);
              }}
              className="quiz-button secondary"
            >
              Jugar de nuevo
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="quiz-game-container"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="quiz-header">
        <h2 className="quiz-title">🎯 Quiz Tamagotchi</h2>
        <button onClick={onClose} className="quiz-close">✕</button>
      </div>

      <div className="quiz-progress">
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
        <span className="progress-text">
          Pregunta {currentQuestion + 1} de {questions.length}
        </span>
      </div>

      <div className="quiz-category" style={{ color: getCategoryColor(currentQ.category) }}>
        {currentQ.category === 'tamagotchi-lore' && '🌟 Conocimientos Tamagotchi'}
        {currentQ.category === 'general' && '📚 Cultura General'}
        {currentQ.category === 'math' && '🔢 Matemáticas'}
      </div>

      <div className="quiz-question">
        {currentQ.question}
      </div>

      <div className="quiz-answers">
        {currentQ.answers.map((answer, index) => (
          <motion.button
            key={index}
            className={`quiz-answer ${selectedAnswer === index ? 'selected' : ''} ${
              showFeedback ? (index === currentQ.correct ? 'correct' : 'incorrect') : ''
            }`}
            onClick={() => !showFeedback && handleAnswer(index)}
            disabled={showFeedback}
            whileHover={!showFeedback ? { scale: 1.02 } : {}}
            whileTap={!showFeedback ? { scale: 0.98 } : {}}
          >
            <span className="answer-letter">{String.fromCharCode(65 + index)}</span>
            <span className="answer-text">{answer}</span>
            {showFeedback && index === currentQ.correct && (
              <motion.span
                className="answer-feedback correct-icon"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                ✓
              </motion.span>
            )}
            {showFeedback && selectedAnswer === index && index !== currentQ.correct && (
              <motion.span
                className="answer-feedback incorrect-icon"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                ✗
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>

      <div className="quiz-score">
        Puntuación: {score} ✨
      </div>
    </motion.div>
  );
};

export default QuizGame;