import { useState } from 'react';

const Button = ({ label, onClick }) => {
  return <button onClick={onClick}>{label}</button>;
};

const Feedback = ({ feedbackSetters }) => {
  const handleClick = (label) => feedbackSetters[label]((prev) => prev + 1);

  return (
    <>
      <h1>Give Feedback</h1>
      <Button label="good" onClick={() => handleClick('good')} />
      <Button label="neutral" onClick={() => handleClick('neutral')} />
      <Button label="bad" onClick={() => handleClick('bad')} />
    </>
  );
};

const StatisticLine = ({ label, value }) => {
  return (
    <tr>
      <td><strong>{label}</strong></td>
      <td>{value}</td>
    </tr>
  );
};

const Statistics = ({ counts, all, average, positive }) => {
  return (
    all > 0
      ? <>
          <h1>Statistics</h1>
          <table border="0">
            <tbody>
              <StatisticLine label="good" value={counts.good} />
              <StatisticLine label="neutral" value={counts.neutral} />
              <StatisticLine label="bad" value={counts.bad} />
              <StatisticLine label="all" value={all} />
              <StatisticLine label="average" value={average} />
              <StatisticLine label="positive" value={`${positive} %`} />
            </tbody>
          </table>
        </>
      : <p>No feedback given</p>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const feedbackSetters = {
    good: setGood,
    neutral: setNeutral,
    bad: setBad,
  };

  const counts = { good, neutral, bad };

  const all = good + neutral + bad;

  const average =
    all > 0
      ? (good - bad) / all
      : 0;

  const positive =
    all > 0
      ? (good / all) * 100
      : 0;

  return (
    <div>
      <Feedback feedbackSetters={feedbackSetters} />
      <Statistics
        counts={counts}
        all={all}
        average={average}
        positive={positive}
      />
    </div>
  );
};

export default App;