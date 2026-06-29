package com.hriatna.backend.DTO;

public record ErrorResponse(
        String status,
        String message,
        String code) {
}