let Pname = document.getElementById("name");
let Pquantity = document.getElementById("quantity");
let Pprice = document.getElementById("price");
const productsContainer = document.getElementById("page2");
const BaseUrl = "http://localhost:8585/";

//Admin authentication
const adminCredentials = {
  email: "admin",
  password: "admin_1234",
};

document
  .querySelector("#page1")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.querySelector("#page1 input[name='email']").value;
    const password = document.querySelector("#page1 input[name='pass']").value;

    // Check if the entered credentials match the admin credentials
    if (
      email === adminCredentials.email &&
      password === adminCredentials.password
    ) {
      showPage("page2");
    } else {
      const status = document.querySelector(".status");
      status.innerHTML = 'Invalid Username or Password'
    }

    // Clear the input fields after submission
    document.querySelector("#page1 input[name='email']").value = "";
    document.querySelector("#page1 input[name='pass']").value = "";
  });


  //for moving through pages
function showPage(pageId) {
  const pages = document.querySelectorAll(".page");
  pages.forEach((page) => {
    if (page.id === pageId) {
      page.classList.add("active");
    } else {
      page.classList.remove("active");
    }
  });
}
document.addEventListener("DOMContentLoaded", async function () {
  const res = await fetch(BaseUrl + "api/products", {
    method: "GET",
  });

  const data = await res.json();
  const productsContainer = document.getElementById("page2");

if (productsContainer) {
    productsContainer.innerHTML = ''; 
    productsContainer.innerHTML = `
        <h1>Shop</h1>
        <hr />
        <div class="row">
            <div class="col"><button class="btn" onClick="showPage('page3')">Add</button></div>
            <div class="col"><button class="btn" onClick="showPage('page4')">Orders</button></div>
            <div class="col"><button class="btn" onClick="showPage('page1')">Log Out</button></div>
             </div>
    `;

    productsContainer.innerHTML += '<div class="row">';

    data.forEach((product, index) => {
        const productCard = `
            <div class="product">
                <img src="../${product.image}" alt="An image of a watch" width="300" />
                <p class="name" id="title-${index}">${product.name}</p>
                <br>
                <div class="price" id="price${index}">$${product.price}</div>
                <button class="del-btn cart-btn" data-product-index="${index}">Delete</button>
            </div>
        `;

        productsContainer.innerHTML += productCard;
    });
}else {
    console.error("productsContainer not found with id 'page2'");
  }
    const deleteButtons = document.querySelectorAll('.del-btn');

    deleteButtons.forEach(button => {
      button.addEventListener('click', event=> deleteProduct(event, data) );
    });
  });


document.addEventListener("DOMContentLoaded", async function () {
  console.log('doc loaded for order');
  const res = await fetch(BaseUrl + "api/order", {
    method: "GET",
  });
if(!(res.ok)){
  alert('No Orders');
}
console.log('order data from database');
  const data = await res.json();
  const orderContainer = document.getElementById("page4");

  if (orderContainer) {
    orderContainer.innerHTML = '';
    orderContainer.innerHTML = `
        <h1>Shop</h1>
        <hr />
        <div class="row">
            <div class="col"><button class="btn" onClick="showPage('page2')">Back</button></div>
            </div>
    `;

    data.forEach((product, index) => {
      const productCard = `
        <i>
          <p>An order has been placed by: ${product.customerName}</p>
          <button class="view-btn buy-btn" data-product-index="${index}">View</button>
          <button class="complete-btn cart-btn" data-product-index="${index}">Completed</button>
        </i>
      `;

      orderContainer.innerHTML += productCard;
    });

    const completeButtons = document.querySelectorAll('.complete-btn');
    const viewButtons = document.querySelectorAll('.view-btn')
    completeButtons.forEach(button => {
      button.addEventListener('click', async function (e, data) {
        e.preventDefault();
        const productIndex = parseInt(e.currentTarget.dataset.productIndex);
        if (isNaN(productIndex) || !data || productIndex >= data.length) {
          console.error("Invalid product index in complete button");
          return;
        }

        const product = {
          id: data[productIndex]._id
        };
        const res = await fetch(BaseUrl + 'api/order/' + product.id, {
          method: "DELETE",
        });
        
if (res.ok) {
    const responseData = await res.json();
    alert(responseData.message);
    
} else {
    alert('An error has occurred');
}
      });
    });
    viewButtons.forEach(button => {
  button.addEventListener('click', async function (e, data) {
    e.preventDefault();
    const productIndex = parseInt(e.currentTarget.dataset.productIndex);
    if (isNaN(productIndex) || !data || productIndex >= data.length) {
      console.error("Invalid product index in view button");
      return;
    }

    const order = {
      id: data[productIndex]._id
    };
    const res = await fetch(BaseUrl + 'api/order/' + order.id, {
      method: "GET",
    });
    if (res.ok) {
  const responseData = await res.json();
  const orders = responseData.products;

  // Display the products in <li> tags
  const productList = document.createElement('ul');
  orders.forEach(product => {
    const listItem = document.createElement('li');
    listItem.textContent = product; // Accessing the product directly without using index 'i'
    productList.appendChild(listItem);
  });

  // Append the list to a specific element on the page
  const viewContainer = document.getElementById('page5'); // Assuming 'page5' is the id of the element where you want to display the products
  viewContainer.innerHTML = '';
  viewContainer.innerHTML=`
   <div class="row">
            <div class="col"><button class="btn" onClick="showPage('page2')">Back</button></div>
            </div>
            <h1>Orders: </h1>
  `;
  viewContainer.appendChild(productList);
} else {
      alert('An error has occurred');
    }
  });
});  } else {
    console.error("view Container not found with id 'page3'");
  }
});

async function deleteProduct(event, data) {
        event.preventDefault();
        const productIndex = parseInt(event.currentTarget.dataset.productIndex);
       if (isNaN(productIndex) || !data || productIndex >= data.length) {
          console.error("Invalid product index in delete button");
          return;
        }

        const product = {
          id: data[productIndex]._id,
          name: data[productIndex].name,
          price: parseFloat(data[productIndex].price)
        };
        const res = await fetch(BaseUrl + 'api/products/' + product.id, {
          method: "DELETE",
        });
        if (res.ok) {
          const responseData = await res.json();
          alert(responseData.message);
        } else {
          alert('An error has occurred');
        }
      }
      document.addEventListener('DOMContentLoaded', async function() {
        console.log('doc loaded');
        const addForm = document.getElementById('addForm');
        if (addForm){
          addForm.addEventListener('submit', async function(e){
            e.preventDefault();
    const imageInput = document.querySelector("#image");
   // Access the first selected file

    if (!imageInput) {
      alert("Please select an image file to upload.");
      return; // Prevent form submission if no file is selected
    }
console.log('image uploaded?');
    const product = {
      name: document.querySelector("#name").value,
      quantity: document.querySelector("#quantity").value,
      price: document.querySelector("#price").value,
      image: imageInput // Capture only the filename
    }
          const req = await fetch(BaseUrl + "api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product)
          });
          const resData = await req.json();
          alert(resData.message);
         })
        }
       
      });