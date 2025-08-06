package com.cdac.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.cdac.custom_exception.InvalidInputException;
import com.cdac.custom_exception.ResourseNotFoundException;
import com.cdac.dao.CategoryDao;
import com.cdac.dto.ApiResponse;
import com.cdac.dto.CategoryDto;
import com.cdac.entities.Category;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;


@Service
@Transactional
@AllArgsConstructor
public class CategoryServiceImpl implements CategoryService {


	
	private final ModelMapper modalmapper;
    private final CategoryDao categorydao;

    
	
	@Override
	public Category addCategory(CategoryDto dto) {
		  if(categorydao.existsByName(dto.getName())) {
			  throw new InvalidInputException("duplicate category name!!");
		  }
		  Category category = modalmapper.map(dto, Category.class);
		return categorydao.save(category);
	}

	@Override
	public List<Category> getAllCategories() {
		
		return categorydao.findAll();
	}

	@Override
	public ApiResponse deleteCategory(Long id) {
		Category category = categorydao.findById(id).orElseThrow(
				()-> new ResourseNotFoundException("category not found!!"));
		categorydao.delete(category);
		return new ApiResponse("deleted!!!");
	}

	@Override
	public Category updateCategory(Long id, CategoryDto dto) {
		Category existingCategory = categorydao.findById(id)
		        .orElseThrow(() -> new ResourseNotFoundException("Invalid category ID"));

		if (!existingCategory.getName().equalsIgnoreCase(dto.getName()) &&
		    categorydao.existsByName(dto.getName())) {
		    throw new InvalidInputException("duplicate category name!!");
		}

		Category category = categorydao.findById(id).orElseThrow(
				()-> new ResourseNotFoundException("category not found!!"));
		modalmapper.map(dto, category);
		return category;
	}

}
