const products = document.getElementById("products");
const templateCard = document.getElementById("template-card").content;
const templateDiscountCard =
  document.getElementById("template-discount").content;
const fragment = document.createDocumentFragment();
const category = document.getElementById("");
const sidebar = document.getElementById("sidebar");
const title = document.getElementById("title");
const searchInput = document.getElementById("name-input");
const dropdownHeader = document.getElementById("dropdown-header");
const dropdownList = document.getElementById("dropdown-box");
const arrow = document.getElementById("arrow");
const dropdownTitle = document.getElementById("dropdown-title");
let currentProducts = [];
dropdownHeader.addEventListener("click", () => {
  dropdownList.classList.toggle("scale");
  arrow.classList.toggle("rotate");
  console.log(arrow);
});

dropdownList.addEventListener("click", (e) => {
  e.stopPropagation();
  if (e.target.classList.contains("dropdown__item")) {
    dropdownTitle.textContent = e.target.textContent;
  }
  console.log(e.target.id);
  dropdownList.classList.toggle("scale");
  arrow.classList.toggle("rotate");
  orderData(currentProducts, e.target.id);
  console.log(currentProducts);
  listCards(currentProducts);
});

document.addEventListener("DOMContentLoaded", () => {
  fetchData();
});

const fetchData = () => {
  getCategories();
  getProducts();
};

const getProducts = async () => {
  try {
    const res = await fetch("http://localhost:8000/products");
    const data = await res.json();
    console.log(data);
    title.innerHTML = "Productos";
    resetDropDown();
    currentProducts = [...data];

    listCards(data);
  } catch (error) {
    console.log(error);
  }
};

const getCategories = async () => {
  try {
    const res = await fetch("http://localhost:8000/categories");
    const data = await res.json();
    console.log(data);
    listCategories(data);
  } catch (error) {
    console.log(error);
  }
};

const listCards = (data) => {
  deleteCards();
  console.log(data);
  data.forEach((product) => {
    if (product.discount == 0) {
      templateCard.querySelector("h2").textContent = product.name;
      templateCard.querySelector("span").textContent = "$ " + product.price;
      templateCard.querySelector("img").setAttribute("src", product.url_image);
      templateCard.querySelector("svg").dataset.id = product.id;
      const clone = templateCard.cloneNode(true);
      fragment.appendChild(clone);
    } else {
      templateDiscountCard.querySelector("h2").textContent = product.name;
      templateDiscountCard.querySelector(".card__price").textContent =
        "$ " + product.price;
      templateDiscountCard.querySelector(".card__old-price").textContent =
        "$ " + Math.ceil((product.price * 100) / (100 - product.discount));
      templateDiscountCard
        .querySelector("img")
        .setAttribute("src", product.url_image);
      templateDiscountCard.querySelector("svg").dataset.id = product.id;
      const clone = templateDiscountCard.cloneNode(true);
      fragment.appendChild(clone);
    }
  });
  products.appendChild(fragment);
};

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

const filterCategory = async (e) => {
  console.log(e);
  deleteCards();
  hideSidebar();
  title.innerHTML = e.target.textContent;
  resetDropDown();
  try {
    const res = await fetch(
      `http://localhost:8000/products/category/${e.target.dataset.id}`
    );
    const data = await res.json();
    console.log(data);
    currentProducts = [...data];
    listCards(data);
  } catch (error) {
    console.log(error);
  }
};

const deleteCards = (e) => {
  products.innerHTML = "";
};

const showSidebar = (e) => {
  sidebar.style.left = "0";
};
const hideSidebar = (e) => {
  sidebar.style.left = "-250px";
};

const searchProduct = async (e) => {
  e.preventDefault();
  resetDropDown();
  try {
    const res = await fetch(
      `http://localhost:8000/products/search/${searchInput.value.toUpperCase()}`
    );
    const data = await res.json();
    console.log(data);
    searchInput.value = "";
    listCards(data);
  } catch (error) {
    console.log(error);
  }
};

const handleEnter = (e) => {
  console.log(e);
};

const resetDropDown = () => {
  dropdownTitle.textContent = "Ordenar por";
  dropdownList.classList.remove("scale");
  arrow.classList.remove("rotate");
};

const orderData = (data, order) => {
  switch (order) {
    case "alphabetic":
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
