import React, { useState, useEffect } from 'react';

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const SpeechRecognitionExample: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | undefined>(undefined);

  useEffect(() => {
    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.onspeechstart = () => {
      console.log('Speech has been detected.');
    };

    recognitionInstance.onspeechend = () => {
      console.log('Speech has stopped.');
      stopRecording();
    };

    recognitionInstance.onresult = (event) => {
      setTranscript(event.results[0][0].transcript);
    };

    setRecognition(recognitionInstance);

    return () => {
      recognitionInstance.abort();
    };
  }, []);

  const startRecording = () => {
    recognition?.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    recognition?.stop();
    setIsRecording(false);
  };

  return (
    <div>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
      {isRecording && <p>Recording...</p>}
      <p>Transcript: {transcript}</p>
    </div>
  );
};

export default SpeechRecognitionExample;
