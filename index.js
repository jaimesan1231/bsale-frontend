//Se crea el fragment
const fragment = document.createDocumentFragment();

//Se obtienen los templates que se usaran
const templateCartItem = document.getElementById("template-cart").content;
const templateCard = document.getElementById("template-card").content;
const templateFooter = document.getElementById("template-footer").content;

//Se obtienen los elementos del DOM
const products = document.getElementById("products");
const category = document.getElementById("");
const sidebar = document.getElementById("sidebar");
const title = document.getElementById("title");
const searchInput = document.getElementById("name-input");
const dropdownHeader = document.getElementById("dropdown-header");
const dropdownList = document.getElementById("dropdown-box");
const arrow = document.getElementById("arrow");
const dropdownTitle = document.getElementById("dropdown-title");
const cartList = document.getElementById("cart-list");
const cartButton = document.getElementById("cart-button");
const shoppingCart = document.getElementById("shopping-cart");
const homeButton = document.getElementById("home-icon");
const cartFooter = document.getElementById("cart-footer");
const cartItem = document.getElementById("cart-item");
const categoryButton = document.getElementById("category-button");
const paginationList = document.getElementById("pagination-list");
const logo = document.getElementById("logo");

//Variables
let currentProducts = [];
let cart = {};
let pageIndex = 0;

//Se obtienen los datos del API y se muestran al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  fetchData();
});

//Se asignan los listeners a los elementos
dropdownHeader.addEventListener("click", () => handleDropDown());
categoryButton.addEventListener("click", () => handleSidebar());
logo.addEventListener("click", () => getProducts());
cartButton.addEventListener("click", () => {
  shoppingCart.classList.toggle("bottom");
});
homeButton.addEventListener("click", () => {
  getProducts();
});
cartList.addEventListener("click", (e) => deleteCartItem(e));
products.addEventListener("click", (e) => addCartItem(e));

//Se detecta la opcion elegida y se ordenan los productos
dropdownList.addEventListener("click", (e) => {
  e.stopPropagation();
  if (e.target.classList.contains("dropdown__item")) {
    dropdownTitle.textContent = e.target.textContent;
    handleDropDown();
    paginationList.innerHTML = "";
    orderData(currentProducts, e.target.id);
    console.log(currentProducts);
    addPagination(currentProducts);
    loadProductPage(0);
  }
});

//Se obtienen los datos de los productos y las categorias
const fetchData = () => {
  getProducts();
  getCategories();
};

//Se obtienen los datos de los productos y se cargan en la pagina
const getProducts = async () => {
  try {
    title.innerHTML = "Productos";
    const res = await fetch("http://localhost:8000/products");
    const data = await res.json();
    currentProducts = [...data];
    resetDropDown();
    loadProductPage(0);
    addPagination(data);
  } catch (error) {
    console.log(error);
  }
};

//Se obtienen los datos de las categorias y se cargan en la pagina
const getCategories = async () => {
  try {
    const res = await fetch("http://localhost:8000/categories");
    const data = await res.json();
    listCategories(data);
  } catch (error) {
    console.log(error);
  }
};

//Borra los productos actuales de la pagina y los reemplaza con data nueva
const listCards = (data) => {
  deleteCards();
  data.forEach((product) => {
    templateCard.querySelector("h2").textContent = capitalizeName(
      product.name.toLowerCase().trim()
    );
    templateCard.querySelector("span").textContent = "$ " + product.price;
    templateCard.querySelector("img").setAttribute("src", product.url_image);
    templateCard.querySelector("i").dataset.id = product.id;
    //Se calcula el descuento del producto
    if (product.discount !== 0) {
      templateCard.querySelector(".card__old-price").textContent =
        "$ " + Math.ceil((product.price * 100) / (100 - product.discount));
    } else {
      templateCard.querySelector(".card__old-price").textContent = "";
    }
    const clone = templateCard.cloneNode(true);
    fragment.appendChild(clone);
  });
  products.appendChild(fragment);
};

//Crea los items de categoria y los agrega al sidebar
const listCategories = (data) => {
  data.forEach((category) => {
    const item = document.createElement("li");
    item.innerHTML = category.name;
    item.dataset.id = category.id;
    item.classList.add("sidebar__item");
    item.addEventListener("click", (e) => {
      filterCategory(e);
    });
    document.getElementById("categories").appendChild(item);
  });
};

//Realiza una peticion de búsqueda por categoria a la API y se cargan en la página
const filterCategory = async (e) => {
  title.innerHTML = e.target.textContent;
  paginationList.innerHTML = "";
  deleteCards();
  handleSidebar();
  resetDropDown();
  try {
    const res = await fetch(
      `http://localhost:8000/products/category/${e.target.dataset.id}`
    );
    const data = await res.json();
    //Se guarda una copia de los productos actuales en un arreglo
    currentProducts = [...data];
    loadProductPage(0);
    if (currentProducts.length > 8) {
      addPagination(data);
    }
  } catch (error) {
    console.log(error);
  }
};

//Elimina los productos actuales de la pagina
const deleteCards = (e) => {
  products.innerHTML = "";
};

//Muestra y esconde el sidebar
const handleSidebar = (e) => {
  sidebar.classList.toggle("move-right");
};

//Realiza una peticion de busqueda por nombre a la API y se cargan en la pagina
const searchProduct = async (e) => {
  e.preventDefault();
  resetDropDown();
  let inputValue = searchInput.value;
  try {
    const res = await fetch(
      `http://localhost:8000/products/search/${inputValue.toUpperCase()}`
    );
    const data = await res.json();
    searchInput.value = "";
    if (data.length > 0) {
      console.log("hay");
      listCards(data);
    } else {
      products.innerHTML = `<h3>No se encontraron resultados con la palabra: ${inputValue}</h3>`;
      console.log("no hay");
      paginationList.innerHTML = "";
    }
  } catch (error) {
    console.log(error);
  }
};

