package com.cdac.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.dto.CategoryDto;
import com.cdac.entities.Category;
import com.cdac.service.CategoryService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/categories")
@Validated
@CrossOrigin(" http://localhost:5173")

public class CategoryContoller {
   private final CategoryService categoryservices;
   
   
   @PostMapping
   public ResponseEntity<?> addCategory(@RequestBody  @Valid CategoryDto dto){
	   Category category = categoryservices.addCategory(dto);
	   return ResponseEntity.
			   status(HttpStatus.CREATED).body(category);
   }
   @GetMapping
   public ResponseEntity<?>  getAllCategory(){
	   List<Category> list = categoryservices.getAllCategories();
	   if(list.isEmpty()) {
		   return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	   }
	   return ResponseEntity.ok(list);
   }
   
   @PutMapping("/{categoryId}")
   public ResponseEntity<?> updateCategory(@PathVariable Long categoryId, @RequestBody   @Valid CategoryDto dto){
	    Category category = categoryservices.updateCategory(categoryId, dto);
		   return ResponseEntity.ok(category);

   }
   
   @DeleteMapping("/{categoryId}")
   public ResponseEntity<?>  deleteCategory(@PathVariable Long categoryId){
	   return ResponseEntity.ok(categoryservices.deleteCategory(categoryId));
   }
		  
}
