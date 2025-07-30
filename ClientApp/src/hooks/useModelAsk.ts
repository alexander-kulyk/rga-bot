//core
import { useState } from 'react';
import axios from 'axios';
//other
import { IAskResponse } from '../types';
import { model } from '../api';

interface Question {
  question: string;
}

interface IModelAsk {
  handleKeyPress: (e: React.KeyboardEvent) => void;
  handleSubmit: (e: React.FormEvent) => void;
  setQuestion: (question: string) => void;
  question: string;
  response: string;
  loading: boolean;
  error: string;
}

export const useModelAsk = (): IModelAsk => {
  const [question, setQuestion] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    setLoading(true);
    setError('');
    setResponse('');

    try {
      const payload: Question = { question: question.trim() };

      const axiosResponse = await model.sendAsk(payload);

      const result: IAskResponse = axiosResponse.data;

      if (result.answer) {
        setResponse(result.answer);
      } else if (result.error) {
        setError(result.error);
      } else {
        setError('No response received');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error || err.message || 'Failed to get response'
        );
      } else {
        setError('An unexpected error occurred');
      }
      console.error('Error asking question:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return {
    handleKeyPress,
    handleSubmit,
    setQuestion,
    question,
    response,
    loading,
    error,
  };
};