//Resetea el dropdown de filtros
const resetDropDown = () => {
  dropdownTitle.textContent = "Ordenar por";
  dropdownList.classList.remove("scale");
  arrow.classList.remove("rotate");
};

//Ordena los productos actuales
const orderData = (data, order) => {
  switch (order) {
    case "alphabetic":
      //Se ordena la data por orden alfabetico
      data.sort((object1, object2) => {
        if (object1.name < object2.name) {
          return -1;
        } else if (object1.name > object2.name) {
          return 1;
        } else {
          return 0;
        }
      });
      break;
    case "price-higher":
      //Se ordena la data de mayor a menor
      data.sort((object1, object2) => {
        if (object1.price > object2.price) {
          return -1;
        } else if (object1.price < object2.price) {
          return 1;
        } else {
          return 0;
        }
      });
      break;
    case "price-lower":
      //Se ordena la data de menor a mayor
      data.sort((object1, object2) => {
        if (object1.price < object2.price) {
          return -1;
        } else if (object1.price > object2.price) {
          return 1;
        } else {
          return 0;
        }
      });
      break;
    default:
      break;
  }
};

//Formatea el nombre del producto para que la primera letra de cada palabra esté en mayúsculas
const capitalizeName = (name) => {
  let finalName = "";
  name.split(" ").forEach((name) => {
    finalName = finalName + " " + name[0].toUpperCase() + name.substring(1);
  });
  return finalName;
};

//Agrega el producto al carrito de compras
const addCartItem = (e) => {
  e.stopPropagation();
  if (e.target.classList.contains("cart-icon")) {
    setCart(e.target.parentElement.parentElement);
    listCartItems();
    updateCartFooter();
  }
};

//Obtiene los datos del producto seleccionado y se actualiza el objeto cart
const setCart = (card) => {
  const product = {
    id: card.querySelector("i").dataset.id,
    name: card.querySelector("h2").textContent,
    price: card.querySelector("span").textContent.substring(2),
    image: card.querySelector("img").getAttribute("src"),
    quantity: 1,
  };
  if (cart.hasOwnProperty(product.id)) {
    product.quantity = cart[product.id].quantity + 1;
  }
  cart[product.id] = { ...product };
};

//Muestra en la pagina los items del carrito de compras
const listCartItems = () => {
  emptyCart();
  Object.values(cart).forEach((cartItem) => {
    //Se crean los items necesarios
    templateCartItem.querySelector("h3").textContent = cartItem.name;
    templateCartItem.querySelector(".cart-product__price").textContent =
      "$ " + cartItem.price;
    templateCartItem.querySelector("span").textContent = cartItem.quantity;
    templateCartItem.querySelector("img").setAttribute("src", cartItem.image);
    templateCartItem.querySelector("i").dataset.id = cartItem.id;
    const clone = templateCartItem.cloneNode(true);
    fragment.appendChild(clone);
  });
  cartList.appendChild(fragment);
  updateCartFooter();
};

//Vacía el carrito de compras
const emptyCart = () => {
  cartList.innerHTML = "";
};

//Actualiza el footer del carrito de compras al añadir o quitar un producto
const updateCartFooter = () => {
  cartFooter.innerHTML = "";
  if (Object.keys(cart).length === 0) {
    cartFooter.innerHTML = `<h4>No hay productos en el carrito</h4>`;
  } else {
    //Se calcula el subtotal del carrito de compras
    const subTotal = Object.values(cart).reduce(
      (acc, { quantity, price }) => acc + quantity * price,
      0
    );
    templateFooter.querySelector("#subtotal").textContent = "$ " + subTotal;
    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);
    cartFooter.appendChild(fragment);
  }
};

//Elimina un item del carrito de compras
const deleteCartItem = (e) => {
  if (e.target.classList.contains("delete-icon")) {
    delete cart[e.target.dataset.id];
    listCartItems();
  }
};

//Muestra y oculta el dropdown
const handleDropDown = () => {
  dropdownList.classList.toggle("scale");
  arrow.classList.toggle("rotate");
};

//Agrega el numero de paginas a la paginacion
const addPagination = (data, initialPage = 0) => {
  console.log(data);
  paginationList.innerHTML = "";
  for (let i = 0; i < data.length / 20; i++) {
    const paginationNumber = document.createElement("li");
    paginationNumber.classList.add("pagination__item");
    paginationNumber.textContent = i + 1;
    paginationNumber.addEventListener("click", (e) => {
      e.stopPropagation();
      pageIndex = e.target.textContent - 1;
      loadProductPage(pageIndex);
      //Se vuelven a cargar los numeros de la paginacion para detectar la pagina actual
      addPagination(data, pageIndex);
      scrollUp();
    });
    //Se detecta la apgina actual
    if (i === initialPage) {
      paginationNumber.classList.add("pagination__item_active");
    }
    paginationList.appendChild(paginationNumber);
  }
};

//Carga los productos de la pagina indicada
const loadProductPage = (page) => {
  pageProducts = [...currentProducts.slice(page * 20, page * 20 + 20)];
  listCards(pageProducts);
};

//Dirige el scroll al inicio de la pagina
const scrollUp = () => {
  window.scrollTo({
    behavior: "smooth",
    top: 0,
  });
};
