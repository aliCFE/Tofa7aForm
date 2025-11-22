import React, { useState } from 'react';
import './GoogleForm.css';

const GoogleForm = () => {
  const [form, setForm] = useState({
    title: 'Untitled form',
    description: 'Form description',
    questions: []
  });

  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      text: '',
      type: 'short-answer',
      options: ['Option 1'],
      required: false
    };
    setForm(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const updateQuestion = (id, field, value) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === id ? { ...q, [field]: value } : q
      )
    }));
  };

  const addOption = (questionId) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId
          ? { ...q, options: [...q.options, `Option ${q.options.length + 1}`] }
          : q
      )
    }));
  };

  const updateOption = (questionId, optionIndex, value) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, idx) =>
                idx === optionIndex ? value : opt
              )
            }
          : q
      )
    }));
  };

  const deleteOption = (questionId, optionIndex) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId
          ? { ...q, options: q.options.filter((_, idx) => idx !== optionIndex) }
          : q
      )
    }));
  };

  const deleteQuestion = (id) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id)
    }));
  };

  return (
    <div className="google-form">
      <div className="form-header">
        <div className="form-title-container">
          {editingTitle ? (
            <input
              className="form-title-input"
              value={form.title}
              onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
              onBlur={() => setEditingTitle(false)}
              onKeyDown={(e) => e.key === 'Enter' && setEditingTitle(false)}
              autoFocus
            />
          ) : (
            <h1 
              className="form-title"
              onClick={() => setEditingTitle(true)}
            >
              {form.title}
            </h1>
          )}
        </div>

        <div className="form-description-container">
          {editingDescription ? (
            <input
              className="form-description-input"
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              onBlur={() => setEditingDescription(false)}
              onKeyDown={(e) => e.key === 'Enter' && setEditingDescription(false)}
              autoFocus
              placeholder="Form description"
            />
          ) : (
            <p 
              className="form-description"
              onClick={() => setEditingDescription(true)}
            >
              {form.description || 'Form description'}
            </p>
          )}
        </div>
      </div>

      <div className="questions-container">
        {form.questions.map((question, index) => (
          <Question
            key={question.id}
            question={question}
            index={index}
            onUpdate={updateQuestion}
            onAddOption={addOption}
            onUpdateOption={updateOption}
            onDelete={deleteQuestion}
            onDeleteOption={deleteOption}
          />
        ))}
      </div>

      <div className="add-question-container">
        <button className="add-question-btn" onClick={addQuestion}>
          <span className="plus-icon">+</span>
          Add question
        </button>
      </div>
    </div>
  );
};

