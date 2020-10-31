<template>
  <div class="slide">
    <div class="icon" @click="showDown()">
      <img src="../../assets/down.png" />
    </div>

    <el-dialog title="预约下载中心" :visible.sync="dialogVisibles" width="40%" center>
      <div class="pagination">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>
      <el-table :data="tableData" :header-cell-style="{background:'#f9f9f9'}" style="width: 100%" v-loading="loading">
        <el-table-column prop="status" label="状态" >
          <template slot-scope="scope">
            <span v-html="showStatus(scope.row.status)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" ></el-table-column>
        <el-table-column prop="url" label="操作" >
          <template slot-scope="scope">
            <!-- <el-button type="primary" v-if="scope.row.status == '1'"  icon="el-icon-upload" @click="iexport(scope.row)">导出数据</el-button> -->
            <div class="zip" v-show="scope.row.status == 1" @click="down(scope.row)">
              <img src="../../assets/zip.png">
            </div>
            <div class="zips" v-show="scope.row.status == 0">
              <img src="../../assets/zips.png">
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisibles: false
    };
  },
  methods: {
    showDown() {
      this.dialogVisibles = true;
    }
  }
};
</script>

<style scoped>
.slide {
  width: 40px;
  height: 100px;
  position: fixed;
  bottom: 100px;
  right: 20px;
  z-index: 999;
}
.icon {
  width: 40px;
  height: 40px;
  background: #66b1ff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  cursor: pointer;
}
.icon img {
  width: 60%;
  height: 60%;
}
</style>