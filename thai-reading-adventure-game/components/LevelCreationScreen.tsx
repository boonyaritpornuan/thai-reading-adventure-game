
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
  const [distractor1, setDistractor1] = useState('');
  const [distractor2, setDistractor2] = useState('');
  const [finalOptions, setFinalOptions] = useState<string[]>([]);

  const generateAndSetDistractors = useCallback(() => {
    if (!correctAnswer.trim()) {
      setDistractor1('');
      setDistractor2('');
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

    const uniqueAnswers = Array.from(new Set(allPossibleAnswers));
    const shuffled = uniqueAnswers.sort(() => 0.5 - Math.random());

    setDistractor1(shuffled[0] || '');
    setDistractor2(shuffled[1] || '');
  }, [correctAnswer, allWorldsData]);

  // Auto-populate distractors when correct answer changes (and is not empty)
  useEffect(() => {
    if (correctAnswer.trim()) {
      generateAndSetDistractors();
    } else {
      // Clear distractors if correct answer is cleared
      setDistractor1('');
      setDistractor2('');
    }
  }, [correctAnswer, generateAndSetDistractors]);

  // Update final options whenever correct answer or distractors change
  useEffect(() => {
    if (correctAnswer.trim()) {
      const optionsSet = new Set<string>();
      optionsSet.add(correctAnswer.trim());
      if (distractor1.trim()) optionsSet.add(distractor1.trim());
      if (distractor2.trim()) optionsSet.add(distractor2.trim());
      
      setFinalOptions(Array.from(optionsSet).sort(() => 0.5 - Math.random()));
    } else {
      setFinalOptions([]);
    }
  }, [correctAnswer, distractor1, distractor2]);

  useEffect(() => {
    if (currentSelectedWorldId) {
      setSelectedWorldIdState(currentSelectedWorldId);
    } else if (worlds && worlds.length > 0 && !currentSelectedWorldId) {
       if (!worlds.find(w => w.id === selectedWorldIdState) && worlds.length > 0) {
           setSelectedWorldIdState(worlds[0].id);
       } else if (worlds.length === 0) {
           setSelectedWorldIdState('');
       }
    }
  }, [currentSelectedWorldId, worlds, selectedWorldIdState]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorldIdState || !question.trim() || !correctAnswer.trim() || finalOptions.length < 2) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน: เลือกดินแดน, คำถาม, คำตอบที่ถูกต้อง และต้องมีตัวเลือกอย่างน้อย 2 ตัวเลือก (รวมคำตอบที่ถูกต้องและตัวเลือกหลอกอย่างน้อยหนึ่งตัว)');
      return;
    }
    if (worlds.length === 0 && !currentSelectedWorldId) {
        alert('ไม่สามารถสร้างด่านได้ เนื่องจากยังไม่มีดินแดน กรุณาสร้างดินแดนก่อน (อาจต้องทำผ่านโค้ดสำหรับเวอร์ชันนี้)');
        return;
    }

    const newLevel: Level = {
      type: imageUrl.trim() ? 'match_image_word' : 'sentence_completion',
      question: question.trim(),
      image: imageUrl.trim() || undefined,
      options: finalOptions,
      answer: correctAnswer.trim(),
    };
    onAddLevel(newLevel, selectedWorldIdState);
    setQuestion('');
    setImageUrl('');
    setCorrectAnswer(''); // This will also clear distractors due to useEffect
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
          <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-center justify-between">
                <h3 className={`${labelClass} mb-0`}>ตัวเลือกหลอก:</h3>
                <button
                    type="button"
                    onClick={generateAndSetDistractors}
                    className="text-sm text-[#4facfe] hover:text-[#007bff] p-1 rounded-full hover:bg-blue-100 flex items-center gap-1"
                    aria-label="สุ่มตัวเลือกหลอกใหม่"
                >
                    <i className="fas fa-sync-alt"></i> สุ่มใหม่
                </button>
            </div>
            <div>
              <label htmlFor="distractor1" className={`${labelClass} text-xs`}>ตัวเลือกหลอก 1:</label>
              <input
                type="text"
                id="distractor1"
                value={distractor1}
                onChange={(e) => setDistractor1(e.target.value)}
                className={`${inputClass} p-2 text-sm`}
                placeholder="กรอกตัวเลือกหลอก หรือปล่อยให้สุ่ม"
              />
            </div>
            <div>
              <label htmlFor="distractor2" className={`${labelClass} text-xs`}>ตัวเลือกหลอก 2:</label>
              <input
                type="text"
                id="distractor2"
                value={distractor2}
                onChange={(e) => setDistractor2(e.target.value)}
                className={`${inputClass} p-2 text-sm`}
                placeholder="กรอกตัวเลือกหลอก หรือปล่อยให้สุ่ม"
              />
            </div>
             <p className="text-xs text-gray-500 mt-1">
              ตัวเลือกหลอกจะถูกเติมอัตโนมัติจากคำตอบของด่านอื่นๆ (ถ้ามี) คุณสามารถแก้ไขได้ตามต้องการ
            </p>
          </div>
        )}
        
        {finalOptions.length > 0 && (
            <div>
                <h3 className={`${labelClass} mt-2`}>ตัวเลือกสุดท้าย (ที่จะแสดงในเกม, สลับลำดับแล้ว):</h3>
                 <ul className="list-disc list-inside bg-white p-3 rounded-md border border-gray-200">
                    {finalOptions.map((opt, index) => (
                    <li key={index} className="text-gray-700">{opt} {opt === correctAnswer.trim() && <span className="text-xs text-green-600 font-semibold">(คำตอบที่ถูกต้อง)</span>}</li>
                    ))}
                </ul>
                {finalOptions.length < 2 && <p className="text-xs text-red-500 mt-1">คำเตือน: ต้องมีตัวเลือกอย่างน้อย 2 ตัวเลือก (คำตอบที่ถูกต้อง และอย่างน้อยหนึ่งตัวเลือกหลอกที่แตกต่าง)</p>}
            </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-4 border-t">
          <Button type="submit" variant="secondary" iconClass="fas fa-save" className="w-full sm:w-auto" disabled={(worlds.length === 0 && !currentSelectedWorldId) || finalOptions.length < 2}>
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
