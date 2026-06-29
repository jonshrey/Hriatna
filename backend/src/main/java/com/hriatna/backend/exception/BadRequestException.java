package com.hriatna.backend.exception;

public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(
            message == null || message.trim().isEmpty()
                ? "Invalid request."
                : message
        );
    }
}