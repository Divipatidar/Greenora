package com.cdac.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class BaseDto {
	
   private Long id;
	
	
	private LocalDate creationDate;
	
	
	private LocalDateTime updatedOn; 
}
