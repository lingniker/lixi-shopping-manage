<template>
  <div class="app-container">
    <h1>用户管理</h1>
    <el-row :gutter="24">
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
          <el-form-item label="用户名称" prop="_user_name">
            <el-input
              v-model="queryParams._user_name"
              placeholder="请输入用户名称"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-table
          :data="userList"
        >
          <el-table-column label="用户编号" align="center" key="userId" prop="id"/>
          <el-table-column label="用户名称" align="center" key="user_name" prop="user_name"/>
          <el-table-column label="用户昵称" align="center" key="nick_name" prop="nick_name"/>
          <el-table-column label="手机号码" align="center" key="mobile" prop="mobile" />
          <el-table-column label="创建时间" align="center" prop="created_at" width="200">
            <template #default={row}>
              <span>{{ parseTime(row.created_at) }}</span>
            </template>
          </el-table-column>
        </el-table>

        <div class="page-box">
          <el-pagination
            background
            @current-change="currentChange"
            :current-page.sync="queryParams.current_page"
            :page-size="10"
            layout="total, prev, pager, next"
            :total="total">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { listUser, getUser } from "@/api/system/user";
import { getToken } from "@/utils/auth";

export default {
  name: "User",
  data() {
    return {
      loading: true, // 遮罩层
      total: 0, // 总条数
      userList: null, // 用户表格数据
      title: "", // 弹出层标题
      open: false, // 是否显示弹出层
      // 表单参数
      form: {},
      queryParams: { // 查询参数
        current_name: 1,
        per_page: 10,
        _user_name: undefined
      }
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
        this.userList = response.data;
        this.total = response.meta.total;
        this.loading = false;
        }
      );
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 改变页码
    currentChange (page) {
      this.queryParams.current_page = page
      this.getList()
    }
  }
};
</script>