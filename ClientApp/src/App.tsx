//components
import { Alert, TextField, ResponseContainer, Footer } from './components';
import * as S from './styled';
//other
import { useModelAsk, useUploadFile } from './hooks';
import './App.css';

// Styled components

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
            loading={loading}
            onFloatingButtonClick={handleFileUpload}
            floatingButtonDisabled={uploading || loading}
            uploading={uploading}
          />
          <Footer />
        </S.StyledPaper>
      </S.ContentWrapper>
    </S.StyledContainer>
  );
}

export default App;
