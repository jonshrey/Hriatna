package com.hriatna.backend.service;

import org.springframework.stereotype.Service;

import com.hriatna.backend.exception.BadRequestException;
import com.hriatna.backend.llm.LlmClient;

@Service
public class QuestionService {

    private final LlmClient llmClient;

    public QuestionService(LlmClient llmClient) {
        this.llmClient = llmClient;
    }

    public String ask(String question) {
        if (question == null) {
            throw new BadRequestException("Question cannot be empty.");
        }

        String trimmedQuestion = question.trim();

        if (trimmedQuestion.isEmpty()) {
            throw new BadRequestException("Question cannot be empty.");
        }

        if (trimmedQuestion.length() < 2) {
            throw new BadRequestException("Please ask a more complete question.");
        }

        if (trimmedQuestion.length() > 1000) {
            throw new BadRequestException(
                    "Question is too long. Please limit your question to 1000 characters.");
        }

        return llmClient.ask(trimmedQuestion);
    }
}