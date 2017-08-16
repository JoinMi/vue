<template>
<div>
  <app-header></app-header>
  <nav-bread>商品</nav-bread>
  <div class="accessory-result-page accessory-page">
    <div class="container">
      <div class="filter-nav">
        <span class="sortby">Sort by:</span>
        <a href="javascript:void(0)" class="default cur">Default</a>
        <a href="javascript:void(0)" class="price" @click="sortGoods">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
        <a href="javascript:void(0)" class="filterby stopPop">Filter by</a>
      </div>
      <div class="accessory-result">
        <!-- filter -->
        <div class="filter stopPop" id="filter">
          <dl class="filter-price">
            <dt>价格:</dt>
            <dd><a href="javascript:void(0)" :class="{'cur': priceChecked == 'all'}" @click="setPriceFilter('all')">All</a></dd>
            <dd v-for="(price, index) in priceFilter">
              <a href="javascript:void(0)" @click="setPriceFilter(index)" :class="{'cur':priceChecked === index}">{{price.statePrice}} - {{price.endPrice}}</a>
            </dd>
          </dl>
        </div>

        <!-- search result accessories list -->
        <div class="accessory-list-wrap">
          <div class="accessory-list col-4">
            <ul>
              <li v-for="item in GoodsList">
                <div class="pic">
                  <a href="#"><img v-lazy="'/static/img/' + item.productImage" alt=""></a>
                </div>
                <div class="main">
                  <div class="name">{{item.productName}}</div>
                  <div class="price">{{item.salePrice}}</div>
                  <div class="btn-area">
                    <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                  </div>
                </div>
              </li>
            </ul>
            <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="20"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <app-footer></app-footer>
  <modal :mdShow="mdShow">
    <p slot="message">请先登录否则无法加入购物车</p>
    <div slot="btnGroup">
      <a href="javescript:;" class="btn-login" @click="mdShow = false">关闭</a>
    </div>
  </modal>
  <modal :mdShow="mdShowCart">
    <p slot="message">加入购物车成功</p>
    <div slot="btnGroup">
      <a href="javescript:;" class="btn btn--m" @click="mdShowCart = false">关闭</a>
      <router-link class="btn btn--m" to="/Cart">查看购物车</router-link>
    </div>
  </modal>
</div>
</template>
<script>
  import AppHeader from '@/components/Header'
  import AppFooter from '@/components/Footer'
  import NavBread from '@/components/NavBread'
  import Modal from '@/components/Modal'
  import axios from 'axios'
  export default {
    name: 'GoodsList',
    data () {
      return {
        GoodsList: Array,
        sortFlag: true,
        priceChecked: 'all',
        busy: true,
        lock: false,
        mdShow: false,
        mdShowCart: false,
        page: 1,
        pagesize: 8,
        priceFilter: [
          {
            statePrice: '0.00',
            endPrice: '100.00'
          },
          {
            statePrice: '100.00',
            endPrice: '500.00'
          },
          {
            statePrice: '500.00',
            endPrice: '1000.00'
          },
          {
            statePrice: '1000.00',
            endPrice: '2000.00'
          },
          {
            statePrice: '2000.00',
            endPrice: '4000.00'
          }
        ]
      }
    },
    components: {
      AppHeader,
      AppFooter,
      NavBread,
      Modal
    },
    mounted: function () {
      this.getGoodsList()
    },
    methods: {
      getGoodsList () {
        console.log(1)
        let param = {
          sort: this.sortFlag ? 1 : -1,
          priceLevel: this.priceChecked,
          page: this.page,
          pagesize: this.pagesize
        }
        axios.get('/goods/list', {params: param}).then((result) => {
          let res = result.data.result
          if (this.lock) {
            if (res) {
              console.log(res)
              this.GoodsList = this.GoodsList.concat(res)
            }
            this.busy = false
            if (res.length < this.pagesize) {
              console.log(this.pagesize)
              this.busy = true
              return
            }
          } else {
            this.GoodsList = res
            this.lock = true
            this.busy = false
          }
        })
      },
      addCart (productId) {
        axios.post('/goods/addCart', {productId}).then((res) => {
          console.log(res)
          if (res.data.status === 0 || res.data.status === '0') {
            this.mdShowCart = true
          } else {
            this.mdShow = true
          }
        })
      },
      closeModal () {
        this.mdShow = false
      },
      sortGoods () {
        this.sortFlag = !this.sortFlag
        this.page = 1
        this.GoodsList = []
        this.getGoodsList()
      },
      setPriceFilter (index) {
        console.log(index)
        this.page = 1
        this.GoodsList = []
        this.priceChecked = index
        this.getGoodsList()
        this.busy = false
      },
      loadMore () {
        if (this.busy === true) {
          return
        }
        this.busy = true
        setTimeout(() => {
          this.page++
          this.getGoodsList()
          console.log(111)
        }, 500)
      }
    }
  }
</script>
<style>
</style>
