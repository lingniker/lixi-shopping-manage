<template>
  <div class="app-container">
    <div><h1>订单信息</h1></div>
    <el-row :gutter="24">
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
          <el-form-item label="用户名称" prop="userName">
            <el-input
              v-model="queryParams.userName"
              placeholder="请输入用户名称"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="手机号码" prop="phonenumber">
            <el-input
              v-model="queryParams.phonenumber"
              placeholder="请输入手机号码"
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

        <!-- 'user_id': '1',
        'user_name': 'ling',
        'user_address_id': '1',
        'user_address_name': '深圳',
        'shop_id': '9',
        'shop_name': '商品',
        'shop_address_name': '商品地址',
        'shop_address_id': '2',
        'shop_number': '1',
        'shop_price': '100',
        'shop_price_total': '100',
        'order_status': '1',
        'order_label': '待付款', // 1待付款 2已付款
        'send_status': '1',
        'send_label': '待付款',  -->
        <el-table :data="userList">
          <el-table-column label="订单编号" align="center" key="id" prop="id" />
          <!-- <el-table-column label="用户编号" align="center" key="user_id" prop="user_id" /> -->
          <el-table-column label="用户名称" align="center" key="user_name" prop="user_name" />
          <!-- <el-table-column label="商品编号" align="center" key="shop_id" prop="shop_id" /> -->
          <el-table-column label="商品名称" align="center" key="shop_name" prop="shop_name" />
          <el-table-column label="商品数量" align="center" key="shop_number" prop="shop_number" />
          <el-table-column label="商品单价" align="center" key="shop_price" prop="shop_price" />
          <el-table-column label="商品总价" align="center" key="shop_price_total" prop="shop_price_total" />
          <el-table-column label="付款状态" align="center" key="order_label" prop="order_label">
            <template #default={row}>
              <span :class="'status-' + row.order_status">{{row.order_label }}</span>
            </template>
          </el-table-column>
          <el-table-column label="货物状态" align="center" key="send_label" prop="send_label">
            <template #default={row}>
              <span :class="'status-' + row.send_status">{{row.send_label }}</span>
            </template>
          </el-table-column>
          <el-table-column label="商品地址" align="center" key="shop_address_name" prop="shop_address_name" />
          <el-table-column label="用户地址" align="center" key="user_address_name" prop="user_address_name" />
          <el-table-column label="创建时间" align="center" prop="created_at" width="160">
            <template #default={row}>
              <span>{{ parseTime(row.created_at) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="160"
            class-name="small-padding fixed-width"
            fixed="right"
          >
            <template #default={row} >
              <div>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleUpdate(row)"
                >修改</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        /> -->
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="订单编号" prop="id">
              <el-input v-model="form.id" placeholder="请输入订单编号" maxlength="30" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名称" prop="user_name">
              <el-input v-model="form.user_name"  maxlength="11" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品名称" prop="shop_name">
              <el-input v-model="form.shop_name" maxlength="50" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="状态">
              <el-radio-group v-model="form.send_status">
                <el-radio-button
                  v-for="dict in statusOptions"
                  :key="dict.value"
                  :label="dict.value"
                  :disabled="dict.disabled"
                  :class="'status-' + dict.value"
                >{{dict.label}}</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作">
              <el-button @click="handleSeed" :disabled="form.send_status != '2'">
                发货
              </el-button>
              <el-button @click="handleSeedComplete" :disabled="form.send_status != '3'">
                完成
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listUser, getUser, update } from "@/api/system/order";
import { getToken } from "@/utils/auth";
import { ElMessageBox } from 'element-plus'

export default {
  name: "Order",
  data() {
    return {
      loading: true, // 遮罩层
      total: 0, // 总条数
      userList: null, // 用户表格数据
      title: "", // 弹出层标题
      open: false, // 是否显示弹出层
      statusOptions: [ // 状态数据字典
        {
          value: '1',
          label: '待付款',
          disabled: true
        },
        {
          value: '2',
          label: '待发货',
          disabled: true
        },
        {
          value: '3',
          label: '待收货',
          disabled: true
        },
        {
          value: '4',
          label: '完成',
          disabled: true
        }
      ],
      form: {},// 表单参数
      queryParams: { // 查询参数
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined
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
          // this.userList = response.rows;
          this.userList = response.data;
          this.total = response.meta.total;
          this.loading = false;
        }
      );
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        userId: undefined,
        deptId: undefined,
        userName: undefined,
        nickName: undefined,
        password: undefined,
        phonenumber: undefined,
        email: undefined,
        sex: undefined,
        status: "0",
        remark: undefined,
        postIds: [],
        roleIds: []
      };
      // this.resetForm("form");
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
    /** 修改按钮操作 */
    handleUpdate(row) {
      // this.reset();
      this.form = row;
      this.open = true;
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$prompt('请输入"' + row.userName + '"的新密码', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        inputPattern: /^.{5,20}$/,
        inputErrorMessage: "用户密码长度必须介于 5 和 20 之间",
      }).then(({ value }) => {
          resetUserPwd(row.userId, value).then(response => {
            this.msgSuccess("修改成功，新密码是：" + value);
          });
        }).catch(() => {});
    },
    /** 分配角色操作 */
    handleAuthRole: function(row) {
      const userId = row.userId;
      this.$router.push("/system/user-auth/role/" + userId);
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.userId != undefined) {
            updateUser(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addUser(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    handleSeed(done) {
      ElMessageBox.confirm('物品是否已经发货,确认改变订单状态？')
      .then((_) => {
        update(this.form).then((res)=>{
          this.open = false
          this.getList()
        })
      })
      .catch((_) => {})
    },
    handleSeedComplete() {
      ElMessageBox.confirm('物品是否已经送达用户手中,确认改变订单状态？')
      .then((_) => {
        update(this.form).then((res)=>{
          this.open = false
          this.getList()
        })
      })
      .catch((_) => {})
    }
  }
};
</script>

<style lang="scss">
.status-1 {
  color: #409eff;
  .el-radio-button__original-radio:disabled + .el-radio-button__inner {
    color: #409eff;
  }
}
.status-2 {
  color: #67c23a;
  .el-radio-button__original-radio:disabled + .el-radio-button__inner {
    color: #67c23a;
  }
}
.status-3 {
  color: #e6a23c;
  .el-radio-button__original-radio:disabled + .el-radio-button__inner { 
    color: #e6a23c;
  }
}
.status-4 {
  color: #f56c6c;
  .el-radio-button__original-radio:disabled + .el-radio-button__inner { 
    color: #f56c6c;
  }
}
</style>