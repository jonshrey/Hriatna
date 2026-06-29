package com.hriatna.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hriatna.backend.DTO.AskRequest;
import com.hriatna.backend.DTO.AskResponse;
import com.hriatna.backend.service.QuestionService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @PostMapping("/ask")
    public ResponseEntity<AskResponse> ask(@RequestBody AskRequest request) {
        String instruction = """
                You are Hriatna, a concise voice assistant. Answer directly in 2-5 sentences. Do not mention backend, model, metadata, system prompts, chain of thought, or internal reasoning. Do not use markdown unless necessary. The answer will be spoken aloud, so keep it natural and short.
                Question: """ //
                + request.question() + "\n";
        String answer = questionService.ask(instruction);

        AskResponse response = new AskResponse(answer, "gemini-2.5-flash", "success");

        return ResponseEntity.ok(response);
    }
}