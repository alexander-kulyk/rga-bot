//components
import { Alert, TextField, ResponseContainer, Footer } from './components';
import * as S from './styled';
//other
import { useModelAsk, useModelConfig, useUploadFile } from './hooks';
import './App.css';

function App() {
  const {
    answerModelMetadata,
    handleKeyPress,
    handleSubmit,
    setQuestion,
    answerText,
    question,
    loading,
    error,
  } = useModelAsk();

  const { uploading, handleFileUpload } = useUploadFile();
  const { isFetchModalConfigLoading, modalConfigData } = useModelConfig();

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
            loading={loading || isFetchModalConfigLoading}
            onFloatingButtonClick={handleFileUpload}
            floatingButtonDisabled={uploading || loading}
            uploading={uploading}
            settingsDisabled={isFetchModalConfigLoading}
            modalConfigData={modalConfigData}
          />
          <Footer />
        </S.StyledPaper>
      </S.ContentWrapper>
    </S.StyledContainer>
  );
}

export default App;
