//core
import { useState, useEffect } from 'react';
import axios from 'axios';
//other
import { modelConfigs } from '../api/modalConfigs';
import { IModelConfigs } from '../types';

interface IUseModelConfig {
  updateModalConfig: (modalConfigData: IModelConfigs) => Promise<void>;
  modalConfigData: IModelConfigs | null;
  fetchModalConfig: () => Promise<void>;
  isFetchModalConfigLoading: boolean;
  error: string | null;
}

export const useModelConfig = (): IUseModelConfig => {
  const [modalConfigData, setModalConfigData] = useState<IModelConfigs | null>(
    null
  );
  const [isFetchModalConfigLoading, setIsFetchModalConfigLoading] =
    useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchModalConfig = async () => {
    setIsFetchModalConfigLoading(true);
    setError(null);

    try {
      const response = await modelConfigs.get();
      setModalConfigData(response.data.configs[0]);
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : 'An unexpected error occurred'
      );
    } finally {
      setIsFetchModalConfigLoading(false);
    }
  };

  const updateModalConfig = async (modalConfigData: IModelConfigs) => {
    setIsFetchModalConfigLoading(true);
    setError(null);

    try {
      await modelConfigs.update(modalConfigData);
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : 'An unexpected error occurred'
      );
    } finally {
      setIsFetchModalConfigLoading(false);
    }
  };

  useEffect(() => {
    fetchModalConfig();
  }, []);

  return {
    isFetchModalConfigLoading,
    updateModalConfig,
    fetchModalConfig,
    modalConfigData,
    error,
  };
};
