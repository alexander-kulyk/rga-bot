//components
import { Alert, TextField, ResponseContainer, Footer } from './components';
import * as S from './styled';
//other
import { useModelAsk } from './hooks';
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
          />
          <Footer />
        </S.StyledPaper>
      </S.ContentWrapper>
    </S.StyledContainer>
  );
}

export default App;
