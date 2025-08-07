package com.cdac.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.dto.EmailRedDto;
import com.cdac.service.EmailService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/email")
@AllArgsConstructor
public class EmailController {
     private final EmailService services;
     
     @PostMapping("/send")
     public ResponseEntity<?> sendEmail(@RequestBody EmailRedDto dto) {
         services.sendEmail(dto.getTo(),dto.getSubject(),dto.getBody());
         return ResponseEntity.ok("Email sent successfully");
     }
}
