

let API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

const getRequest = (url, cb) => {
    fetch(url)
    .then(result => result.json())
    .then((data) => {
    return cb(data)})
    .catch((error) => new Error(`maybe internet is over? or ${error}`));
};

class GoodList {
    constructor (container = '.container') {
        this.container = container;
        this._goods = []; // data
        this._allGoods = []; // массив экземпляров товаров на основе goods;
    
    //this._fetchGoodsPromise();
    this._fetchGoods();

    }
    
    _fetchGoods() {
        getRequest(`${API_URL}/catalogData.json`, (data) => {
            this._goods = data;
            this._render();
        });
    }

    _fetchGoodsPromise() {
        let promise = new Promise((resolve, reject) => {
           let xhr = new XMLHttpRequest();
           xhr.open('GET', `${API_URL}/catalogData.json`, true);
           let data;
           xhr.onreadystatechange = () => {
               if (xhr.readyState === 4) {
                   if (xhr.readyState === 200) {
                       console.log('Error in my code');
                   } else {
                       // console.log(xhr.responseText);
                       resolve(xhr.responseText);
                   }
               }
           };
           xhr.send();
        })
        promise.then((data) => JSON.parse(data))
        .then((data) => {
            this._goods = data;
            this._render();
        });        
    }   

    _render() {
        const block = document.querySelector(this.container);
        this._goods.forEach(element => {
            const productObject = new GoodItem(element);
            this._allGoods.push(productObject);
            block.insertAdjacentHTML('beforeend', productObject.render());
        });
    }

    totalPrice() {
        let priceCount = 0;
        this._allGoods.forEach((product) => priceCount += product.price);
         console.log(priceCount);
        return priceCount;
    }
}


class GoodItem {
    constructor(product, img = '../images/product_default.jpeg') {
        this.product_name = product.product_name;
        this.price = product.price;
        this.id_product = product.id_product;
        this.img = img;
    }

    render() {
        return `<div class="product-item">
        <img class='product_img' src=${this.img}>
        <h3>${this.product_name}</h3>
        <p>${this.price}</p>
        <div  class="${this.id_product}">      
        <button class="by-btn">Добавить в корзину</button>
        </div>
    </div>`;
    }
}

//Bascet;

class Bascet extends GoodList {

    constructor(container = '.bascet') {
        super(container);
        this.goods = [];
        this._pushBascetButton(); 
        this._addToBascet();
    };

    _addToBascet = () => {
        setTimeout(() => {
            const goods = document.querySelectorAll('.by-btn');
    
            const addBascet = goods.forEach((good) => good.addEventListener('click', (event) => {
                const id = Number(event.currentTarget.parentNode.className);
                //console.log(id);
                const product = goodList._allGoods.filter((good) => good.id_product === id)
                this.goods.push(...product);
                //console.log(bascet.goods);
            }))
        }, 100);
    };
    _pushBascetButton () {
        const bascetBtn = document.querySelector('.btn-cart');
        const productInBascet = document.querySelector('.products-in-bascet')
        const products = document.querySelector('.products');
        bascetBtn.addEventListener('click', (event) => {
        products.style.display = 'none';
        console.log(this.goods);
        this.goods.forEach((element) => {
            console.log(element);
            const addProduct = new ItemInBascet(element);
            productInBascet.insertAdjacentHTML("beforeend", addProduct.render())
        })
        
        
        });
    };
}

class ItemInBascet extends GoodItem {
    constructor (product, count = 1) {
        super(product)
        this.count = product.count;
    }

    totalPrice() {
       return this.price * this.count;
    }

    render() {
        return `<div class="product-in-basket">
            <h3>${this.product_name}</h3>
            <p>${this.price}</p>`
    }
}

    
const goodList = new GoodList('.products');
const bascet = new Bascet('.bascet');

