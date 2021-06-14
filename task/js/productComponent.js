Vue.component('products', {
    data: function() {
        return {
            cataloURL: '/catalogData.json',
            products: [],
            filtered: [],
            imgProduct: '../images/product_default.jpeg',

        }
    },
    mounted() {
        this.$parent.getJson(`${API}${this.cataloURL}`)
        .then((data) => {
            data.forEach(element => {
                this.products.push(element);
                this.filtered.push(element);
            });
        })
    },
    methods: {
        console() {
            console.log('www');
        },
        filter(){
            let regexp = new RegExp(this.userSearch, 'i');
            this.filtered = this.products.filter(el => regexp.test(el.product_name));
        }
    },
    template:
        `<div class="products">
            <product v-for="item of filtered" :key="item.id_product" :img="imgProduct" :product="item"></product>
        </div>`,
})


Vue.component('product', {
    props: ['product', 'img'],
    template:`
    <div class="product-item">
        <img :src="img" alt="" class="product-img">
        <div class="product-props">
            <h3>{{product.product_name}}</h3>
            <h3>{{product.price}}</h3>
            <button class="add-btn" @click="$root.$refs.cart.addToBasket(product)">Добавить в корзину</button>

        </div>
    </div>
    `
})