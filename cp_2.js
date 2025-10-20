// --- DOM Elements ---
const productContainer = document.getElementById('product-container');
const searchInput = document.getElementById('search-input');
const loader = document.getElementById('loader');

// --- Global State ---
let allProducts = []; // This will store all products fetched from the API

// The API endpoint for fetching product data
const API_URL = 'https://www.course-api.com/javascript-store-products';

// --- Functions ---

/**
 * Hides the loader and shows the product container.
 */
const showContent = () => {
    loader.classList.add('hidden');
    productContainer.style.display = 'grid'; // Ensure product container is displayed as grid
};

/**
 * Shows the loader and hides the product container.
 */
const showLoader = () => {
    loader.classList.remove('hidden');
    productContainer.style.display = 'none'; // Hide product container while loading
};

/**
 * A reusable function to handle and display errors in the UI.
 * @param {Error} error - The error object caught.
 */
const handleError = (error) => {
    console.error(`An error occurred: ${error.message}`);
    productContainer.innerHTML = `<p style="text-align: center; color: #e74c3c;">Sorry, we couldn't load the products. Please try again later.</p>`;
    showContent(); // Show the error message
};

/**
 * Displays an array of products in the DOM.
 * @param {Array} products - An array of product objects to display.
 */
const displayProducts = (products) => {
    // If no products match the filter, show a message
    if (products.length === 0) {
        productContainer.innerHTML = `<p style="text-align: center;">No products found matching your search.</p>`;
        return;
    }
    
    // Clear any previous content
    productContainer.innerHTML = '';

    // Create and append a card for each product
    products.forEach(product => {
        const { name, price } = product.fields;
        const imageUrl = product.fields.image[0].url;

        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        // Format the price (API price is in cents)
        const formattedPrice = `$${(price / 100).toFixed(2)}`;

        productCard.innerHTML = `
            <img src="${imageUrl}" alt="${name}">
            <h3>${name}</h3>
            <p>${formattedPrice}</p>
        `;
        productContainer.appendChild(productCard);
    });
};

/**
 * Fetches products using async/await and initializes the dashboard.
 */
const initializeDashboard = async () => {
    showLoader(); // Show loader before fetching
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Store all products globally
        allProducts = await response.json(); 
        
        // Display all products initially
        displayProducts(allProducts);
    } catch (error) {
        handleError(error);
    } finally {
        showContent(); // Hide loader after fetch completes (success or failure)
    }
};

/**
 * Filters products based on the search input.
 */
const handleSearch = () => {
    const searchTerm = searchInput.value.toLowerCase();
    
    const filteredProducts = allProducts.filter(product => {
        return product.fields.name.toLowerCase().includes(searchTerm);
    });
    
    displayProducts(filteredProducts);
};

// --- Event Listeners ---

// Add an event listener to the search input for real-time filtering
searchInput.addEventListener('input', handleSearch);

// --- Initial Load ---

// Call the main function to fetch data and set up the page when the script loads
initializeDashboard();
