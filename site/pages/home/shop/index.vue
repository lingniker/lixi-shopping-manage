<template>
  <div class="app-container">
    <div><h1>商品信息</h1></div>
    <el-row :gutter="24">
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
          <el-form-item label="商品名称" prop="shop_name">
            <el-input
              v-model="queryParams.shop_name"
              placeholder="请输入商品名称"
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
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增</el-button>
          </el-col>
        </el-row>
      <!-- table.string('shop_name', 80).notNullable()
      table.string('img_path', 180).notNullable()
      table.string('describe', 180).notNullable()
      table.string('stock', 80).notNullable()
      table.string('sales_volume', 80).notNullable()
      table.string('sales_status', 80).notNullable() // 1在售  2下架  3售完
      table.string('sales_status_describe', 180).notNullable()
      table.string('price', 80).notNullable() -->
        <el-table :data="userList">
          <el-table-column label="商品编号" align="center" key="id" prop="id" />
          <el-table-column label="商品名称" align="center" key="shop_name" prop="shop_name" :show-overflow-tooltip="true" />
          <el-table-column label="商品库存" align="center" key="stock" prop="stock" :show-overflow-tooltip="true" />
          <el-table-column label="商品销售" align="center" key="sales_volume" prop="sales_volume" :show-overflow-tooltip="true" />
          <el-table-column label="商品状态" align="center" key="sales_status_label" prop="sales_status_label" width="120" />
          <el-table-column label="价格" align="center" key="price" prop="price" width="120" />
          <el-table-column label="创建时间" align="center" prop="created_at" width="180">
            <template #default={row}>
              <span>{{ parseTime(row.created_at) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
            <template #default={row} >
              <div>
                <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(row)">修改</el-button>
              </div>
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

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="商品名称" prop="shop_name">
              <el-input v-model="form.shop_name" placeholder="请输入商品名称" maxlength="30" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="商品库存" prop="stock">
              <el-input-number v-model="form.stock" placeholder="请输入商品库存" maxlength="11" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="价格" prop="price">
              <el-input-number v-model="form.price" placeholder="请输入价格" maxlength="50" controls-position="right" :min="0"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="发货地址" prop="address_name">
              <el-input v-model="form.address_name" placeholder="请输入发货地址" maxlength="11" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="sales_status_label">
              <el-input v-model="form.sales_status_label" placeholder="请输入状态" maxlength="50" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" style="text-align:right;">
            图片上传
          </el-col>
          <el-col :span="12">
            <el-upload
              class="avatar-uploader"
              action="http://127.0.0.1:8035/img-upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src=" 'http://127.0.0.1:8035/img/'+ imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="商品描述" prop="describe">
              <el-input v-model="form.describe" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listUser, create, update } from "@/api/system/shop";
import { getToken } from "@/utils/auth";

export default {
  name: "Shop",
  data() {
    return {
      loading: true, // 遮罩层
      total: 0, // 总条数
      userList: null, // 用户表格数据
      title: "", // 弹出层标题
      open: false, // 是否显示弹出层
      form: { // 表单参数
        shop_name: undefined,
        img_path: undefined,
        describe: undefined,
        stock: undefined,
        price: undefined,
        sales_volume: undefined,
        sales_status: '1',
        sales_status_label: '在售',
        address_name: '深圳',
        address_id: '1',
      },
      queryParams: { // 查询参数
        current_page: 1,
        per_page: 10,
        shop_name: undefined
      },
      rules: { // 表单校验
        shop_name: [
          { required: true, message: "商品名称不能为空", trigger: "blur" },
          { min: 2, max: 20, message: '用户名称长度必须介于 2 和 20 之间', trigger: 'blur' }
        ],
        describe: [{ required: true, message: "商品描述不能为空", trigger: "blur" }],
        stock: [{ required: true, message: "库存数不能为空", trigger: "blur" }],
        price: [{ required: true, message: "'价格不能为空", trigger: "blur" }]
      },
      imageUrl: ''
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
          console.log('response.data.data.meta.total', response.meta.total)
          this.total = response.meta.total;
          this.loading = false;
        }
      );
    },
    // 取消按钮
    cancel() {
      this.open = false;
      // this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        shop_name: undefined,
        img_path: undefined,
        describe: undefined,
        stock: undefined,
        price: undefined,
        sales_volume: undefined,
        sales_status: '1',
        sales_status_label: '在售',
        address_name: '深圳',
        address_id: '1'
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.current_page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      setTimeout(()=>{
        this.form = { ...row };
        this.imageUrl = row.img_path
      },0)
      this.open = true
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            console.log('修改上传')
            var query = { ...this.form }
            if (this.imageUrl) {
              query.img_path = this.imageUrl
              update(query).then(response => {
                // this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            } else {
              alert('没有图片')
            }
          } else {
            var query = { ...this.form }
            if (this.imageUrl) {
              query.img_path = this.imageUrl
              create(query).then(response => {
                // this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            } else {
              alert('没有图片')
            }
          }
        }
      });
    },
    // 图片上传成功
    handleAvatarSuccess(res, file) {
      this.imageUrl = res.name.fileName
    },
    // 图片上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    // 改变页码
    currentChange (page) {
      this.queryParams.current_page = page
      this.getList()
    }
  }
};
</script>

<style lang="scss">
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    margin-bottom: 20px;
    margin-left: 10px;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .page-container .content ul.el-pager {
    margin: 0px !important;
  }
  .page-container .content .page  .el-pagination {
    text-align: end;
  }
  .page-box{
    padding:  20px 0;
    text-align: right;
  }
</style>

<style scoped lang="scss">
 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>