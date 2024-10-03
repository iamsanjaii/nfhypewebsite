import React, { createContext, useContext, useState } from 'react';

// Create the context
const AnswersContext = createContext();

// Create a custom hook to use the context
export const useAnswers = () => {
    return useContext(AnswersContext);
};

// Create the provider component
export const AnswersProvider = ({ children }) => {
    const [answers, setAnswers] = useState([]);

    return (
        <AnswersContext.Provider value={{ answers, setAnswers }}>
            {children}
        </AnswersContext.Provider>
    );
};