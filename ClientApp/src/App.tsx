//components
import { ResponseContainer, TextField, Alert, Footer } from './components';
import { useState } from 'react';
import * as S from './styled';
//other
import {
  useFileOptionForm,
  useFileOptions,
  useModelConfig,
  useUploadFile,
  useModelAsk,
} from './hooks';
import './App.css';

function App() {
  const [isTextFieldFocused, setIsTextFieldFocused] = useState<boolean>(false);

  const { control, selectedFileOption } = useFileOptionForm();
  const {
    answerModelMetadata,
    handleKeyPress,
    handleSubmit,
    setQuestion,
    answerText,
    question,
    askError,
    loading,
  } = useModelAsk(selectedFileOption);

  const {
    isLoadingFetchFileOptions,
    fetchFileOptions,
    fileOptionsError,
    fileOptions,
  } = useFileOptions();

  const { uploading, handleFileUpload, uploadError } = useUploadFile({
    fetchFileOptions,
  });

  const { isFetchModalConfigLoading, modalConfigData, updateModalConfig } =
    useModelConfig();

  return (
    <S.StyledContainer>
      <S.ContentWrapper>
        <S.StyledPaper elevation={3}>
          <ResponseContainer
            answerText={answerText}
            answerModelMetadata={answerModelMetadata}
          />
          <Alert error={askError || uploadError || fileOptionsError} />
          <TextField
            value={question}
            onChange={setQuestion}
            onSubmit={handleSubmit}
            onKeyPress={handleKeyPress}
            onFocusChange={setIsTextFieldFocused}
            loading={
              loading || isFetchModalConfigLoading || isLoadingFetchFileOptions
            }
            onFloatingButtonClick={handleFileUpload}
            floatingButtonDisabled={uploading || loading}
            uploading={uploading}
            settingsDisabled={isFetchModalConfigLoading}
            modalConfigData={modalConfigData}
            updateModalConfig={updateModalConfig}
          />
          <Footer
            fileOptions={fileOptions}
            control={control}
            name={'fileName'}
            isTextFieldFocused={isTextFieldFocused}
            selectedValue={selectedFileOption}
          />
        </S.StyledPaper>
      </S.ContentWrapper>
    </S.StyledContainer>
  );
}

export default App;
