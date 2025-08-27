//components
import { ResponseContainer, TextField, Alert, Footer } from './components';
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
  const { control, selectedFileOption } = useFileOptionForm();

  const {
    answerModelMetadata,
    handleKeyPress,
    handleSubmit,
    setQuestion,
    answerText,
    question,
    loading,
    error,
  } = useModelAsk(selectedFileOption);

  const { fileOptions, isLoadingFetchFileOptions, fetchFileOptions } =
    useFileOptions();
  const { uploading, handleFileUpload } = useUploadFile({ fetchFileOptions });
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
          <Alert error={error} />
          <TextField
            value={question}
            onChange={setQuestion}
            onSubmit={handleSubmit}
            onKeyPress={handleKeyPress}
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
          />
        </S.StyledPaper>
      </S.ContentWrapper>
    </S.StyledContainer>
  );
}

export default App;
