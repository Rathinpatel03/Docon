import React, { useState } from 'react';

const symptomSuggestions = {
  fever: "You might have a common viral infection. Stay hydrated and rest. Seek care if fever persists.",
  headache: "It could be due to stress, migraine, or dehydration. Monitor frequency and intensity.",
  cough: "Dry or wet? Could be related to allergies or respiratory infection. Monitor symptoms.",
  chestpain: "Seek immediate medical attention. It could be a sign of cardiac issues.",
  nausea: "Possible causes include indigestion, pregnancy, or food poisoning.",
  tiredness: "Fatigue can result from stress, anemia, or lack of sleep. Monitor over days."
};

const SymptomChecker = () => {
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleCheck = () => {
    const cleaned = input.toLowerCase().replace(/\s+/g, '');
    const match = Object.keys(symptomSuggestions).find(key => cleaned.includes(key));
    if (match) {
      setFeedback(symptomSuggestions[match]);
    } else {
      setFeedback("This symptom is not recognized. Please consult your doctor for proper assessment.");
    }
  };

  return (
    <div className="card card-info mt-4">
      
      <div className="card-body">
        <p>Enter a symptom to get a preliminary health suggestion:</p>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="e.g. fever, headache, cough"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="input-group-append">
            <button className="btn btn-info" onClick={handleCheck}>Check</button>
          </div>
        </div>
        {feedback && (
          <div className="alert alert-secondary">
            <strong>Suggestion:</strong> {feedback}
          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomChecker;