
import React, { useState, useEffect, useCallback } from 'react';
import { World, Level } from '../types';
import Button from './Button';

interface LevelCreationScreenProps {
  worlds: World[]; 
  currentSelectedWorldId?: string; 
  onAddLevel: (newLevel: Level, worldId: string) => void;
  onBack: () => void;
  allWorldsData: World[];
}

const LevelCreationScreen: React.FC<LevelCreationScreenProps> = ({
  worlds,
  currentSelectedWorldId,
  onAddLevel,
  onBack,
  allWorldsData,
}) => {
  const [selectedWorldIdState, setSelectedWorldIdState] = useState<string>(
    currentSelectedWorldId || (worlds && worlds.length > 0 ? worlds[0].id : '')
  );
  const [question, setQuestion] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [distractorOptions, setDistractorOptions] = useState<string[]>([]);
  const [finalOptions, setFinalOptions] = useState<string[]>([]);

  const generateDistractors = useCallback(() => {
    if (!correctAnswer.trim()) {
      setDistractorOptions([]);
      return;
    }

    const allPossibleAnswers: string[] = [];
    allWorldsData.forEach(world => {
      world.levels.forEach(level => {
        // Exclude the current correct answer and ensure answers are non-empty and unique (case-insensitive)
        if (level.answer.trim() && level.answer.trim().toLowerCase() !== correctAnswer.trim().toLowerCase()) {
          allPossibleAnswers.push(level.answer.trim());
        }
      });
    });

    // Get unique answers only
    const uniqueAnswers = Array.from(new Set(allPossibleAnswers));
    const shuffled = uniqueAnswers.sort(() => 0.5 - Math.random());
    
    // Aim for 2 distractors, but take fewer if not enough unique options are available
    setDistractorOptions(shuffled.slice(0, 2)); 
  }, [correctAnswer, allWorldsData]);

  useEffect(() => {
    // Re-generate distractors when the correct answer changes
    generateDistractors();
  }, [correctAnswer, generateDistractors]);

  useEffect(() => {
    // Update final options whenever correct answer or distractors change
    if (correctAnswer.trim()) {
      const optionsSet = new Set<string>();
      optionsSet.add(correctAnswer.trim());
      distractorOptions.forEach(opt => optionsSet.add(opt));
      
      // Shuffle the final unique options
      setFinalOptions(Array.from(optionsSet).sort(() => 0.5 - Math.random()));
    } else {
      setFinalOptions([]);
    }
  }, [correctAnswer, distractorOptions]);

  // Effect to update local selectedWorldIdState if currentSelectedWorldId prop changes (e.g., re-navigating)
  useEffect(() => {
    if (currentSelectedWorldId) {
      setSelectedWorldIdState(currentSelectedWorldId);
    } else if (worlds && worlds.length > 0 && !currentSelectedWorldId) {
       // If global creation and no specific world, default to first available, or ensure it's settable
       if (!worlds.find(w => w.id === selectedWorldIdState) && worlds.length > 0) {
           setSelectedWorldIdState(worlds[0].id);
       } else if (worlds.length === 0) {
           setSelectedWorldIdState(''); // No worlds to select
       }
    }
  }, [currentSelectedWorldId, worlds, selectedWorldIdState]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorldIdState || !question.trim() || !correctAnswer.trim() || finalOptions.length < 2) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน: เลือกดินแดน, คำถาม, คำตอบที่ถูกต้อง และต้องมีตัวเลือกอย่างน้อย 2 ตัวเลือก (รวมคำตอบที่ถูกต้อง)');
      return;
    }
    if (worlds.length === 0 && !currentSelectedWorldId) {
        alert('ไม่สามารถสร้างด่านได้ เนื่องจากยังไม่มีดินแดน กรุณาสร้างดินแดนก่อน (อาจต้องทำผ่านโค้ดสำหรับเวอร์ชันนี้)');
        return;
    }


    const newLevel: Level = {
      type: imageUrl.trim() ? 'match_image_word' : 'sentence_completion', // Basic type assignment
      question: question.trim(),
      image: imageUrl.trim() || undefined,
      options: finalOptions,
      answer: correctAnswer.trim(),
    };
    onAddLevel(newLevel, selectedWorldIdState);
    // Reset form fields after submission
    setQuestion('');
    setImageUrl('');
    setCorrectAnswer('');
    // setSelectedWorldIdState will be handled by navigation or remain for next entry
  };

  const inputClass = "w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#4facfe] focus:border-[#4facfe] outline-none transition-colors";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  if (worlds.length === 0 && !currentSelectedWorldId) {
    return (
        <div className="p-2 sm:p-4 text-center">
            <h2 className="text-2xl font-semibold mb-6 text-[#073b4c]">สร้างด่านใหม่</h2>
            <p className="text-red-500 mb-4">ไม่สามารถสร้างด่านได้ เนื่องจากยังไม่มีดินแดนในระบบ</p>
            <p className="text-gray-600 mb-4">กรุณาตรวจสอบว่ามีข้อมูลดินแดนเริ่มต้น หรือติดต่อผู้ดูแลระบบ</p>
            <Button onClick={onBack} variant="primary" iconClass="fas fa-arrow-left">
                ย้อนกลับ
            </Button>
        </div>
    );
  }

  return (
    <div className="p-2 sm:p-4">
      <h2 className="text-2xl font-semibold text-center mb-6 text-[#073b4c]">สร้างด่านใหม่</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="worldSelect" className={labelClass}>เลือกดินแดน:</label>
          <select
            id="worldSelect"
            value={selectedWorldIdState}
            onChange={(e) => setSelectedWorldIdState(e.target.value)}
            className={inputClass}
            disabled={!!currentSelectedWorldId || worlds.length === 0} 
            required
          >
            {worlds.length === 0 && <option value="">-- ไม่มีดินแดน --</option>}
            {worlds.map(world => (
              <option key={world.id} value={world.id}>{world.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="question" className={labelClass}>คำถาม:</label>
          <input
            type="text"
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className={inputClass}
            placeholder="เช่น ภาพนี้คืออะไร?"
            required
          />
        </div>

        <div>
          <label htmlFor="imageUrl" className={labelClass}>URL รูปภาพ (ถ้ามี):</label>
          <input
            type="url"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className={inputClass}
            placeholder="เช่น https://example.com/image.png"
          />
           <p className="text-xs text-gray-500 mt-1">อัปโหลดรูปภาพไปยังเว็บฝากรูป (เช่น Imgur) แล้วนำ URL มาใส่</p>
        </div>

        <div>
          <label htmlFor="correctAnswer" className={labelClass}>คำตอบที่ถูกต้อง:</label>
          <input
            type="text"
            id="correctAnswer"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            className={inputClass}
            placeholder="เช่น ไอศกรีม"
            required
          />
        </div>

        {correctAnswer.trim() && (
          <div>
            <div className="flex items-center mb-1">
                <h3 className={labelClass}>ตัวเลือก (อัตโนมัติ):</h3>
                <button 
                    type="button" 
                    onClick={generateDistractors} 
                    className="ml-2 text-sm text-[#4facfe] hover:text-[#007bff] p-1 rounded-full hover:bg-blue-100"
                    aria-label="สุ่มตัวเลือกหลอกใหม่"
                >
                    <i className="fas fa-sync-alt"></i> สุ่มใหม่
                </button>
            </div>
            {finalOptions.length > 0 ? (
              <ul className="list-disc list-inside bg-gray-50 p-3 rounded-md">
                {finalOptions.map((opt, index) => (
                  <li key={index} className="text-gray-700">{opt} {opt === correctAnswer.trim() && <span className="text-xs text-green-600">(คำตอบที่ถูกต้อง)</span>}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-500">กรอกคำตอบที่ถูกต้องเพื่อสร้างตัวเลือก</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              ตัวเลือกหลอกจะถูกสร้างจากคำตอบของด่านอื่นๆ (ถ้ามี). จะมีตัวเลือกอย่างน้อย 2 ตัวเลือกเสมอ (รวมคำตอบที่ถูกต้อง)
            </p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button type="submit" variant="secondary" iconClass="fas fa-save" className="w-full sm:w-auto" disabled={worlds.length === 0 && !currentSelectedWorldId}>
            บันทึกด่าน
          </Button>
          <Button onClick={onBack} variant="primary" iconClass="fas fa-times-circle" className="w-full sm:w-auto">
            ยกเลิก
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LevelCreationScreen;
