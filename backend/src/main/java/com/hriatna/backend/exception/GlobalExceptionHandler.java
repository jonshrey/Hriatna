package com.hriatna.backend.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.hriatna.backend.DTO.ErrorResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorResponse> handleBadRequest(BadRequestException exception) {
        ErrorResponse response = new ErrorResponse(
                "error",
                exception.getMessage(),
                "BAD_REQUEST");

        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(LlmException.class)
    public ResponseEntity<ErrorResponse> handleLLMException(LlmException exception) {
        ErrorResponse response = new ErrorResponse(
                "error",
                exception.getMessage(),
                "LLM_ERROR");

        return ResponseEntity.status(502).body(response);
    }
}