package com.hriatna.backend.dto;

public record AskResponse(
        String answer,
        String model,
        String status,
        long latencyMs
) {
}