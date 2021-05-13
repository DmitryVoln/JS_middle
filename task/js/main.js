let API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

// const getRequest = (url, cb) => {
//     fetch(url)
//     .then(result => result.json())
//     .then((data) => {
//     return cb(data)})
//     .catch((error) => new Error(`maybe internet is over? or ${error}`));
// };

let getRequest = (url) => {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4){
                if(xhr.status !== 200){
                    reject('Error');
                } else {
                    resolve(xhr.responseText);
                }
            }
        };
        xhr.send();
    })
};

class List {
    constructor(container, url, list = listContext) {
        this.container = container;
        this.url = url;
        this.list = list;
        this.goods = [];
        this.allProducts = [];
        this.filtered = [];
        this._init();
    }
    getJson(url) {
        return fetch(url ? url : `${API_URL + this.url}`)
        .then((data) => data.json())
        .catch(error => console.log(error));

    }
    handleData(data) {
        this.goods = data;
        this.render();
    }

    calcSum() {
        this.allProducts.reduce((good, sum) => {
            sum += good.price;
        }, 0)
    }

    render() {
        const block = document.querySelector(this.container);
        for(const product of this.goods) {
            console.log(this.constructor.name)
            console.log(this.list[this.constructor.name])
            
            const productObj = new this.list[this.constructor.name](product);
            
            if (!productObj) {
                return;
            }
            this.allProducts.push(productObj);
            block.insertAdjacentHTML('beforeend', productObj.render());
        }
    }

    filter(value) {
        const regexp = new RegExp(value, 'i');
        this.filtered = this.allProducts.filter((product) => regexp.test(product.product_name));
        console.log(this.filtered);
        this.allProducts.forEach((el) => {
            const block = document.querySelector(`.product-item[data-id="${el.id_product}"]`)
            if(!this.filtered.includes(el)) {
                block.classList.add('invisible');
            } else {
                block.classList.remove('invisible');
            }
        })
    }
    _init() {
        return false;
    }
}

class Item {
    constructor(element, img) {
        this.id_product = element.id_product;
        this.product_name = element.product_name;
        this.price = element.price;
        this.img = img;
    }
    render() {
        return '';
    }
}

class ProductsList extends List {
    constructor(cart, container = '.products', url = "/catalogData.json") {
        super(container, url);
        this.cart = cart;
        this.getJson()
        .then((data) => this.handleData(data));
    }
    _init() {
        document.querySelector('.search-form').addEventListener('input', e =>{
            e.preventDefault(); // отменили действие события - отправка формы;
            this.filter(document.querySelector('.search-field').value)
        })
        document.querySelector(this.container).addEventListener('click', e => {
            if (e.target.classList.contains('by-btn')) {
                addProduct(e.target.value);
            }
        })
    }
}
    

class Cart extends List {
    constructor (container = '.cart', url = '/getBasket.json') {
        super(container, url);
        this.getJson()
        .then((data) => {
            console.log(data); 
        this.handleData(data.contents)
        })
    }
    _init() {
        document.querySelector('.cart-btn').addEventListener('click', e => {
            const block = document.querySelector('.cart');
            // Если класс у элемента есть, метод classList.toggle ведёт себя как classList.remove и класс у элемента убирает. А если указанного класса у элемента нет, то classList.toggle, как и classList.add, добавляет элементу этот класс.
            block.classList.toggle('invisible'); 
        })
    }
}

class ProductItem extends Item {
    constructor(element, img = '../images/product_default.jpeg') {
        super(element, img)
    }
    render() {
        return `<div class="product-item" data-id="${this.id_product}">
                    <img class='product_img' src=${this.img}>
                    <h3>${this.product_name}</h3>
                    <p>${this.price}</p> 
                    <button class="by-btn">Добавить в корзину</button>
                    </div>
                </div>`;
    }
}

class CartItem extends Item{
    render() {
        return `<div class="product-item">
        <img class='product_img' src=${this.img}>
        <h3>${this.product_name}</h3>
        <p>${this.price}</p>
        <div  class="${this.id_product}">      
        <button class="rmv-btn">удалить</button>
        </div>
    </div>`;
    }
}

listContext = {
    ProductsList: ProductItem,
    Cart: CartItem,
}

new ProductsList(new Cart());