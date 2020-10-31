<template>
  <div>
    <div class="coupon">
      <div class="couponbg" :style="{background: replyContent.card_color ||  replyContent.color}">
        <div class="coupon_head">
          <div class="coupon_head_left">
            <img :src="replyContent.card_logo || replyContent.logo" />
          </div>
          <div class="coupon_head_right">
            <p>{{replyContent.card_title || replyContent.title}}</p>
            <p>{{replyContent.brand_name || replyContent.brand_name}}</p>
          </div>
        </div>
          <div class="coupon_body">微信卡包</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["replyContent"]
};
</script>

<style lang="scss" scoped>
.coupon {
  width: 150px;
  height: 94px;
  display: inline-flex;
  position: relative;
  border: 1px solid rgb(230, 227, 227);
  border-radius: 2px;
  overflow: hidden;
  cursor: pointer;
}
.couponbg {
  width: 150px;
  height: 90px;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 2px;
}
.coupon_head {
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  box-sizing: border-box;
}
.coupon_head_left {
  width: 40px;
  height: 40px;
  border-radius: 100%;
  overflow: hidden;
  flex-shrink: 0;
  img {
    width: 100%;
    height: 100%;
  }
}
.coupon_head_right {
  width: calc(100% - 40px);
  margin-left: 4px;
  p {
    color: #fff;
    font-size: 12px;
    padding: 0;
    margin: 0;
    &:nth-of-type(2){
      margin-top: -10px;;
      font-size: 10px;
      color: rgb(255, 255, 255);
    }
  }
}
.coupon_body {
  width: 100%;
  height: 22px;
  line-height: 22px;
  background: #fff;
  font-size: 12px;
  padding: 0 10px;
}
</style>