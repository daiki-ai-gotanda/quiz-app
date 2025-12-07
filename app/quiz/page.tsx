'use client';
import { useEffect, useState } from 'react';

type Question = {
  question: string;
  choices: string[];
  answer: string;
};

type History = {
  date: string;
  score: number;
  total: number;
};

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [history, setHistory] = useState<History[]>([]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];

    fetch('/api/news')
      .then(res => res.json())
      .then(async (articles) => {
        const quizData: Question[] = [];
        for (const article of articles.slice(0, 5)) {
          const res = await fetch('/api/ai-summary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: article.content })
          });
          const q = await res.json();
          quizData.push(q);
        }
        setQuestions(quizData);
      });

    const saved = localStorage.getItem('quizHistory');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleAnswer = (choice: string) => {
    setSelected(choice);
    if (choice === questions[currentIndex].answer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    setSelected(null);
    setCurrentIndex(prev => prev + 1);
  };

  const finishQuiz = () => {
    const today = new Date().toISOString().split('T')[0];
    const newHistory = [...history, { date: today, score, total: questions.length }];
    setHistory(newHistory);
    localStorage.setItem('quizHistory', JSON.stringify(newHistory));
  };

  if (questions.length === 0) return <p>ニュースを読み込み中...</p>;

  const q = questions[currentIndex];

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">ニュース理解クイズ</h1>
      <p className="mb-6">正解数: {score} / {questions.length}</p>

      <div className="mb-6">
        <h2 className="text-lg font-bold">{q.question}</h2>
        <div className="flex flex-wrap">
          {q.choices.map((c) => (
            <button
              key={c}
              onClick={() => handleAnswer(c)}
              disabled={!!selected}
              className={`px-3 py-1 rounded border mt-2 mr-2 ${
                selected
                  ? c === q.answer
                    ? 'bg-green-200'
                    : c === selected
                    ? 'bg-red-200'
                    : 'bg-gray-100'
                  : 'bg-white hover:bg-blue-100'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        {selected && (
          <p className="mt-2 text-sm">
            {selected === q.answer ? '✅ 正解！' : `❌ 不正解。正解は ${q.answer}`}
          </p>
        )}
      </div>

      {selected && currentIndex < questions.length - 1 && (
        <button
          onClick={nextQuestion}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          次の問題へ
        </button>
      )}

      {currentIndex === questions.length - 1 && selected && (
        <div className="mt-4">
          <p className="text-lg font-bold">🎉 クイズ終了！最終スコア: {score} / {questions.length}</p>
          <button
            onClick={finishQuiz}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
          >
            履歴に保存
          </button>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-bold">過去のスコア履歴</h2>
        <ul>
          {history.map((h, i) => (
            <li key={i}>
              {h.date}: {h.score} / {h.total}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
