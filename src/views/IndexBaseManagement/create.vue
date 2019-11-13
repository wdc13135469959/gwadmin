<template>
  <div class="app-container">
    <el-row>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :label-position="left"  label-width="100px" class="demo-ruleForm" style="margin-top: 30px; ">
        <el-col :span="12">
          <div class="grid-content bg-purple" style="margin-right: 200px">
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
            <el-form-item label="所属父对象：">
              <div v-if="treeData.length>0">
                <a-tree-select
                  :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                  :treeData="treeData"
                  placeholder="--请选择--"
                  treeDefaultExpandAll
                  v-model="value"
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
          <div class="grid-content bg-purple-light" style="margin-left: 40px;margin-right: 200px">
            <el-form-item label="排序：" prop="calculation" :rules="[
              { required: true, message: '排序不能为空'},
              { type: 'number', message: '排序必须为数字值'}
            ]">
              <el-input v-model.number="ruleForm.calculation"></el-input>
            </el-form-item>
            <el-form-item label="级别：" prop="stage">
              <el-select v-model="ruleForm.stage" placeholder="--请选择--" style="width: 100%">
                <el-option v-for="item in jibie" :key="item.Code" :label="item.CodeName" :value="item.Code"/>
              </el-select>
            </el-form-item>
            <el-form-item label="启用状态：" prop="state">
              <el-checkbox-group v-model="ruleForm.state" >
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
        <el-col :span="24" style="margin-top: 40px">
          <div class="grid-content bg-purple-dark" style="text-align:center;">
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
              <el-button @click="resetForm('ruleForm')" style="margin-left:100px">重&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;置</el-button>
            </el-form-item>
          </div>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script>

import { createData } from '@/api/article'
import { getToken1, getToken2 } from '@/utils/auth'

export default {
  data() {
    return {
      value: undefined,
      needcontent: '',
      jibie: '',
      treeData: [],
      left: 'left',
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        type: '',
        famount: '',
        calculation: '',
        desc: '',
        stage: '',
        state: '',
        count: '',
        duixiang: '',
        xishu: '',
        Enble: '',
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
        stage: [
          { required: true, message: '请选择级别', trigger: 'blur' }
        ],
        count: [
          { required: true, message: '请输入得分计算公式结构化', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入接口调用地址及参数', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入备注', trigger: 'blur' }
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
    if (this.ruleForm.state == '') {
      this.ruleForm.Enble = 0
    }
    createData({ action: { authinfo: { serviceid: 903001 }, datainfo: { CategoryNo: 301001 }}}).then(response => {
      let res = response.ResponseData
      this.needcontent = res
    })
    createData({ action: { authinfo: { serviceid: 901003 }, datainfo: {}}}).then(response => {
      let res = response.ResponseData
      this.treeData = JSON.parse(res)
    })
    createData({ action: { authinfo: { serviceid: 903001 }, datainfo: { CategoryNo: 301003 }}}).then(response => {
      let res = response.ResponseData
      this.jibie = res
    })
  },
  watch: {
    value(value) {
      this.ruleForm.duixiang = value
    }
  },
  methods: {
    change() {
      if (this.ruleForm.state == false) {
        this.ruleForm.Enble = 0
      } else if (this.ruleForm.state == true) {
        this.ruleForm.Enble = 1
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          createData({ action: { "authinfo": {"serviceid":901001}, "datainfo": { "OperationType": "1", KPI_ItemSN: this.ruleForm.duixiang, "ExaminationObject": this.ruleForm.region, "ItemExplain": this.ruleForm.xishu, "DataSources": this.ruleForm.desc, "ItemCode": this.ruleForm.date1, "ItemName": this.ruleForm.name, "Level": this.ruleForm.stage, "FormulaCode": this.ruleForm.count, "FormulaDisplay": this.ruleForm.date2, "ConnString": this.ruleForm.type, "Enble": this.ruleForm.Enble, "Remarks": this.ruleForm.content, "OperatorId": this.OperateOrganization, "OperateOrganization": this.OperatorId, "OrderBy": this.ruleForm.calculation }}}).then(response => {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.value = ''
            this.$refs[formName].resetFields()
          })
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style scoped>
</style>
