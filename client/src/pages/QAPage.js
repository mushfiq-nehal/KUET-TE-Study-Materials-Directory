import React, { useState, useEffect } from 'react';
import '../styles/QA.css';
import { apiUrl } from '../services/api';

const QAPage = () => {
  const [questions, setQuestions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [questionImage, setQuestionImage] = useState('');
  const [answerInputs, setAnswerInputs] = useState({});
  const [answerImageInputs, setAnswerImageInputs] = useState({});

  const readFileAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleQuestionImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setQuestionImage('');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Please choose an image smaller than 2MB.');
      e.target.value = '';
      return;
    }

    const dataUrl = await readFileAsDataUrl(file);
    setQuestionImage(dataUrl);
  };

  const handleAnswerImageChange = async (questionId, file) => {
    if (!file) {
      setAnswerImageInputs((prev) => ({ ...prev, [questionId]: '' }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Please choose an image smaller than 2MB.');
      return;
    }

    const dataUrl = await readFileAsDataUrl(file);
    setAnswerImageInputs((prev) => ({ ...prev, [questionId]: dataUrl }));
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(apiUrl('/api/qa'));
      const data = await response.json();
      setQuestions(data);
    } catch (err) {
      console.error('Error fetching questions:', err);
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(apiUrl('/api/qa'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ title, content, image: questionImage })
      });
      const newQuestion = await response.json();
      setQuestions([newQuestion, ...questions]);
      setTitle('');
      setContent('');
      setQuestionImage('');
      setShowForm(false);
    } catch (err) {
      console.error('Error asking question:', err);
    }
  };

  const handleAnswer = async (questionId, answer) => {
    if (!answer?.trim()) return;

    try {
      const response = await fetch(apiUrl(`/api/qa/${questionId}/answer`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content: answer, image: answerImageInputs[questionId] || '' })
      });
      const updated = await response.json();
      setQuestions(questions.map(q => q._id === questionId ? updated : q));
      setAnswerInputs((prev) => ({ ...prev, [questionId]: '' }));
      setAnswerImageInputs((prev) => ({ ...prev, [questionId]: '' }));
    } catch (err) {
      console.error('Error answering question:', err);
    }
  };

  return (
    <div className="qa-container">
      <header className="qa-header">
        <h1>❓ Q&A Forum</h1>
        <button className="ask-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Ask a Question'}
        </button>
      </header>

      {showForm && (
        <form onSubmit={handleAskQuestion} className="ask-form">
          <input
            type="text"
            placeholder="Question title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Describe your question..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <input type="file" accept="image/*" onChange={handleQuestionImageChange} />
          {questionImage && (
            <img src={questionImage} alt="Question upload preview" className="qa-image-preview" />
          )}
          <button type="submit">Post Question</button>
        </form>
      )}

      <div className="questions-list">
        {questions.map((question) => (
          <div key={question._id} className="question-item">
            <h3>{question.title}</h3>
            <p>{question.content}</p>
            {question.image && (
              <img src={question.image} alt="Question attachment" className="qa-image" />
            )}
            <small>Asked by {question.askedBy?.name}</small>

            <div className="answers-section">
              {question.answers && question.answers.map((answer) => (
                <div key={answer._id} className="answer-item">
                  <p>{answer.content}</p>
                  {answer.image && (
                    <img src={answer.image} alt="Answer attachment" className="qa-image" />
                  )}
                  <small>By {answer.answeredBy?.name}</small>
                </div>
              ))}

              <form
                className="answer-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAnswer(question._id, answerInputs[question._id] || '');
                }}
              >
                <input
                  type="text"
                  placeholder="Write your answer..."
                  value={answerInputs[question._id] || ''}
                  onChange={(e) =>
                    setAnswerInputs((prev) => ({
                      ...prev,
                      [question._id]: e.target.value,
                    }))
                  }
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleAnswerImageChange(question._id, e.target.files?.[0])}
                />
                <button type="submit">Answer</button>
              </form>
              {answerImageInputs[question._id] && (
                <img
                  src={answerImageInputs[question._id]}
                  alt="Answer upload preview"
                  className="qa-image-preview"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QAPage;