const Question = ({ question, index, onUpdate, onAddOption, onUpdateOption, onDelete, onDeleteOption }) => {
  const [editingQuestion, setEditingQuestion] = useState(false);
  const [phoneValue, setPhoneValue] = useState(question.answer || '');
  const [phoneError, setPhoneError] = useState('');

  const handleQuestionTextChange = (e) => {
    onUpdate(question.id, 'text', e.target.value);
  };

  const handleTypeChange = (e) => {
    onUpdate(question.id, 'type', e.target.value);
  };

  const handleRequiredChange = (e) => {
    onUpdate(question.id, 'required', e.target.checked);
  };

  return (
    <div className="question-card">
      <div className="question-header">
        <div className="question-input-container">
          {editingQuestion ? (
            <input
              className="question-input"
              value={question.text}
              onChange={handleQuestionTextChange}
              onBlur={() => setEditingQuestion(false)}
              onKeyDown={(e) => e.key === 'Enter' && setEditingQuestion(false)}
              placeholder="Question"
              autoFocus
            />
          ) : (
            <span 
              className="question-text"
              onClick={() => setEditingQuestion(true)}
            >
              {question.text || 'Question'}
            </span>
          )}
        </div>
        
        <select 
          className="question-type-select"
          value={question.type}
          onChange={handleTypeChange}
        >
          <option value="short-answer">Short answer</option>
          <option value="paragraph">Paragraph</option>
          <option value="numbers">Numbers</option>
          <option value="email">Email</option>
          <option value="phone-number">Phone Number</option>
          <option value="multiple-choice">Multiple choice</option>
          <option value="checkbox">Checkboxes</option>
          <option value="dropdown">Dropdown</option>
        </select>
      </div>

      <div className="question-body">
        {question.type === 'short-answer' && (
          <input 
            className="short-answer-input"
            type="text"
            placeholder="Short answer text"
            disabled
          />
        )}

        {question.type === 'numbers' && (
          <input 
            className="short-answer-input"
            type="numbers"
            placeholder="Number answer"
            disabled
          />
        )}

        {question.type === 'paragraph' && (
          <textarea
            className="paragraph-input"
            placeholder="Long answer text"
            disabled
            rows={3}
          />
        )}

        {question.type === 'email' && (
          <input 
            className="short-answer-input"
            type="email"
            placeholder="Email address"
            disabled
          />
        )}

        {question.type === 'phone-number' && (
          <div className="phone-input-wrapper">
            <input
              className={`short-answer-input ${phoneError ? 'invalid' : ''}`}
              type="text"
              inputMode="numeric"
              placeholder="Phone number"
              value={phoneValue}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '');
                setPhoneValue(digits);
                const validRe = /^(?:(?:077|078|079|075)\d{8})$/;
                if (/*digits.length === 11 &&*/ validRe.test(digits)) {
                  setPhoneError('');
                } else {
                  setPhoneError('Phone must be 11 digits and must be Iraqi number');
                }
                onUpdate(question.id, 'answer', digits);
              }}
            />
            {phoneError && <div className="validation-error">{phoneError}</div>}
          </div>
        )}

        {(question.type === 'multiple-choice' || question.type === 'checkbox' || question.type === 'dropdown') && (
          <div className="options-container">
            {question.options.map((option, optIndex) => (
              <div key={optIndex} className="option-row">
                {question.type === 'multiple-choice' && (
                  <div className="radio-option">
                    <span className="radio-circle"></span>
                    <input
                      className="option-input"
                      value={option}
                      onChange={(e) => onUpdateOption(question.id, optIndex, e.target.value)}
                      placeholder={`Option ${optIndex + 1}`}
                    />
                    <button
                      className="delete-option-btn"
                      onClick={() => onDeleteOption && onDeleteOption(question.id, optIndex)}
                      aria-label={`Delete option ${optIndex + 1}`}
                    >
                      ×
                    </button>
                  </div>
                )}
                
                {question.type === 'checkbox' && (
                  <div className="checkbox-option">
                    <span className="checkbox-square"></span>
                    <input
                      className="option-input"
                      value={option}
                      onChange={(e) => onUpdateOption(question.id, optIndex, e.target.value)}
                      placeholder={`Option ${optIndex + 1}`}
                    />
                    <button
                      className="delete-option-btn"
                      onClick={() => onDeleteOption && onDeleteOption(question.id, optIndex)}
                      aria-label={`Delete option ${optIndex + 1}`}
                    >
                      ×
                    </button>
                  </div>
                )}

                {question.type === 'dropdown' && (
                  <div className="dropdown-option">
                    <span className="option-number">{optIndex + 1}.</span>
                    <input
                      className="option-input"
                      value={option}
                      onChange={(e) => onUpdateOption(question.id, optIndex, e.target.value)}
                      placeholder={`Option ${optIndex + 1}`}
                    />
                    <button
                      className="delete-option-btn"
                      onClick={() => onDeleteOption && onDeleteOption(question.id, optIndex)}
                      aria-label={`Delete option ${optIndex + 1}`}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            <button 
              className="add-option-btn"
              onClick={() => onAddOption(question.id)}
            >
              Add option
            </button>
          </div>
        )}
      </div>

      <div className="question-footer">
        <label className="required-checkbox">
          <input
            type="checkbox"
            checked={question.required}
            onChange={handleRequiredChange}
          />
          Required
        </label>
        
        <button 
          className="delete-question-btn"
          onClick={() => onDelete(question.id)}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default GoogleForm;