package com.cdac.controller;

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

import com.cdac.dto.AddressDto;
import com.cdac.entities.Address;
import com.cdac.service.AddressService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/address")
@Validated
@CrossOrigin(" http://localhost:5173")

public class AddressController {
      private  AddressService addresservice;
      
      
      @PostMapping("/{userId}")
      public ResponseEntity<?> addAddress(@PathVariable Long userId,
    		  @RequestBody @Valid AddressDto dto){
    	  Address address = addresservice.addAddress(userId,dto);
    	  System.out.println("in add address"+dto);
    	  return ResponseEntity.status(HttpStatus.CREATED).body(address);
      }
      
      
      @PutMapping("/{addressId}")
      public ResponseEntity<?> updateAddress(@PathVariable Long addressId,
    		  @RequestBody @Valid AddressDto dto ){
    	  System.out.println("in update address"+dto);

    	  Address address = addresservice.updateAddress(addressId, dto);
    	  return ResponseEntity.ok(address);
      }
      
      @DeleteMapping("/{addressId}")
      public ResponseEntity<?> deleteAddress(@PathVariable Long addressId){
    	  System.out.println("in delete address");
          return ResponseEntity.ok(addresservice.deleteAddress(addressId));
    	  
      }
      
      @GetMapping("/{Id}")
      public ResponseEntity<?>  getById(@PathVariable Long Id){
    	  return ResponseEntity.ok(addresservice.getById(Id));
      }
      
      
}
