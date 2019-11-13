<template>
  <el-dialog title="指标详情" :visible="dialogFormVisible" @close="$emit('close', false)">
    <el-row>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" class="demo-ruleForm" style="margin-top: 60px">
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form-item label="指标名称：" prop="name" dataid="111">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="考核对象：" prop="region">
              <el-select v-model="ruleForm.region" placeholder="--请选择--">
                <el-option label="--请选择--" value="0"></el-option>
                <el-option label="测试一" value="1"></el-option>
                <el-option label="测试二" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="指标等级：" prop="region1">
              <el-select v-model="ruleForm.region1" placeholder="--请选择--">
                <el-option label="--请选择--" value="0"></el-option>
                <el-option label="一级指标" value="1"></el-option>
                <el-option label="二级指标" value="2"></el-option>
                <el-option label="三级指标" value="3"></el-option>
                <el-option label="四级指标" value="4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="排序：" prop="famount">
              <el-input v-model.number="ruleForm.famount" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="信息来源：" prop="desc">
              <el-input type="textarea" v-model="ruleForm.desc"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple-light">
            <el-form-item label="计算公式：">
              <el-input v-model="ruleForm.calculation"></el-input>
            </el-form-item>
            <el-form-item label="级别：">
              <el-select v-model="ruleForm.stage" placeholder="--请选择--">
                <el-option label="--请选择--" value="0"></el-option>
                <el-option label="测试一" value="1"></el-option>
                <el-option label="测试二" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态：">
              <el-select v-model="ruleForm.pinyin" placeholder="--请选择--">
                <el-option label="--请选择--" value="0"></el-option>
                <el-option label="测试一" value="1"></el-option>
                <el-option label="测试二" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="启用状态：">
              <el-checkbox-group v-model="ruleForm.state">
                <el-checkbox ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="指标说明">
              <el-input type="textarea" v-model="ruleForm.type"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-form>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('close', false)">取 消</el-button>
      <el-button type="primary" @click="$emit('close', false)">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'edit',
  props: ['dialogFormVisible'],
  data() {
    return {
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        type: '',
        famount: '',
        pinyin: '',
        calculation: '',
        desc: '',
        stand: '',
        stage: '',
        zhuangtai: '',
        state: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入指标名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择所属评分组', trigger: 'change' }
        ],
        famount: [
          { required: true, message: '请选择排序' },
          { type: 'number', message: '必须为正整数' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ],
        stand: [
          { required: true, message: '请填写评分标准', trigger: 'blur' }
        ]
      },
      dialogTableVisible: false,
      formLabelWidth: '120px'
    }
  },
  created() {
    console.log(this.dataid)
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
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

