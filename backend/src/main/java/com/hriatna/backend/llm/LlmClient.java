package com.hriatna.backend.llm;

import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Component
@Service
public class LlmClient {
    public String ask(String question) {
        if (question == null || question.trim().isEmpty()) {
            return "Please ask a valid question.";
        }

        return "Fake LLM answer for: " + question
                + ". This is a placeholder response. In a real application, you would call the LLM client to get an actual answer.";
    }
}
