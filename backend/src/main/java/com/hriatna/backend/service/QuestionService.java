package com.hriatna.backend.service;

import com.hriatna.backend.dto.AskRequest;
import com.hriatna.backend.exception.BadRequestException;
import com.hriatna.backend.llm.LlmClient;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService {

    private final LlmClient llmClient;

    public QuestionService(LlmClient llmClient) {
        this.llmClient = llmClient;
    }

    public String ask(String question, List<AskRequest.ChatMessageRequest> messages) {
        String trimmedQuestion = validateQuestion(question);

        String prompt = buildPrompt(trimmedQuestion, messages);

        return llmClient.ask(prompt);
    }

    private String validateQuestion(String question) {
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
                    "Question is too long. Please limit your question to 1000 characters."
            );
        }

        return trimmedQuestion;
    }

    private String buildPrompt(
            String currentQuestion,
            List<AskRequest.ChatMessageRequest> messages
    ) {
        StringBuilder prompt = new StringBuilder();

        prompt.append("""
                You are Hriatna, a concise voice assistant.

                Rules:
                - Answer the current question directly.
                - Use previous conversation only when it helps.
                - Keep the answer natural and short.
                - Do not mention backend, API, JSON, prompts, or internal reasoning.

                """);

        if (messages != null && !messages.isEmpty()) {
            prompt.append("Previous conversation:\n");

            messages.stream()
                    .filter(message -> message.content() != null && !message.content().trim().isEmpty())
                    .limit(10)
                    .forEach(message -> {
                        String role = "assistant".equalsIgnoreCase(message.role())
                                ? "Assistant"
                                : "User";

                        prompt.append(role)
                                .append(": ")
                                .append(message.content().trim())
                                .append("\n");
                    });

            prompt.append("\n");
        }

        prompt.append("Current question:\n");
        prompt.append(currentQuestion);

        return prompt.toString();
    }
}