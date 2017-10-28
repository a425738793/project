<template>
    <div>
    <nav-hrader/>
    <nav-bard><span>确认订单</span></nav-bard>
  <div class="container">
    <div class="page-title-normal">
      <h2 class="page-title-h2"><span>check out</span></h2>
    </div>
    <!-- 进度条 -->
    <div class="check-step">
      <ul>
        <li class="cur"><span>Confirm</span> address</li>
        <li class="cur"><span>View your</span> order</li>
        <li class="cur"><span>Make</span> payment</li>
        <li class="cur"><span>Order</span> confirmation</li>
      </ul>
    </div>

    <div class="order-create">
      <div class="order-create-pic"><img src="/static/img/ok-2.png" alt=""></div>
      <div class="order-create-main">
        <h3>Congratulations! <br>Your order is under processing!</h3>
        <p>
          <span>Order ID：{{orderId}}</span>
          <span>Order total：{{orderTotal}}</span>
        </p>
        <div class="order-create-btn-wrap">
          <div class="btn-l-wrap">
            <a href="javascript:;" class="btn btn--m">Cart List</a>
          </div>
          <div class="btn-r-wrap">
            <a href="javascript:;" class="btn btn--m">Goods List</a>
          </div>
        </div>
      </div>
    </div>
  </div>
    <footer-hrader/>
</div>
</template>

<script>
	import NavHrader from '@/components/Header'
	import FooterHrader from '@/components/Footer'
	import NavBard from '@/components/NavBard'
    export default {
        components:{
            NavHrader,
			FooterHrader,
			NavBard,
        },
        data(){
            return{
                orderId : '',
                orderTotal :''
            }
        },
        created(){
            this.init()
        },
        methods:{
            init(){
                var orderId = this.$route.query.orderId;
                if(!orderId){
                    return;
                }
                this.$http.get('/users/orderDetail',{
                    params:{
                        orderId:orderId
                    }
                }).then(response=>{
                    let res = response.data;
                    if(res.status == 0){
                        this.orderId = res.result.orderId,
                        this.orderTotal = res.result.orderTotal
                    }
                })
            }
        }
    }
</script>

<style>
</style>