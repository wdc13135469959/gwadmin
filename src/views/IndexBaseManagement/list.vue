<template>
  <div class="custom-tree-container">
    <div class="app-container">
      <div class="block" style="margin-top: 10px">
        <div style="margin: 10px 0">
          <el-button type="primary" icon="el-icon-plus" @click="handleCreate(null, 'ruleForm')" >新建</el-button>
        </div>
        <el-tree
          :data="data"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <img src="../../../public/images/wenjian.png" alt="" width="16px">
            <span>{{ node.label }}</span>
            <span>
              <!--  @click="() => append(data)"-->
              <el-button
                type="text"
                icon="el-icon-plus"
                style="color: #0181FF"
                @click="handleCreate(node, 'ruleForm')"
              />
              <el-button
                type="text"
                icon="el-icon-edit"
                style="color: #E6A23C"
                @click="handleUpdate(node, 'ruleForm')"
              />
              <el-button
                type="text"
                icon="el-icon-delete"
                style="color: red"
                @click="() => remove(node, data)"
              />
            </span>
          </span>
        </el-tree>
      </div>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="60%"
      center
      @close="resetForm('ruleForm')"
      :title="textMap[dialogStatus]"
    >
      <el-row>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm"  :label-position="left" label-width="100px" class="demo-ruleForm" style="margin-top: 30px">
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="指标编码：" prop="date1">
                <el-input v-model="ruleForm.date1"></el-input>
              </el-form-item>
              <el-form-item label="指标名称：" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
              </el-form-item>
              <el-form-item label="考核对象：" prop="region">
                <el-select v-model="ruleForm.region" placeholder="--请选择--" style="width: 100%">
                  <el-option v-for="item in needcontent" :key="item.Code" :label="item.CodeName" :value="item.Code"/>
                </el-select>
              </el-form-item>
              <el-form-item label="所属父对象：" prop="duixiang">
                <div v-if="treeData.length>0">
                  <a-tree-select
                    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                    :treeData="treeData"
                    placeholder="请选择父对象"
                    treeDefaultExpandAll
                    v-model="value"
                    disabled
                  >
                  </a-tree-select>
                </div>
              </el-form-item>
              <el-form-item label="得分计算公式结构化：" prop="count">
                <el-input type="textarea" v-model="ruleForm.count" placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item label="得分计算公式非结构化：" prop="date2">
                <el-input type="textarea" v-model="ruleForm.date2" placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item label="数据资料来源：" prop="desc">
                <el-input type="textarea" v-model="ruleForm.desc"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light" style="margin-left: 40px">
              <el-form-item label="排序：" prop="calculation" :rules="[
              { required: true, message: '排序不能为空'},
              { type: 'number', message: '排序必须为数字值'}
            ]">
                <el-input v-model.number="ruleForm.calculation"></el-input>
              </el-form-item>
              <el-form-item label="级别：" prop="staged">
                <el-select v-model="ruleForm.staged" placeholder="--请选择--" style="width: 100%">
                  <el-option v-for="item in jibie" :key="item.Code" :label="item.CodeName" :value="item.Code"/>
                </el-select>
              </el-form-item>
              <el-form-item label="分值：" prop="defen">
                <el-input  v-model="ruleForm.defen" placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item label="启用状态：" prop="state">
                <el-checkbox-group v-model="ruleForm.state">
                  <el-checkbox  @change="change"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="指标说明：" prop="xishu">
                <el-input type="textarea" v-model="ruleForm.xishu" placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item label="接口调用地址及参数:" prop="type">
                <el-input type="textarea" v-model="ruleForm.type"></el-input>
              </el-form-item>
              <el-form-item label="备注:" prop="content">
                <el-input type="textarea" v-model="ruleForm.content"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData('ruleForm'):updateData('ruleForm')">确 定</el-button> <!-- @click="closedialog"-->
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <span>确定要删除此指标吗？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="trueDialog">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<script>
let id = 1000
import { treelist } from '@/api/article'
import { getToken1, getToken2 } from '@/utils/auth'
export default {
  data() {
    return {
      data: null,
      value: undefined,
      needcontent: '',
      jibie: '',
      treeData: [],
      dialogVisible: false,
      centerDialogVisible: false,
      dialogStatus: '',
      left: 'left',
      ItemSN: '',
      textMap: {
        update: '修改',
        create: '创建'
      },
      ruleForm: {
        name: '',
        region: '',
        staged: '',
        date1: '',
        date2: '',
        type: '',
        famount: '',
        pinyin: '',
        calculation: '',
        desc: '',
        stand: '',
        last: '',
        state: '',
        count: '',
        duixiang: '',
        xishu: '',
        Enble: '',
        defen: '',
        content: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入指标名称', trigger: 'blur' }
        ],
        xishu: [
          { required: true, message: '请输入指标说明', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请输入数据来源', trigger: 'blur' }
        ],
        date1: [
          { required: true, message: '请输入指标编码', trigger: 'blur' }
        ],
        date2: [
          { required: true, message: '请输入得分计算公式非结构化', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请输入考核对象', trigger: 'blur' }
        ],
        staged: [
          { required: true, message: '请选择级别', trigger: 'blur' }
        ],
        count: [
          { required: true, message: '请输入得分计算公式结构化', trigger: 'blur' }
        ],
        defen: [
          { required: true, message: '请输入分值', trigger: 'blur' }
        ],
        famount: [
          { type: 'number', message: '必须为正整数' }
        ]
      },
      OperateOrganization: getToken1(),
      OperatorId: getToken2()
    }
  },
  created() {
    treelist({ action: { authinfo: { serviceid: 901003 }, datainfo:{}}}).then(response => {
      const res = response.ResponseData
      this.data = JSON.parse(res)
      this.treeData = JSON.parse(res)
    })
    treelist({ action: { authinfo: { serviceid: 903001 }, datainfo: { CategoryNo: 301003 }}}).then(response => {
      let res = response.ResponseData
      this.jibie = res
    })
    treelist({ action: { authinfo: { serviceid: 903001 }, datainfo: { CategoryNo: 301001 }}}).then(response => {
      let res = response.ResponseData
      this.needcontent = res
    })
  },
  methods: {
    change() {
      if (this.ruleForm.state == false) {
        this.ruleForm.Enble = 0
      } else if (this.ruleForm.state == true) {
        this.ruleForm.Enble = 1
      }
    },
    append(data) {
      const newChild = { id: id++, label: 'testtest', children: [] }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },
    handleCreate(node, formName) {
      this.dialogStatus = 'create'
      if (node == null) {
        this.value = null
      } else {
        this.value = node.key.toString()
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs[formName].resetFields()
      })
      if (this.ruleForm.state == '') {
        this.ruleForm.Enble = 0
      }
    },
    handleUpdate(node, formName) {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs[formName].resetFields()
      })
      this.ItemSN = node.key
      this.dialogStatus = 'update'
      treelist({ action: { authinfo: { serviceid: 901002 }, datainfo: { ItemSN: this.ItemSN }}}).then(response => {
        const res = response.ResponseData
        this.ruleForm.region = res.ExaminationObject
        this.ruleForm.xishu = res.ItemExplain
        this.ruleForm.desc = res.DataSources
        this.ruleForm.date1 = res.ItemCode
        this.ruleForm.name = res.ItemName
        this.ruleForm.staged = res.Level.toString()
        this.ruleForm.count = res.FormulaCode
        this.ruleForm.date2 = res.FormulaDisplay
        this.ruleForm.type = res.ConnString
        if (res.Enble == 1) {
          this.ruleForm.state = true
        } else {
          this.ruleForm.state = false
        }
        this.ruleForm.content = res.Remarks
        this.ruleForm.calculation = res.OrderBy
        this.value = res.KPI_ItemSN.toString()
      })
    },
    updateData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ruleForm.state == false) {
            this.ruleForm.Enble = 0
          } else if (this.ruleForm.state == true) {
            this.ruleForm.Enble = 1
          }
          treelist({ action: { "authinfo": {"serviceid":901001}, "datainfo": { "OperationType": "2", ItemSN: this.ItemSN, KPI_ItemSN: this.value, "ExaminationObject": this.ruleForm.region, "ItemExplain": this.ruleForm.xishu, "DataSources": this.ruleForm.desc, "ItemCode": this.ruleForm.date1, "ItemName": this.ruleForm.name, "Level": this.ruleForm.staged, "FormulaCode": this.ruleForm.count, "FormulaDisplay": this.ruleForm.date2, "ConnString": this.ruleForm.type, "Enble": this.ruleForm.Enble, "Remarks": this.ruleForm.content, "OperatorId": this.OperateOrganization, "OperateOrganization": this.OperatorId, "OrderBy": this.ruleForm.calculation }}}).then(response => {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.$refs[formName].resetFields()
            this.dialogVisible = false
            treelist({ action: { authinfo: { serviceid: 901003 }, datainfo:{}}}).then(response => {
              const res = response.ResponseData
              this.data = JSON.parse(res)
              this.treeData = JSON.parse(res)
            })
            treelist({ action: { authinfo: { serviceid: 903001 }, datainfo: { CategoryNo: 301003 }}}).then(response => {
              let res = response.ResponseData
              this.jibie = res
            })
            treelist({ action: { authinfo: { serviceid: 903001 }, datainfo: { CategoryNo: 301001 }}}).then(response => {
              let res = response.ResponseData
              this.needcontent = res
            })
          })
        }
      })
    },
    createData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          treelist({ action: { "authinfo": {"serviceid":901001}, "datainfo": { "OperationType": "1", KPI_ItemSN: this.value, "ExaminationObject": this.ruleForm.region, "ItemExplain": this.ruleForm.xishu, "DataSources": this.ruleForm.desc, "ItemCode": this.ruleForm.date1, "ItemName": this.ruleForm.name, "Level": this.ruleForm.staged, "FormulaCode": this.ruleForm.count, "FormulaDisplay": this.ruleForm.date2, "ConnString": this.ruleForm.type, "Enble": this.ruleForm.Enble, "Remarks": this.ruleForm.content, "OperatorId": this.OperateOrganization, "OperateOrganization": this.OperatorId, "OrderBy": this.ruleForm.calculation }}}).then(() => {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.$refs[formName].resetFields()
            this.dialogVisible = false
            treelist({ action: { authinfo: { serviceid: 901003 }, datainfo:{}}}).then(response => {
              const res = response.ResponseData
              this.data = JSON.parse(res)
              this.treeData = JSON.parse(res)
            })
            treelist({ action: { authinfo: { serviceid: 903001 }, datainfo: { CategoryNo: 301003 }}}).then(response => {
              let res = response.ResponseData
              this.jibie = res
            })
            treelist({ action: { authinfo: { serviceid: 903001 }, datainfo: { CategoryNo: 301001 }}}).then(response => {
              let res = response.ResponseData
              this.needcontent = res
            })
          })
        }
      })
    },
    remove(node, data) {
      this.centerDialogVisible = true
      this.ItemSN = node.key
   /*   const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
      this.ItemSN = node.key
      treelist({ action: { authinfo: { serviceid: 901001 }, datainfo: { OperationType: 3, ItemSN: this.ItemSN }}}).then(response => {
      })*/
    },
    trueDialog() {
      treelist({ action: { authinfo: { serviceid: 901001 }, datainfo: { OperationType: 3, ItemSN: this.ItemSN }}}).then(() => {
        this.centerDialogVisible = false
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        treelist({ action: { authinfo: { serviceid: 901003 }, datainfo:{}}}).then(response => {
          const res = response.ResponseData
          this.data = JSON.parse(res)
          this.treeData = JSON.parse(res)
        })
        treelist({ action: { authinfo: { serviceid: 903001 }, datainfo: { CategoryNo: 301003 }}}).then(response => {
          let res = response.ResponseData
          this.jibie = res
        })
        treelist({ action: { authinfo: { serviceid: 903001 }, datainfo: { CategoryNo: 301001 }}}).then(response => {
          let res = response.ResponseData
          this.needcontent = res
        })
      })
    },
    // 对话框关闭事件

    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .ant-select-dropdown {
    z-index: 1000000;
  }
</style>
