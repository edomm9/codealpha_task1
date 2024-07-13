const BaseUrl = "http://localhost:8585/";
const shop = document.getElementById("shop-now");
const productsContainer = document.getElementById("shop-section"); 

shop.addEventListener("click", getData);

let cart = [];
let cartButtons; // Assuming cartButtons is defined elsewhere

function initializeCart() {
  const storedCart = localStorage.getItem("cart");
  cart = storedCart ? JSON.parse(storedCart) : [];
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(item) {
  cart.push(item);
  saveCart();
  console.log("Item added to cart:", item);
  alert('Item added to cart!');
  // You can also update the UI to reflect the added item (optional)
}

function removeFromCart(itemIndex) {
  if (itemIndex >= 0 && itemIndex < cart.length) {
    const removedItem = cart.splice(itemIndex, 1);
    saveCart();
    console.log("Item removed from cart:", removedItem);
    // You can also update the UI to reflect the removed item (optional)
  } else {
    console.log("Invalid item index");
  }
}

function displayCart() {
  console.log("Cart items:");
  cart.forEach((item, index) => {
    console.log(`${index }. ${item.name} - $${item.price}`);
  });
}

initializeCart();


async function getData(e) { // Assuming buttons is passed as an argument
  e.preventDefault();

  const res = await fetch(BaseUrl + "api/products", {
    method: "GET",
  });

  const data = await res.json();

  if (productsContainer) {
    productsContainer.innerHTML = '';

    data.forEach((product, index) => {
      

      const productCard = `
        <div class="product">
          <img src="../${product.image}" alt="" width="300" />
          <p class = "name" id="title-${index }">${product.name}</p>
          <br>
          
          <div class = "price" id="price${index }">$${product.price}</div>
          <button class="cart-btn" data-product-index="${index}">
            <img src="media/icons8-cart-24.png" alt="A cart icon" />
          </button>
        </div>
      `;

      productsContainer.innerHTML += productCard;
      
    });
    productsContainer.scrollIntoView({ behavior: "smooth" });

    // Update cartButtons reference after DOM manipulation
    cartButtons = document.querySelectorAll('.cart-btn');

cartButtons.forEach(button => {
  button.addEventListener('click', event => handleAddToCart(event, data));
});
  } else {
    console.error("productsContainer not found in the document");
  }
}

// Save cart data to localStorage in handleAddToCart function
function handleAddToCart(event, data) {
  // Add product to cart
  const productIndex = parseInt(event.currentTarget.dataset.productIndex);
  if (isNaN(productIndex) || !data || productIndex >= data.length) {
    console.error("Invalid product index in cart button");
    return;
  }

  const product = {
    name: data[productIndex].name,
    price: parseFloat(data[productIndex].price)
  };

  addToCart(product);

  // Save cart data to localStorage
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  cartItems.push(product);
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

//handle customer information
