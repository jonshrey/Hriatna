package com.hriatna.backend.dto;

public record ErrorResponse(
        String status,
        String message,
        String code) {
}