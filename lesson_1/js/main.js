const products = [
    {id: 1, title: "notepad", price: "30000"},
    {id: 2, title: "notebook", price: "50000"},
    {id: 3, title: "phone", price: "10000"},
    {id: 4}
];

const renderProduct = (title = 'something', price = 100) => {
        return `<div class="product-item">
                    <h3>${title}</h3>
                    <p>${price}</p>
                    <button class="by-btn">Добавить в корзину</button>
                </div>`;
};

const renderProducts = (productsList) => productsList.map(({title, price}) => renderProduct(title, price));
document.querySelector('.products').innerHTML = renderProducts(products).join(' ');