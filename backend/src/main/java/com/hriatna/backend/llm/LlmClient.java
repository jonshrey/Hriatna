package com.hriatna.backend.llm;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class LlmClient {

    private final String apiKey;
    private final String model;
    private final RestClient restClient;

    public LlmClient(
            @Value("${gemini.api-key}") String apiKey,
            @Value("${gemini.model}") String model
    ) {
        this.apiKey = apiKey;
        this.model = model;
        this.restClient = RestClient.create("https://generativelanguage.googleapis.com");
    }

    public String ask(String question) {
        if (question == null || question.trim().isEmpty()) {
            return "Please ask a valid question.";
        }

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of(
                                "parts", List.of(
                                        Map.of("text", question)
                                )
                        )
                )
        );

        Map response = restClient.post()
                .uri("/v1beta/models/{model}:generateContent", model)
                .header("x-goog-api-key", apiKey)
                .header("Content-Type", "application/json")
                .body(requestBody)
                .retrieve()
                .body(Map.class);

        return extractText(response);
    }

    private String extractText(Map response) {
        if (response == null) {
            return "No response from Gemini.";
        }

        List candidates = (List) response.get("candidates");

        if (candidates == null || candidates.isEmpty()) {
            return "Gemini returned no answer.";
        }

        Map firstCandidate = (Map) candidates.get(0);
        Map content = (Map) firstCandidate.get("content");
        List parts = (List) content.get("parts");

        if (parts == null || parts.isEmpty()) {
            return "Gemini returned an empty answer.";
        }

        Map firstPart = (Map) parts.get(0);
        Object text = firstPart.get("text");

        return text != null ? text.toString() : "Gemini returned no text.";
    }
}