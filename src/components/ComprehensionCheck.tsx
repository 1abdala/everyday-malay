import React, { useState } from 'react';
import type { ComprehensionQuestion } from '../types';
import { AudioButtons } from './AudioButtons';

type ComprehensionCheckProps = {
  questions: ComprehensionQuestion[];
  onResult: (questionId: string, correct: boolean) => void;
};

export const ComprehensionCheck: React.FC<ComprehensionCheckProps> = ({ questions, onResult }) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [complete, setComplete] = useState(false);
  const question = questions[questionIndex];
  if (!question) return <p>No comprehension questions are available yet.</p>;
  const selectedIsCorrect = selectedChoiceId === question.correctChoiceId;

  const choose = (choiceId: string) => {
    if (selectedIsCorrect) return;
    setSelectedChoiceId(choiceId);
    onResult(question.id, choiceId === question.correctChoiceId);
  };

  const advance = () => {
    if (!selectedIsCorrect) {
      setSelectedChoiceId(null);
      return;
    }
    if (questionIndex + 1 >= questions.length) {
      setComplete(true);
      return;
    }
    setQuestionIndex((index) => index + 1);
    setSelectedChoiceId(null);
  };

  if (complete) {
    return <div className="comprehension-complete" role="status"><strong>Understanding check complete</strong><p>You can continue to the key phrases, or revisit the dialogue first.</p><button type="button" className="btn-secondary" onClick={() => { setQuestionIndex(0); setSelectedChoiceId(null); setComplete(false); }}>Review questions</button></div>;
  }

  return <section className="comprehension-check" aria-labelledby="understand-question">
    <div className="comprehension-topline"><span>QUESTION {questionIndex + 1} OF {questions.length}</span>{question.reviewStatus !== 'approved' && <span>Draft question</span>}</div>
    <h3 id="understand-question">{question.prompt}</h3>
    {question.audioText && (question.audio?.normal || question.audio?.slow)
      ? <AudioButtons normalSrc={question.audio.normal} slowSrc={question.audio.slow} textToSpeak={question.audioText} />
      : <p className="comprehension-audio-unavailable" role="note">Audio is not available for this check yet. You can review the dialogue in the previous step.</p>}
    <div className="comprehension-choices" role="group" aria-label="Answer choices">
      {question.choices.map((choice) => {
        const selected = selectedChoiceId === choice.id;
        const correct = selected && selectedIsCorrect;
        return <button key={choice.id} type="button" className={`comprehension-choice ${selected ? (correct ? 'is-correct' : 'is-incorrect') : ''}`} aria-pressed={selected} onClick={() => choose(choice.id)}>{choice.text}</button>;
      })}
    </div>
    {selectedChoiceId && (selectedIsCorrect
      ? <div className="feedback-box feedback-success" role="status"><strong>That’s right.</strong><span>{question.explanation}</span></div>
      : <div className="feedback-box feedback-hint" role="status"><strong>Not quite. Take another look at the dialogue.</strong><span>Choose again when you’re ready; this check does not block the lesson.</span></div>)}
    {selectedChoiceId && <button type="button" className="btn-primary comprehension-next" onClick={advance}>{selectedIsCorrect ? (questionIndex + 1 === questions.length ? 'Finish check' : 'Next question →') : 'Try again'}</button>}
  </section>;
};
