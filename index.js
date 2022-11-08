const products = document.getElementById("products");
const templateCard = document.getElementById("template-card").content;
const fragment = document.createDocumentFragment();

document.addEventListener("DOMContentLoaded", () => {
  fetchData();
});

const fetchData = async () => {
  try {
    const res = await fetch("http://localhost:8000/products");
    const data = await res.json();
    console.log(data);
    listCards(data);
  } catch (error) {
    console.log(error);
  }
};

const listCards = (data) => {
  console.log(data);
  data.forEach((product) => {
    templateCard.querySelector("h2").textContent = product.name;
    templateCard.querySelector("span").textContent = "$ " + product.price;
    templateCard.querySelector("img").setAttribute("src", product.url_image);
    const clone = templateCard.cloneNode(true);
    fragment.appendChild(clone);
  });
  products.appendChild(fragment);
};
