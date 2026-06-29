package com.hriatna.backend.llm;

import com.hriatna.backend.exception.LlmException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Component
public class LlmClient {

    private final String apiKey;
    private final String model;
    private final RestClient restClient;

    public LlmClient(
            @Value("${gemini.api-key}") String apiKey,
            @Value("${gemini.model}") String model) {
        this.apiKey = apiKey;
        this.model = model;
        this.restClient = RestClient.create("https://generativelanguage.googleapis.com");
    }

    public String ask(String question) {
        try {
            if (question == null || question.trim().isEmpty()) {
                throw new LlmException("Question was empty before Gemini call.");
            }

            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(
                            Map.of(
                                    "parts", List.of(
                                            Map.of("text", question)))));

            Map<String, Object> response = restClient.post()
                    .uri("/v1beta/models/{model}:generateContent", model)
                    .header("x-goog-api-key", apiKey)
                    .header("Content-Type", "application/json")
                    .body(requestBody)
                    .retrieve()
                    .body(new ParameterizedTypeReference<Map<String, Object>>() {
                    });

            return extractText(response);

        } catch (LlmException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new LlmException("Failed to call Gemini.", exception);
        }
    }

    private String extractText(Map<String, Object> response) {
        if (response == null) {
            throw new LlmException("Gemini returned no response.");
        }

        List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");

        if (candidates == null || candidates.isEmpty()) {
            throw new LlmException("Gemini returned no candidates.");
        }

        Map<String, Object> firstCandidate = candidates.get(0);
        Map<String, Object> content = (Map<String, Object>) firstCandidate.get("content");

        if (content == null) {
            throw new LlmException("Gemini returned no content.");
        }

        List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");

        if (parts == null || parts.isEmpty()) {
            throw new LlmException("Gemini returned no parts.");
        }

        Object text = parts.get(0).get("text");

        if (text == null || text.toString().trim().isEmpty()) {
            throw new LlmException("Gemini returned empty text.");
        }

        return text.toString();
    }
}