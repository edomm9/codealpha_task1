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
document.addEventListener("DOMContentLoaded", getData());
async function getData () {
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
  }

document.addEventListener("DOMContentLoaded", displayOrder());
async function displayOrder() {
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
      button.addEventListener('click', async function (e) {
        e.preventDefault();
        const productIndex = parseInt(e.currentTarget.dataset.productIndex);
        if (isNaN(productIndex) || productIndex >= data.length) {
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
          console.log('response received');
          const responseData = await res.json();
          console.log(responseData.message);
          alert('Order removed');
          displayOrder();
        } else {
          alert('An error has occurred');
        }
      });
    });
    
    viewButtons.forEach(button => {
      button.addEventListener('click', async function (e) {
        e.preventDefault();
        console.log('view button function triggered');
        const productIndex = parseInt(e.currentTarget.dataset.productIndex);
        if (isNaN(productIndex) || productIndex >= data.length) {
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
          console.log('response received');
          const responseData = await res.json();
          const orders = responseData.products;
     
          // Display the products in <li> tags
          const orderList = document.createElement('ul');
          orders.forEach(product => {
            const listItem = document.createElement('li');
            listItem.textContent = product;
            orderList.appendChild(listItem);
          });
    
          // Append the list to a specific element on the page
          const viewContainer = document.getElementById('products');
          viewContainer.innerHTML = ' ';
          viewContainer.innerHTML=`
           <div class="row">
                    <div class="col"><button class="btn" onClick="showPage('page2')">Back</button></div>
                    </div><br>
                    <h3>Produc        
                  `;
          viewContainer.appendChild(orderList);
          const info = document.getElementById('info');
          info.innerHTML=' ';
info.innerHTML=`<h3>Customer Info: </h3>
<ul>
          <li>Name: ${responseData.customerName} </li>
          <li>Email: ${responseData.customerEmail}</li>
          <li>Number: ${responseData.customerNumber}</li>
          <li>Address: ${responseData.customerAddress}</li>
          
          </ul>`
          console.log('viewContainer displayed');
          showPage('page5');
        } else {
            alert('An error has occurred');
        }
      });
    }); } else {
    console.error("view Container not found with id 'page3'");
  }
}

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
          console.log(responseData.message);
          alert('Product deleted please reload');
          data.splice(productIndex, 1);

         getData();
        } else {
          alert('An error has occurred');
        }
      }
      document.addEventListener('DOMContentLoaded', async function() {
    console.log('doc loaded');
    const addForm = document.getElementById('addForm');
    if (addForm) {
        addForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const imageInput = document.getElementById("image");

            if (!imageInput.files[0]) {
                alert("Please select an image file to upload.");
                return; // Prevent form submission if no file is selected
            }

            const formData = new FormData();
            formData.append('name', document.querySelector("#name").value);
            formData.append('quantity', document.querySelector("#quantity").value);
            formData.append('price', document.querySelector("#price").value);
            formData.append('image', imageInput.files[0]);

            const req = await fetch(BaseUrl + "api/products", {
                method: "POST",
                body: formData
            });

            const resData = await req.json();
            console.log(resData.message);
            
            alert('product added');
            getData();
        });
    }
});