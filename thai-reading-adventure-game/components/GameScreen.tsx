
import React, { useState, useEffect, useCallback } from 'react';
import { Level } from '../types';
import Button from './Button';
// Removed: import { speak } from '../utils/speech'; 

interface GameScreenProps {
  level: Level;
  onAnswer: (isCorrect: boolean) => void;
  onBack: () => void; // Callback to go back to level selection
}

const HINT_THRESHOLD = 2; // Number of incorrect attempts before offering a hint

const GameScreen: React.FC<GameScreenProps> = ({ level, onAnswer, onBack }) => {
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [showHintButton, setShowHintButton] = useState(false);
  const [optionsDisabledByHint, setOptionsDisabledByHint] = useState<string[]>([]);

  useEffect(() => {
    setShuffledOptions([...level.options].sort(() => Math.random() - 0.5));
    setSelectedOption(null);
    setIsAnswered(false);
    setIncorrectAttempts(0);
    setShowHintButton(false);
    setOptionsDisabledByHint([]);
  }, [level]);

  const handleOptionClick = useCallback((optionText: string) => {
    if (isAnswered || optionsDisabledByHint.includes(optionText)) return;

    setSelectedOption(optionText);
    setIsAnswered(true);
    const isCorrect = optionText === level.answer;

    if (!isCorrect) {
      const newIncorrectAttempts = incorrectAttempts + 1;
      setIncorrectAttempts(newIncorrectAttempts);
      
      const availableIncorrectOptions = shuffledOptions.filter(
        opt => opt !== level.answer && !optionsDisabledByHint.includes(opt)
      ).length;

      if (newIncorrectAttempts >= HINT_THRESHOLD && !showHintButton && availableIncorrectOptions > 1) {
        setShowHintButton(true);
      }
    } else {
      setShowHintButton(false); // Reset hint button if answered correctly
    }

    setTimeout(() => {
      onAnswer(isCorrect);
    }, isCorrect ? 1000 : 2000);
  }, [level.answer, onAnswer, isAnswered, incorrectAttempts, shuffledOptions, optionsDisabledByHint, showHintButton]);

  const handleUseHint = () => {
    if (!level) return;
    const incorrectOptionsNotDisabled = shuffledOptions.filter(
      opt => opt !== level.answer && !optionsDisabledByHint.includes(opt)
    );

    if (incorrectOptionsNotDisabled.length > 0) {
      // Choose a random incorrect option to disable
      const optionToDisable = incorrectOptionsNotDisabled[Math.floor(Math.random() * incorrectOptionsNotDisabled.length)];
      setOptionsDisabledByHint(prev => [...prev, optionToDisable]);
      setShowHintButton(false); // Hide hint button after use
      // Future: Deduct coins for hint if desired
    }
  };

  return (
    <div className="flex flex-col items-center relative">
      <button
        onClick={onBack}
        className="absolute top-0 left-0 text-[#073b4c] hover:text-[#4facfe] p-2 text-xl z-10"
        aria-label="กลับไปเลือกด่าน"
      >
        <i className="fas fa-arrow-left"></i>
      </button>

      {level.image && (
        <div className="w-full max-w-[250px] h-[180px] bg-gray-200 rounded-[15px] mt-8 mb-2 flex items-center justify-center overflow-hidden shadow-md">
          <img src={level.image} alt="โจทย์คำถาม" className="max-w-full max-h-full object-contain" />
        </div>
      )}
      {level.passage && (
         <div className="w-full max-w-md bg-white p-4 rounded-lg shadow mt-8 mb-2 text-left text-lg leading-relaxed">
            <p>{level.passage}</p>
        </div>
      )}
      <div className="text-center w-full px-8">
        <p className="text-[1.4rem] md:text-[1.6rem] mb-1 text-[#073b4c] leading-normal inline">
          {level.question}
        </p>
        {/* Removed TTS button for question
        <button 
          onClick={() => speak(level.question)} 
          className="text-xl text-[#4facfe] hover:text-[#007bff] ml-2 align-middle" 
          aria-label="อ่านคำถาม"
        >
          <i className="fas fa-volume-up"></i>
        </button> 
        */}
      </div>
      
      {showHintButton && (
        <div className="my-4">
          <Button onClick={handleUseHint} variant="secondary" iconClass="fas fa-lightbulb">
            ใช้คำใบ้ (ลบ 1 ตัวเลือก)
          </Button>
        </div>
      )}

      <div className="w-full max-w-lg grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {shuffledOptions.map((optionText, index) => {
          const isSelected = selectedOption === optionText;
          const isCorrectAnswer = optionText === level.answer;
          const isHintDisabled = optionsDisabledByHint.includes(optionText);
          
          let optionClasses = "p-4 sm:p-5 bg-white rounded-[12px] text-[1.3rem] md:text-[1.5rem] text-center transition-all duration-200 ease-in-out shadow-[0_4px_6px_rgba(0,0,0,0.05)] relative";

          if (isHintDisabled) {
            optionClasses += " opacity-40 bg-gray-200 cursor-not-allowed hover:bg-gray-200";
          } else {
            optionClasses += " cursor-pointer hover:bg-[#e9f5ff] hover:-translate-y-1";
          }

          if (isAnswered && isSelected && !isHintDisabled) {
            optionClasses += isCorrectAnswer ? " bg-[#06d6a0] text-white" : " bg-[#ff6b6b] text-white";
          } else if (isAnswered && isCorrectAnswer && !isHintDisabled) {
             optionClasses += " bg-[#06d6a0]/70 text-white"; // Highlight correct if user picked wrong
          }
          
          return (
            <div
              key={index}
              className={optionClasses}
              onClick={isAnswered || isHintDisabled ? undefined : () => handleOptionClick(optionText)}
              role="button"
              tabIndex={isAnswered || isHintDisabled ? -1 : 0}
              aria-pressed={isSelected}
              aria-disabled={isHintDisabled}
              onKeyPress={!isAnswered && !isHintDisabled ? (e) => e.key === 'Enter' && handleOptionClick(optionText) : undefined}
            >
              {optionText}
              {/* Removed TTS button for options
              {!isHintDisabled && (
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); // Prevent option click
                    speak(optionText); 
                  }} 
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-lg text-[#4facfe] hover:text-[#007bff] p-1" 
                  aria-label={`อ่านตัวเลือก ${optionText}`}
                >
                  <i className="fas fa-volume-up"></i>
                </button>
              )}
              */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GameScreen;
