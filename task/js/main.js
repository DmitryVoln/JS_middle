// const products = [
//     {id: 1, title: "notepad", price: "30000"},
//     {id: 2, title: "notebook", price: "50000"},
//     {id: 3, title: "phone", price: "10000"},
//     {id: 4}
// ];

// const renderProduct = (title = 'something', price = 100) => {
//         return `<div class="product-item">
//                     <h3>${title}</h3>
//                     <p>${price}</p>
//                     <button class="by-btn">Добавить в корзину</button>
//                 </div>`;
// };

// const renderProducts = (productsList) => productsList.map(({title, price}) => renderProduct(title, price));
// document.querySelector('.products').innerHTML = renderProducts(products).join(' ');



class ProductList {
    constructor (container = '.container') {
        this.container = container;
        this._goods = []; // data
        this._allProducts = []; // массив экземпляров товаров на основе goods;
    
    this._fetchGoods();
    this._render();
    }
    
    _fetchGoods() {
        this._goods = [
            {id: 1, title: "notepad", price: 30000},
            {id: 2, title: "notebook", price: 50000},
            {id: 3, title: "phone", price: 10000},
        ];

    }

    _render() {
        const block = document.querySelector(this.container);
        this._goods.forEach(element => {
            const productObject = new ProductItem(element);
            this._allProducts.push(productObject);
            block.insertAdjacentHTML('beforeend', productObject.render());
        });
    }

    totalPrice() {
        let priceCount = 0;
        this._allProducts.forEach((product) => priceCount += product.price);
        // console.log(priceCount);
        return priceCount;
    }
}


class ProductItem {
    constructor(product, img = '../images/product_default.jpeg') {
        this.title = product.title;
        this.price = product.price;
        this.id = product.id;
        this.img = img;
    }

    render() {
        return `<div class="product-item">
        <img class='product_img' src=${this.img}>
        <h3>${this.title}</h3>
        <p>${this.price}</p>        
        <button class="by-btn">Добавить в корзину</button>
    </div>`;
    }
}

new ProductList('.products').totalPrice();


// class ProductInBascet {
//     constructor (product) {
//         this.id = product.id;
//         this.title = product.price;
//         this.count = product.count;
//     }

//     totalPrice() {
//        return this.price * this.count;
//     }

//     render() {
//         return `<div class="product-in-basket">
//             <h3>${this.title}</h3>
//             <p>${this.price}</p> 
//             <p>${this.count}</p>
//             <p>${this.totalPrice()}</p>`;
//     }

// }

// class Basket {
//     constructor(container) {
//         this.container = container;
//         this.products =  [];
//     }

//     productsCount() {

//     }

//     totalPrice() {

//     }

// }

