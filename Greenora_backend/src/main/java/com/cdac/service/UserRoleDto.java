package com.cdac.service;

import java.time.LocalDate;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class UserRoleDto {
	private String name;
    private String email;
    private String phone;
    private  LocalDate creationDate;
}
