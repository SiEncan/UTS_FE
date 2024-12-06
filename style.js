const searchInput = document.getElementById('searchInput');
const searchIcon = document.getElementById('searchIcon');

function performSearch() {
    const searchValue = searchInput.value.toLowerCase();
    const productCards = document.querySelectorAll('.products');
    const categoryTitles = document.querySelectorAll('.category-title');
    const visibleProductsCount = {};

    productCards.forEach(function (productCard) {
        const productName = productCard.querySelector('.product-name').textContent.toLowerCase();
        const category = productCard.closest('.product-container').id;

        if (productName.includes(searchValue)) {
            productCard.style.display = 'block';
            visibleProductsCount[category] = (visibleProductsCount[category] || 0) + 1;
        } else {
            productCard.style.display = 'none';
        }
    });

    categoryTitles.forEach(function (title) {
        const category = title.nextElementSibling.id;
        if (visibleProductsCount[category]) {
            title.style.display = 'block';
        } else {
            title.style.display = 'none';
        }
    });
}

searchIcon.addEventListener('click', performSearch);

searchInput.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        performSearch();
    }
});

document.addEventListener('DOMContentLoaded', function () {
    feather.replace();
});

function filter() {
    // Get min and max price input values
    var minPrice = document.getElementById("min_price").value;
    var maxPrice = document.getElementById("max_price").value;
  
    // Get checked color checkboxes
    var checkedColors = [];
    var colorCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="color-"]');
    for (var i = 0; i < colorCheckboxes.length; i++) {
      if (colorCheckboxes[i].checked) {
        checkedColors.push(colorCheckboxes[i].value);
      }
    }
  
    // Get all product containers
    var productContainers = document.querySelectorAll(".product-container");
    
    productContainers.forEach(function(container) {
        // Find all products in this container
        var products = container.querySelectorAll(".classForColor");
        var visibleProductCount = 0;
        
        // Filter products
        for (var j = 0; j < products.length; j++) {
            var product = products[j];
            
            // Add a safety check for the color attribute
            var colorAttr = product.getAttribute("data-color");
            var productColor = colorAttr ? JSON.parse(colorAttr) : [];
            
            var productPrice = parseFloat(product.querySelector(".product-price").textContent.replace("Rp", "").replace(/,/g, ""));
    
            // Check price filter
            var priceMatch = true;
            if (minPrice && productPrice < parseFloat(minPrice)) {
                priceMatch = false;
            }
            if (maxPrice && productPrice > parseFloat(maxPrice)) {
                priceMatch = false;
            }
    
            // Check color filter
            var colorMatch = checkedColors.length === 0 || 
                (productColor.length > 0 && checkedColors.some(function(color) {
                    return productColor.some(function(prodColor) {
                        return prodColor.toLowerCase() === color.toLowerCase();
                    });
                }));
    
            // Show or hide product based on filters
            if (priceMatch && colorMatch) {
                product.style.display = "block";
                visibleProductCount++;
            } else {
                product.style.display = "none";
            }
        }
        
        // Find and toggle the category title
        var categoryTitle = container.previousElementSibling;
        if (categoryTitle && categoryTitle.classList.contains("category-title")) {
            categoryTitle.style.display = visibleProductCount > 0 ? "block" : "none";
        }
    });
}