Vue.component('cart', {
    data() {
        return {
            cartURL:'/getBasket.json',
            addCartURL: '/addToBasket.json',
            removeCartURL: '/deleteFromBasket.json',
            cartProducts: [],
            imgProduct: '../images/product_default.jpeg',
            visible: false,
        }
    },
    methods: {
        addToBasket(value) {
            this.$parent.getJson(`${API}${this.addCartURL}`)
            .then((data) => {
                if (data.result === 1) {
                    let find = this.cartProducts.find(el => el.id_product === value.id_product);
                    if (find) {
                        find.quantity++;
                    } else {                        
                        let product = Object.assign({quantity: 1}, value);
                        this.cartProducts.push(product)
                    }
                }
            })
        },
        remove(value) {
            this.$parent.getJson(`${API}${this.removeCartURL}`)
            .then((data) => {
                if (data.result === 1) {
                    if (value.quantity > 1) {
                        value.quantity--;
                    } else {                        
                        this.cartProducts.splice(this.cartProducts.indexOf(value), 1)
                    }
                } else {
                    alert('Error');
                }
            })
        }
        
    },
    mounted() {
        this.$parent.getJson(`${API}${this.cartURL}`)
        .then((data) => data.contents.forEach((element) => this.cartProducts.push(element)))
    },
    template:
        `<div>
            <button class="cart-btn" @click="visible=!visible">корзина</button>
               <div v-show="visible" class="cart">
                    <p v-if="cartProducts.length===0" style="text-align: center">Корзина пуста!</p>
                    <cart-products v-for="item of cartProducts" :key="item.id_product" :img="imgProduct" :product="item" @remove="remove"></cart-products>
               </div>
        </div>`,
})

Vue.component('cart-products', {
    props: ['product', 'img'],
    template: `
        <div class="cart-item">
            <div class="product-name">{{product.product_name}}</div>
            <div class="product-quantity">{{product.quantity}}</div>
            <div class="product-price">{{product.price * product.quantity}}</div>
            <button @click="$emit('remove', product)">удалить товар</button>
        </div>
    `
})