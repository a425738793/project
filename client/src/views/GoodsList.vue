<template>
	<div>
		<nav-hrader/>

	    <nav-bard>商品列表</nav-bard>
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
	                        <dt>Price:</dt>
	                        <dd><a @click="setPrice('all')" :class="{cur: pramCheckout == 'all'}" href="javascript:void(0)">All</a></dd>
	                        <dd v-for="(item,index) in pramList" :key="index">
	                            <a @click="setPrice(index)" :class="{cur: pramCheckout == index}" href="javascript:void(0)">{{item.startPrice}} - {{item.endPrice}}</a>
	                        </dd>
	                        
	                    </dl>
	                </div>
	
	                <!-- search result accessories list -->
	                <div class="accessory-list-wrap">
	                    <div class="accessory-list col-4">
	                        <ul>
	                            <li v-for="(item,index) in goodsList" :key="index">
	                                <div class="pic">
	                                    <a href="#"><img v-lazy="'static/img/'+item.productImage" alt=""></a>
	                                </div>
	                                <div class="main">
	                                    <div class="name">{{item.productName}}</div>
	                                    <div class="price">{{item.salePrice}}</div>
	                                    <div class="btn-area">
	                                        <a href="javascript:;" @click="addCart(item.productId)" class="btn btn--m">加入购物车</a>
	                                    </div>
	                                </div>
	                            </li>
	                           
	                        </ul>
	                        <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
								</div>
	                    </div>
	                </div>
	            </div>
	        </div>
	    </div>
		<modal :mdShow="mdShow">
			<p slot="message">请先登录，否则无法加入购物车</p>
	        <div slot="btnGroup">
	            <a href="javascript:;" class="btn  btn--m" @click="mdShow = false">关闭</a>
	        </div>
		</modal>
		<modal :mdShow="mdShowCart">
			<p slot="message">加入购物车成功</p>
	        <div slot="btnGroup">
	            <a href="javascript:;" class="btn  btn--m" @click="mdShowCart = false">继续购物</a>
	            <router-link class="btn  btn--m" to="/cart">查看购物车列表</router-link>
	        </div>
		</modal>
		<footer-hrader/>
	</div>
</template>

<script>
	import NavHrader from '@/components/Header'
	import FooterHrader from '@/components/Footer'
	import NavBard from '@/components/NavBard'
	import Modal from '@/components/Modal'
	import axios from 'axios'
	export default {
		components:{
			NavHrader,
			FooterHrader,
			NavBard,
			Modal
		},
		data(){
			return {
				goodsList: {},
				sortFlag:true,
				data: [],
    			busy: true,
    			page: 1,
    			pageSize: 8,
    			mdShow:false,
    			mdShowCart:false,
				pramList: [
					{
						startPrice: 0,
						endPrice: 100
					},
					{
						startPrice: 100,
						endPrice: 500
					},
					{
						startPrice: 500,
						endPrice: 1000
					},
					{
						startPrice: 1000,
						endPrice: 2000
					}
				],
				pramCheckout:'all'
			}
		},
		created(){
			this.getGoodsList()
		},
		 methods:{
            getGoodsList(flag){
            	let sort = this.sortFlag ? 1 : -1;
                let param = {
                	sort: sort,
                	pramLevel:this.pramCheckout,
                	currentPage: this.page,
                	pageSize: this.pageSize
                }
                this.$http.get('goods/list',{params:param}).then(res=>{
                	if (flag) {
                		this.goodsList = this.goodsList.concat(res.data.result);
                		if (res.data.result == 0) {
                			this.busy = true;
                		} else{
                			this.busy = false;
                		}
                	}else{
                		console.log(res);
	                    this.goodsList = res.data.result;
	                    this.busy = false;
                	}
	                    
                })
            },
            sortGoods(){
            	this.sortFlag = !this.sortFlag;
            	this.page = 1
            	this.getGoodsList();
            },
            setPrice(index){
            	this.page = 1;
            	this.pramCheckout = index;
            	this.getGoodsList();
            },
            loadMore: function() {
		      this.busy = true;
//				console.log(1);
//				this.page++;
//				this.getGoodsList(true)
		      setTimeout(() => {
		      	this.page++;
		      	this.getGoodsList(true)
//		        for (var i = 0, j = 10; i < j; i++) {
//		          this.data.push({ name: count++ });
//		        }
//		        this.busy = false;
		      }, 1000);
		   },
		   addCart(productId){
		   	
		   	axios.post('/goods/addCart',{productId:productId}).then(res=>{
		   		console.log(res);
		   		if(res.data.status == 1){
		   			this.mdShow = true
		   		}
		   		if (res.data.status == 0) {
		   			this.mdShowCart = true
		   		}
		   	})
		   }
        }
	}
</script>

<style>
</style>
