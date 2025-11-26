// Seletores do DOM
const productList = document.querySelector('#products');
const addProductForm = document.querySelector('#add-product-form');
const updateProductForm = document.querySelector('#update-product-form');
const updateProductId = document.querySelector('#update-id');
const updateProductName = document.querySelector('#update-name');
const updateProductPrice = document.querySelector('#update-price');
const updateProductDescription = document.querySelector('#update-description');

const getProductForm = document.querySelector('#get-product-form');
const getProductId = document.querySelector('#get-id');
const productResult = document.querySelector('#product-result');

// ================================
// GET ALL PRODUCTS
// ================================
async function fetchProducts() {
  const response = await fetch('http://3.19.185.158:3000/products');
  const products = await response.json();

  productList.innerHTML = '';

  products.forEach(product => {
    const li = document.createElement('li');
    li.innerHTML = `${product.name} - $${product.price} — ${product.description}`;

    // Botão DELETE
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Delete';
    deleteButton.addEventListener('click', async () => {
      await deleteProduct(product.id);
      await fetchProducts();
    });
    li.appendChild(deleteButton);

    // Botão UPDATE
    const updateButton = document.createElement('button');
    updateButton.innerHTML = 'Update';
    updateButton.addEventListener('click', () => {
      updateProductId.value = product.id;
      updateProductName.value = product.name;
      updateProductPrice.value = product.price;
      updateProductDescription.value = product.description;
    });
    li.appendChild(updateButton);

    productList.appendChild(li);
  });
}

// ================================
// ADD PRODUCT (POST)
// ================================
async function addProduct(name, price, description) {
  try {
    const response = await fetch('http://3.19.185.158:3000/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, price, description })
    });
    const responseText = await response.text();
    if (!response.ok) {
      throw new Error(`Erro ao adicionar produto: ${response.status} - ${responseText}`);
    }
    // Aceita resposta em texto puro (ex: "created!!")
    return responseText;
  } catch (error) {
    throw error;
  }
}

addProductForm.addEventListener('submit', async event => {
  event.preventDefault();

  const name = addProductForm.elements['name'].value;
  const price = addProductForm.elements['price'].value;
  const description = addProductForm.elements['description'].value;

  try {
    await addProduct(name, price, description);
    addProductForm.reset();
    await fetchProducts();
  } catch (error) {
    alert(error.message);
    console.error(error);
  }
});

// ================================
// UPDATE PRODUCT (PUT)
// ================================
async function updateProduct(id, name, price, description) {
  const response = await fetch(`http://3.19.185.158:3000/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, price, description })
  });

  return response.json();
}

updateProductForm.addEventListener('submit', async event => {
  event.preventDefault();

  const id = updateProductId.value;
  const name = updateProductName.value;
  const price = updateProductPrice.value;
  const description = updateProductDescription.value;

  await updateProduct(id, name, price, description);
  updateProductForm.reset();
  await fetchProducts();
});

// ================================
// GET PRODUCT BY ID
// ================================
getProductForm.addEventListener('submit', async event => {
  event.preventDefault();

  const id = getProductId.value;

  const response = await fetch(`http://3.19.185.158:3000/products/${id}`);
  const product = await response.json();

  if (!product || product.length === 0) {
    productResult.innerHTML = `<p>Produto não encontrado!</p>`;
  } else {
    const p = product[0]; // Supabase retorna array
    productResult.innerHTML = `
      <p><strong>ID:</strong> ${p.id}</p>
      <p><strong>Name:</strong> ${p.name}</p>
      <p><strong>Price:</strong> $${p.price}</p>
      <p><strong>Description:</strong> ${p.description}</p>
    `;
  }

  getProductForm.reset();
});

// ================================
// DELETE PRODUCT (DELETE)
// ================================
async function deleteProduct(id) {
  const response = await fetch(`http://3.19.185.158:3000/products/${id}`, {
    method: 'DELETE'
  });

  return response.json();
}

// ================================
// INICIALIZAÇÃO
// ================================
fetchProducts();
