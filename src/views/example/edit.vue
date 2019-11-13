<template>
  <el-row>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" class="demo-ruleForm" style="margin-top: 60px">
      <el-col :span="12">
        <div class="grid-content bg-purple">
          <el-form-item label="考核类型：" prop="name">
            <el-input v-model="leixingname" disabled></el-input>
          </el-form-item>
          <el-form-item label="考核时间段：" >
            <el-input v-model="codename" disabled></el-input>
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple-light">
          <el-form-item label="考核机构：" >
            <el-input v-model="jigouname" disabled></el-input>
          </el-form-item>
          <el-form-item label="考核时间：" >
            <el-input v-model="ruleForm.state" disabled></el-input>
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="24" style="margin-top: 40px">
        <div class="app-container">
          <el-table
            :data="list"
            border
            fit
            highlight-current-row
            @row-click="tableDbEdit"
            style="width: 100%">
            <el-table-column
              align="center"
              label="指标名称">
                <template slot-scope="scope">
                  <span>{{ scope.row.ItemName }}</span>
                </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="考核对象">
              <template slot-scope="scope">
                <span>{{ scope.row.ExaminationObject }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="指标说明">
              <template slot-scope="scope">
                <span>{{ scope.row.ItemExplain }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="数据资料来源">
              <template slot-scope="scope">
                <span>{{ scope.row.DataSources }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="系统系数">
              <template slot-scope="scope">
                <input @change="inputChanges(scope,$event)"/>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="人工系数">
              <template slot-scope="scope">
                <input @change="inputChanged(scope,$event)"/>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="评分">
              <template slot-scope="scope">
                <input @change="inputChange(scope,$event)"/>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination layout="prev, pager, next, sizes, total, jumper"
                         background
                         :page-size="10"
                         :total="toatl"
                         @current-change="handleCurrentChange"
                         @size-change="handleSizeChange"
          >
          </el-pagination>

        </div>

        <div class="grid-content bg-purple-dark" style="text-align:center;">
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
          </el-form-item>
        </div>
      </el-col>
    </el-form>
  </el-row>
</template>
<script>
import { createArticle } from '@/api/article'
import { getToken1, getToken2 } from '@/utils/auth'
export default {
  name: 'EditForm',
  data() {
    return {
      list: [],
      list1: [],
      codename: '',
      jigouname: '',
      leixingname: '',
      OperateOrganization: getToken1(),
      OperatorId: getToken2(),
      ceshhi: '',
      ruleForm: {
        name: '',
        date1: '',
        date2: '',
        famount: '',
        pinyin: '',
        desc: '',
        stand: '',
        stage: '',
        state: '',
        ItemSNStr: ''
      },
      currpage: '1',
      pagesize: '10',
      toatl: null,
      rules: {
      }
    }
  },
  mounted() {
    this.ItemSNStr = this.$route.query.ItemSNStr
    this.ruleForm.name = this.$route.query.AssessmentType
    this.ruleForm.stage = this.$route.query.TimeSlot
    this.ruleForm.pinyin = this.$route.query.HospId
    this.leixingname = this.$route.query.leixingname
    this.codename = this.$route.query.codename
    this.jigouname = this.$route.query.jigouname
    this.ruleForm.state = this.$route.query.StatrTime + "至" + this.$route.query.EndTime
    this.pageTab()
  },
  methods: {
    pageTab() {
      createArticle({ action: { authinfo: { serviceid: 902001 }, datainfo: { ItemSNStr: this.ItemSNStr, PageIndex: this.currpage, PageSize: this.pagesize }}}).then(response => {
        let res = response.ResponseData
        this.list = res
        this.toatl = response.Count
      })
    },
    tableDbEdit(row, column, event) {

    },
    inputChange(scope, $event) {
      console.log('控制台打印内容 ', scope)
      let arr = {}
      this.list[scope.$index].XTXS = $event.target.value
     /* console.log('控制台打印内容 ', this.list[scope.$index])*/
      console.log(this.list)
    },
    inputChanges(scope, $event) {
      let arr = {}
      this.list[scope.$index].Score = $event.target.value
      /* console.log('控制台打印内容 ', this.list[scope.$index])*/
      console.log(this.list)
    },
    inputChanged(scope, $event) {
      let arr = {}
      this.list[scope.$index].RGXS = $event.target.value
    },
    submitForm(formName) {
      let datalist = []
      this.list.map(item => {
        if (!item.RGXS && !item.XTXS && !item.Score) {
        } else {
          datalist.push({ RGXS: item.RGXS, XTXS: item.XTXS, Score: item.Score, ItenSN: item.ItemSN })
        }
      })
      this.$refs[formName].validate((valid) => {
        if (valid) {
          createArticle({ action: { authinfo: { serviceid: 902002 }, datainfo: { AssessmentJson: datalist, HospId: this.$route.query.HospId, AssessmentType: this.$route.query.AssessmentType, StatrTime: this.$route.query.StatrTime, EndTime: this.$route.query.EndTime, TimeSlot: this.$route.query.TimeSlot, OperatorId: this.OperateOrganization, OperatorOrganization: this.OperatorId }}}).then(() => {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            let val = this.$store.state.tagsView.visitedViews
            for (let prop in val) {
              if (val[prop].title == "考核录入界面") {
                let need = val[prop]
                this.$store.dispatch('tagsView/delView', need).then(({ visitedViews }) => {
                  this.toLastView(visitedViews, need)
                })
              }
            }
          })
        } else {
          return false
        }
      })
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        this.$router.push(latestView)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          this.$router.replace({ path: '/redirect' + view.fullPath })
        } else {
          this.$router.push('/')
        }
      }
    },
    handleCurrentChange(cpage) {
      this.currpage = cpage
      this.pageTab()
    },
    handleSizeChange(psize) {
      this.pagesize = psize
      this.pageTab()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style scoped>
</style>

