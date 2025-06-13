
// utils/speech.ts
export const speak = (text: string, lang: string = 'th-TH'): void => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9; // Slightly slower for clarity, adjust as needed
    window.speechSynthesis.cancel(); // Cancel any ongoing speech
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn('Text-to-Speech (Web Speech API) is not supported in this browser.');
    // Optionally, you could alert the user or use a polyfill if critical
  }
};
