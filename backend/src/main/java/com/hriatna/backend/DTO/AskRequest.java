package com.hriatna.backend.dto;

import java.util.List;

public record AskRequest(
        String question,
        String mode,
        String inputType,
        List<ChatMessageRequest> messages
) {
    public record ChatMessageRequest(
            String role,
            String content
    ) {}
}