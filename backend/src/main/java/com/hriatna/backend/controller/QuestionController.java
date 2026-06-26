package com.hriatna.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<AskResponse> ask(@RequestBody String question) {
        String answer = questionService.ask(question);

        AskResponse response = new AskResponse(answer, "gemini-2.5-flash", "success");

        return ResponseEntity.ok(response);
    }
}