package com.hriatna.backend.DTO;

public record AskRequest(
        String question,
        String mode,
        String inputType) {
}