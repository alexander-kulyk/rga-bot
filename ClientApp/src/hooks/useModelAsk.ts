//core
import { useState } from 'react';
import axios from 'axios';
//other
import { IAnswerModelMetadata, IModelResponse } from '../types';
import { model } from '../api';

interface Question {
  question: string;
  collectionName: string;
}

interface IModelAsk {
  handleKeyPress: (e: React.KeyboardEvent) => void;
  answerModelMetadata: IAnswerModelMetadata | null;
  handleSubmit: (e: React.FormEvent) => void;
  setQuestion: (question: string) => void;
  question: string;
  answerText: string;
  loading: boolean;
  askError: string;
}

export const useModelAsk = (selectedFileOption: string): IModelAsk => {
  const [question, setQuestion] = useState<string>('');
  const [answerText, setAnswerText] = useState<string>('');
  const [answerModelMetadata, setAnswerModelMetadata] =
    useState<IAnswerModelMetadata | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [askError, setAskError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) {
      setAskError('Please enter a question');
      return;
    }

    setLoading(true);
    setAskError('');
    setAnswerText('');

    try {
      const payload: Question = {
        question: question.trim(),
        collectionName: selectedFileOption || '',
      };

      const axiosResponse = await model.sendAsk(payload);

      const result: IModelResponse = axiosResponse.data;

      if (result.message) {
        setAnswerText(result.message);
        setAnswerModelMetadata({
          id: result.id,
          created: result.created,
          model: result.model,
          usage: result.usage,
        });
      } else if (result.error) {
        setAskError(result.error);
      } else {
        setAskError('No response received');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setAskError(
          err.response?.data?.error || err.message || 'Failed to get response'
        );
      } else {
        setAskError('An unexpected error occurred');
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
    answerModelMetadata,
    handleKeyPress,
    handleSubmit,
    setQuestion,
    answerText,
    question,
    loading,
    askError,
  };
};
