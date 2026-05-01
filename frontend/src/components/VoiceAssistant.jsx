import React, { useState, useRef, useCallback } from 'react';
import { Mic, Square, Play, Loader2, Volume2, MessageSquare } from 'lucide-react';
import api from '../services/api';
import { getUser } from '../services/auth';

export default function VoiceAssistant() {
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);
  const user = getUser();
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') 
        ? 'audio/webm' 
        : 'audio/mp4';

      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        await handleVoiceQuery(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setError(null);
    } catch (err) {
      console.error("Microphone access denied", err);
      setError("Microphone access denied. Please enable it in your browser.");
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all tracks in the stream
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  }, [isRecording]);

  const handleVoiceQuery = async (audioBlob) => {
    setLoading(true);
    setTranscript('');
    setResponse(null);
    setAudioUrl(null);

    const extension = audioBlob.type.includes('mp4') ? 'mp4' : 'webm';
    const formData = new FormData();
    formData.append('file', audioBlob, `voice_query.${extension}`);

    try {
      const res = await api.post('/voice/query', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setTranscript(res.data.transcript);
      setResponse(res.data.response);
      
      // Automatically synthesize speech for the plain explanation
      if (res.data.response.plain_explanation) {
        await synthesizeSpeech(res.data.response.plain_explanation);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Voice processing failed.");
    } finally {
      setLoading(false);
    }
  };

  const synthesizeSpeech = async (text) => {
    try {
      const res = await api.post('/voice/synthesize', { text }, {
        responseType: 'blob'
      });
      const url = URL.createObjectURL(res.data);
      setAudioUrl(url);
      
      // Auto-play the response
      const audio = new Audio(url);
      audio.play();
    } catch (err) {
      console.error("Speech synthesis failed", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 font-serif">Voice Legal Assistant</h1>
        <p className="text-slate-600">Ask your legal questions using your voice for a hands-free experience.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 flex flex-col items-center">
        {/* Interaction Circle */}
        <div className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 mb-8 ${
          isRecording ? 'bg-red-50 scale-110' : 'bg-blue-50'
        }`}>
          {isRecording && (
            <div className="absolute inset-0 rounded-full border-4 border-red-200 animate-ping" />
          )}
          
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={loading || !user}
            className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all ${
              !user ? 'bg-slate-200 text-slate-400 cursor-not-allowed' :
              isRecording ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-blue-600 text-white hover:bg-blue-700'
            } shadow-lg disabled:opacity-50`}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={32} />
            ) : isRecording ? (
              <Square size={32} />
            ) : (
              <Mic size={32} />
            )}
          </button>
        </div>

        <div className="text-center mb-8">
          {!user ? (
            <div className="flex flex-col items-center gap-4">
              <p className="text-lg font-medium text-slate-900">Authentication Required</p>
              <p className="text-sm text-slate-500 max-w-xs">Please log in to use the voice assistant and receive legal synthesis via AI.</p>
            </div>
          ) : (
            <p className="text-lg font-medium text-slate-900">
              {loading ? 'Processing your request...' : isRecording ? 'Listening... Tap to stop' : 'Tap to start speaking'}
            </p>
          )}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {/* Transcript Area */}
        {transcript && (
          <div className="w-full bg-slate-50 rounded-2xl p-6 mb-6 border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
              <MessageSquare size={14} />
              Your Question
            </div>
            <p className="text-slate-800 italic">"{transcript}"</p>
          </div>
        )}

        {/* Response Area */}
        {response && (
          <div className="w-full bg-blue-50/50 rounded-2xl p-6 border border-blue-100 animate-in slide-in-from-bottom duration-500">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider">
                <Volume2 size={14} />
                AI Response
              </div>
              {audioUrl && (
                <button 
                  onClick={() => new Audio(audioUrl).play()}
                  className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                >
                  <Play size={16} />
                </button>
              )}
            </div>
            <p className="text-slate-900 leading-relaxed font-medium">
              {response.plain_explanation}
            </p>
            
            {response.next_steps && response.next_steps.length > 0 && (
              <div className="mt-4 pt-4 border-t border-blue-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Next Steps</p>
                <ul className="space-y-1">
                  {response.next_steps.slice(0, 2).map((step, i) => (
                    <li key={i} className="text-sm text-slate-700 flex gap-2">
                      <span className="text-blue-500">•</span> {step}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
