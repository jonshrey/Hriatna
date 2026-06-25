package com.hriatna.backend.service;

import org.springframework.stereotype.Service;

import com.hriatna.backend.llm.LlmClient;

@Service
public class QuestionService {

    private final LlmClient llmClient;

    public QuestionService(LlmClient llmClient) {
        this.llmClient = llmClient;
    }

    public String ask(String question) {
        if(question == null) {
            return "Please ask a valid question.";
        } else {
            String trimmedQuestion = question.trim();
            if(trimmedQuestion.length() > 1000) {
                return "Question is too long. Please limit your question to 1000 characters.";
            } else if(trimmedQuestion.length() == 1) {
                return "How can your question be of length 1 man? lol. Please ask a valid question.";
            }
            return llmClient.ask(question);
        }
    }
}