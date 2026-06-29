package com.hriatna.backend.DTO;

public record AskResponse(
        String answer,
        String model,
        String status,
        long latencyMs
) {
}