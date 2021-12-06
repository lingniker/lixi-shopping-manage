<template>
  <div class="app-container">
    <!--用户数据-->
      <!-- 部门数据 -->
    <div><h1>地址信息</h1></div>
    <el-row :gutter="24">
      <el-col :span="24" :xs="24">
        <el-table :data="userList">
          <el-table-column label="地址编号" align="center" key="id" prop="id" />
          <el-table-column label="地址名称" align="center" key="address_name" prop="address_name" :show-overflow-tooltip="true" />
          <el-table-column label="用户编号" align="center" key="user_id" prop="user_id" :show-overflow-tooltip="true" />
          <el-table-column label="商品编号" align="center" key="shop_id" prop="shop_id" :show-overflow-tooltip="true" />
          <el-table-column label="地址类型" align="center" key="type_describe" prop="type_describe" width="120" />
          <el-table-column label="创建时间" align="center" prop="created_at" width="180">
            <template #default={row}>
              <span>{{ parseTime(row.created_at) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { listUser } from "@/api/system/address";
import { getToken } from "@/utils/auth";

export default {
  name: "Address",
  data() {
    return {
      loading: true, // 遮罩层
      total: 0, // 总条数
      userList: null, // 用户表格数据
      title: "", // 弹出层标题
      open: false, // 是否显示弹出层
      form: {}, // 表单参数
      queryParams: { // 查询参数
        pageNum: 1,
        pageSize: 10,
        userName: undefined
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      listUser(this.queryParams).then(response => {
          this.userList = response;
          // this.total = response.meta.total;
          this.loading = false;
        }
      )
    }
  }
};
</script>