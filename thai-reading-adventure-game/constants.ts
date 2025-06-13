
import { World, Player, PlayerProgress } from './types';

// IMPORTANT: The image URLs below are placeholders from source.unsplash.com.
// For a consistent and accurate game experience, please replace these URLs
// with links to specific, curated, and appropriately licensed images
// that precisely match your questions and options.

// This is now the DEFAULT data if nothing is in localStorage
export const WORLDS_DATA: World[] = [
  {
    id: "beach",
    name: "ชายหาดตัวอักษร",
    icon: "umbrella-beach",
    color: "#ffb347",
    levels: [
      { type: 'match_image_word', question: 'ภาพนี้คือคำว่าอะไร?', image: 'https://source.unsplash.com/250x180/?ice%20cream,dessert,food', options: ['ไอศกรีม', 'รถไฟ', 'ดินสอ'], answer: 'ไอศกรีม' },
      { type: 'match_image_word', question: 'ภาพนี้คือคำว่าอะไร?', image: 'https://source.unsplash.com/250x180/?cabbage,vegetable,green', options: ['ต้นไม้', 'กะหล่ำปลี', 'ชมพู่'], answer: 'กะหล่ำปลี' },
      { type: 'match_image_word', question: 'ภาพนี้คือคำว่าอะไร?', image: 'https://source.unsplash.com/250x180/?lion,animal,safari', options: ['ลูกชิ้น', 'สิงโต', 'ไข่ดาว'], answer: 'สิงโต' },
    ]
  },
  {
    id: "forest",
    name: "ป่าคำศัพท์",
    icon: "tree",
    color: "#06d6a0",
    levels: [
      { type: 'sentence_from_image', question: 'เด็กๆ กำลังทำอะไรกัน?', image: 'https://source.unsplash.com/250x180/?children,park,playing,volunteer', options: ['ช่วยกันเก็บขยะ', 'วิ่งเล่นในสนาม', 'อ่านหนังสือ'], answer: 'ช่วยกันเก็บขยะ' },
      { type: 'sentence_from_image', question: 'เด็กผู้ชายกำลังทำอะไร?', image: 'https://source.unsplash.com/250x180/?boy,water%20buffalo,farm,rural', options: ['เล่นกับควาย', 'ให้อาหารไก่', 'ดูนกบิน'], answer: 'เล่นกับควาย' },
    ]
  },
  {
    id: "town",
    name: "เมืองประโยคสนุก",
    icon: "city",
    color: "#118ab2",
    levels: [
      { type: 'symbol_meaning', question: 'ป้ายนี้หมายความว่าอย่างไร?', image: 'https://source.unsplash.com/250x180/?traffic%20sign,road%20symbol,warning', options: ['ห้ามเลี้ยวซ้าย', 'ให้เลี้ยวซ้าย', 'ทางตัน'], answer: 'ห้ามเลี้ยวซ้าย' },
      { type: 'sentence_completion', question: 'ฉันชอบกิน ____ เพราะมันหวานอร่อย', options: ['มะม่วง', 'พริก', 'เกลือ'], answer: 'มะม่วง' },
    ],
    locked: false
  },
  {
    id: "cave",
    name: "ถ้ำเรื่องราว",
    icon: "mountain",
    color: "#9d4edd",
    levels: [
      { type: 'passage_comprehension', question: 'จากเรื่องที่อ่าน สุนัขชื่ออะไร?', passage: "มะลิมีสุนัขตัวหนึ่งชื่อจุด มันชอบวิ่งเล่นในสนามหญ้าทุกวัน", options: ['มะลิ', 'จุด', 'ข้าวตู'], answer: 'จุด' },
    ],
    locked: false
  }
];

export const INITIAL_PLAYER_NAME = 'น้องเก่ง';

// INITIAL_PLAYER_DATA progress will be initialized by loadPlayerData based on current worlds
export const INITIAL_PLAYER_DATA: Omit<Player, 'progress'> & { progress?: PlayerProgress } = {
  name: INITIAL_PLAYER_NAME,
  stars: 0,
  coins: 0,
  // progress will be populated by loadPlayerData
};