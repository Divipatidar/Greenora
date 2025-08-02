package com.cdac.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class AddressDto  {
    @NotBlank(message = "Street is required")
	private String street;
    @NotBlank(message = "City is required")

	private String city;
    @NotBlank(message = "State is required")

	private String state;
    @NotBlank(message = "Country is required")

	private String country;
    @NotBlank(message = "Pincode is required")
    @Pattern(regexp = "^[0-9]{6}$", message = "Pincode must be a 6-digit number")
	private String pincode;
}
