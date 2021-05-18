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
            // console.log(this.constructor.name)
            // console.log(this.list[this.constructor.name])
            
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
                console.log(e.target)
                this.cart.addProduct(e.target);
            }
        })
    }
}
    

class Cart extends List {
    constructor (container = '.cart', url = '/getBasket.json') {
        super(container, url);
        this.getJson()
        .then((data) => { 
        this.handleData(data.contents)
        })
    }
    addProduct(element){
        this.getJson(`${API_URL}/addToBasket.json`)
          .then(data => {
            if(data.result === 1){
                console.log(element);
              let productId = +element.dataset['id'];
              let find = this.allProducts.find(product => product.id_product === productId);
              console.log(find);
              if(find){
                find.quantity++;
                this._updateCart(find);
              } else {
                let product = {
                  id_product: productId,
                  price: +element.dataset['price'],
                  product_name: element.dataset['name'],
                  quantity: 1
                };
                this.goods = [product];
                // далее вызывая метод render, мы добавим в allProducts только его, тем самым избегая лишнего перерендера.
                this.render();
              }
            } else {
              alert('Error');
            }
          })
      }
      removeProduct(element){
        this.getJson(`${API_URL}/deleteFromBasket.json`)
          .then(data => {
            if(data.result === 1){
              let productId = +element.dataset['id'];
              let find = this.allProducts.find(product => product.id_product === productId);
              if(find.quantity > 1){ // если товара > 1, то уменьшаем количество на 1
                find.quantity--;
                this._updateCart(find);
              } else {
                this.allProducts.splice(this.allProducts.indexOf(find), 1);
                document.querySelector(`.cart-item[data-id="${productId}"]`).remove();
              }
            } else {
              alert('Error');
            }
          })
      }
      _updateCart(product){
          //console.log(product.id)
        let block = document.querySelector(`.cart-item[data-id="${product.id_product}"]`);
        block.querySelector('.quantity').textContent = `Количество: ${product.quantity}`;
        block.querySelector('.price').textContent = `${product.quantity * product.price}`;
      }
    _init() {
        document.querySelector('.cart-btn').addEventListener('click', e => {
            const block = document.querySelector('.cart');
            // Если класс у элемента есть, метод classList.toggle ведёт себя как classList.remove и класс у элемента убирает. А если указанного класса у элемента нет, то classList.toggle, как и classList.add, добавляет элементу этот класс.
            block.classList.toggle('invisible'); 
        })
        document.querySelector(this.container).addEventListener('click', e => {
            if(e.target.classList.contains('rmv-btn')){
              console.log(e.target);
              this.removeProduct(e.target);
            }
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
                    <button class="by-btn"  data-id="${this.id_product}"
                                            data-name="${this.product_name}"
                                            data-price="${this.price}">
                        Добавить в корзину</button>
                    </div>
                </div>`;
    }
}

class CartItem extends Item{
    constructor(element, img = '../images/product_default.jpeg'){
    super(element, img);
    this.quantity = element.quantity;
  }
    render() {
        return `<div class="cart-item" data-id="${this.id_product}">
        <img class='product_img' src=${this.img}>
        <h3 data-name="">${this.product_name}</h3>
        <p class="price">${this.price}</p>
        <p class="quantity">Количество: ${this.quantity}</p>
        <div  class="${this.id_product}">      
        <button class="rmv-btn" data-id="${this.id_product}">удалить</button>
        </div>
    </div>`;
    }
}

listContext = {
    ProductsList: ProductItem,
    Cart: CartItem,
}

new ProductsList(new Cart());