<template>
  <div class="app-container">
    <div><h1>操作信息</h1></div>
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="用户名称" prop="_user_name">
        <el-input
          v-model="queryParams._user_name"
          placeholder="请输入用户名称"
          clearable
          style="width: 240px;"
          size="small"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table ref="tables" v-loading="loading" :data="list">
      <el-table-column label="访问编号" align="center" prop="id" />
      <el-table-column label="访问类型" align="center" prop="login_type"/>
      <el-table-column label="用户名称" align="center" prop="user_name"/>
      <el-table-column label="登录地址" align="center" prop="ip" width="130" />
      <el-table-column label="浏览器" align="center" prop="browser_type" :show-overflow-tooltip="true" />
      <el-table-column label="操作系统" align="center" prop="system" />
      <el-table-column label="操作信息" align="center" prop="oper_massage" />
      <el-table-column label="操作日期" align="center" prop="created_at"  width="180">
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
  </div>
</template>

<script>
import { list } from "@/api/monitor/operlog";

export default {
  name: "Logininfor",
  data() {
    return {
      loading: true, // 遮罩层
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      // 查询参数
      queryParams: {
        current_page: 1,
        per_page: 10,
        _user_name: undefined
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询登录日志列表 */
    getList() {
      this.loading = true;
      list(this.queryParams).then(response => {
          this.list = response.data;
          this.total = response.meta.total;
          this.loading = false;
        }
      );
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.current_page = 1;
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
