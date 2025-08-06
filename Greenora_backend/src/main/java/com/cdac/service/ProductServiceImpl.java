package com.cdac.service;

import java.io.IOException;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cdac.custom_exception.InvalidInputException;
import com.cdac.custom_exception.ResourseNotFoundException;
import com.cdac.dao.CategoryDao;
import com.cdac.dao.ProductDao;
import com.cdac.dao.UserDao;
import com.cdac.dto.ApiResponse;
import com.cdac.dto.ProductDto;
import com.cdac.entities.Category;
import com.cdac.entities.Product;
import com.cdac.entities.StockStatus;
import com.cdac.entities.User;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;


@Service
@Transactional
@AllArgsConstructor
public class ProductServiceImpl implements ProductService {

	private final ModelMapper modalmapper;
    private final ProductDao productdao;
    private final CategoryDao categorydao;
    private final UserDao userdao;
    
	
	@Override
	public Product addProduct(Long categoryID,ProductDto dto)  {
		Category category = categorydao.findById(categoryID).orElseThrow(()->
	     new ResourseNotFoundException("invalid category!!!") );
		
		if(productdao.existsByCategoryIdAndName(categoryID, dto.getName())) {
			throw new InvalidInputException("same category and poroduct name alrdy exist!!");
		}
	    dto.setCategoryId(categoryID);
		dto.setStockStatus(StockStatus.IN_STOCK);
		dto.setActive(true);
		
		User user = userdao.findById(dto.getVendorId()).orElseThrow(
				()-> new ResourseNotFoundException("wrong vendor id!!!"));
			 	
		Product product = modalmapper.map(dto, Product.class);
		
		
		
		product.setVendor(user);
		category.addProduct(product);
		return product;
		
	}

	@Override
	public Product updateProduct(Long id, ProductDto dto)  {
		// Inside your update method

		Product existingProduct = productdao.findById(id)
		        .orElseThrow(() -> new ResourseNotFoundException("Product not found"));

		if (!existingProduct.getName().equals(dto.getName()) &&
		        productdao.existsByName(dto.getName())) {
		    throw new InvalidInputException("Duplicate product name!");
		}

		
		Product product = productdao.findById(id).orElseThrow(()-> new
				ResourseNotFoundException("invalid product id!!!"));
		dto.setStockStatus(StockStatus.IN_STOCK);
		dto.setCategoryId(product.getCategory().getId());
		dto.setActive(true);

		 modalmapper.map(dto,product);
		return product;
	}

	@Override
	public  ApiResponse deleteProduct(Long id) {
		Product product = productdao.findById(id).orElseThrow(()->
	     new ResourseNotFoundException("invalid product id!!!") );
		
		productdao.delete(product);
		return new  ApiResponse("deleted!!!");
		}

	@Override
	public Product getProductById(Long id) {
		return productdao.findById(id).orElseThrow(()->
	     new ResourseNotFoundException("invalid category!!!") );
	}

	@Override
	public List<Product> getAllProducts() {
		List<Product> list = productdao.findAll();
		return list;
	}

	@Override
	public List<Product> getProductsByCategoryId(Long categoryId) {
		List<Product> list = productdao.findByCategoryId(categoryId);
		return list;
	}

	@Override
	public List<Product> searchProducts(String productName) {
		
		 List<Product> list = productdao.findByName(productName);
		 if(list.isEmpty()) {
			 throw new ResourseNotFoundException("list is empty");
		 }
		 return list;
	}

	@Override
	public List<Product> getByVendorId(Long id) {
		List<Product> list = productdao.findByVendorId(id);
		if(list.isEmpty()) {
			 throw new ResourseNotFoundException("list is empty");
		 }
		 return list;
	}

}
