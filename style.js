const navbarButton = document.querySelector(".navbar-button");
document.querySelector('#menu').onclick = () => {
    navbarButton.classList.toggle('active');
};

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

const filtering = document.getElementById('filtering');

filtering.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        filter();
    }
});

function filter() {
    let minPrice = document.getElementById("min_price").value;
    let maxPrice = document.getElementById("max_price").value;

    minPrice = minPrice.replace(/\D/g, '');
    maxPrice = maxPrice.replace(/\D/g, '');

    minPrice = parseInt(minPrice);
    maxPrice = parseInt(maxPrice);

    let selectedColors = [];
    document.querySelectorAll('input[type="checkbox"]:checked').forEach((checkbox) => {
        selectedColors.push(checkbox.value);
    });

    const products = document.querySelectorAll('.products')
    const categoryTitles = document.querySelectorAll('.category-title');
    const visibleProductsCount = {};

    products.forEach((product) => {
        const priceText = product.querySelector('.product-price').textContent;
        let price = priceText.replace(/\D/g, '');
        price = parseInt(price);

        const productColors = product.getAttribute('data-color').split(',');
        const category = product.closest('.product-container').id;

        const priceInRange = (!minPrice || price >= minPrice) && (!maxPrice || price <= maxPrice);

        const colorMatches = selectedColors.length === 0 || selectedColors.some(color => productColors.includes(color));

        if (priceInRange && colorMatches) {
            product.style.display = 'block';
            visibleProductsCount[category] = (visibleProductsCount[category] || 0) + 1;
        } else {
            product.style.display = 'none';
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
