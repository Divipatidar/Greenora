package com.cdac.controller;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.cdac.dto.ProductDto;
import com.cdac.entities.Product;
import com.cdac.service.ProductService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/products")
@Validated
@CrossOrigin(" http://localhost:5173")
public class ProductContoller {
	 final ProductService productservice;
	 
	 @PostMapping(value = "/{categoryId}",consumes =MediaType.APPLICATION_OCTET_STREAM_VALUE)
	 public ResponseEntity<?> addProduct(@PathVariable Long categoryId,@RequestPart("dto")  @Valid ProductDto dto,@RequestPart("image") MultipartFile image) throws IOException{
		 Product product = productservice.addProduct(categoryId, dto,image);
		 return ResponseEntity.status(HttpStatus.CREATED).body(product);
	 }
     
	 
	 @PutMapping(value="/{productId}" )
	 public ResponseEntity<?> updateProduct(@PathVariable Long productId,@RequestBody  @Valid ProductDto dto,@RequestPart MultipartFile image) throws IOException{
		 Product product = productservice.updateProduct(productId, dto,image);
		 return ResponseEntity.ok(product);
		 
	 }
	 @GetMapping("/{productId}")
	 public ResponseEntity<?> getProduct(@PathVariable Long productId){
		   Product product = productservice.getProductById(productId);
		   return ResponseEntity.ok(product);
	 }
	 @GetMapping
	 public ResponseEntity<?>  getAllProduct(){
		 return ResponseEntity.ok(productservice.getAllProducts());
	 }
	 @GetMapping("/category/{categoryId}")
	 public ResponseEntity<?> getAllProductBycategory(@PathVariable Long categoryId){
		 return ResponseEntity.ok(productservice.getProductsByCategoryId(categoryId));
	 }
	 
	 @GetMapping("/name/{productName}")
	 public ResponseEntity<?>  searchByName(@PathVariable String productName ){
		 return ResponseEntity.ok(productservice.searchProducts(productName));
	 }
	 
	 @DeleteMapping("/{productId}")
	 public ResponseEntity<?>  deleteProduct(@PathVariable Long productId){
		 return ResponseEntity.ok(productservice.deleteProduct(productId));
	 }
}
