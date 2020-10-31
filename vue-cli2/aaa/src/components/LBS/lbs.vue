<template>
  <div class="table">
    <div class="crumbs">
      <h2>LBS地理服务</h2>
    </div>
    <!-- 地理位置 -->
    <br />
    <div class="container">
      <v-map :lbs="lbs"></v-map>
    </div>
  </div>
</template>

<script>
import vMap from "./map";
export default {
  components: {
    vMap
  },
  data() {
    return {
      lbs: ""
    };
  },
  created() {
    if (this.$route.params.lbs) {
      this.lbs = this.$route.params.lbs;
    } else {
      this.lbs = "";
    }
  }
};
</script>

<style scoped>
.map {
  width: 100%;
  height: 600px;
}
/* -------------- */
.input {
  width: 250px;
  display: inline-block;
}
/* ------------------ */
.pagination {
  display: flex;
  justify-content: flex-end;
}
/* -------------- */


.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
.card {
  width: 100%;
  height: 100%;
  border: 1px solid #e4e7ed;
  padding: 10px;
  display: flex;
}
.cardItem {
  width: 150px;
  margin-right: 10px;
}
.sumit {
  text-align: center;
  margin-top: 20px;
}
</style>

