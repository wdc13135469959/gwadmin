<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.action.datainfo.HospName" placeholder="机构名称" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.action.datainfo.TimeSlot" placeholder="考核时间段" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in needcontent" :key="item.Code" :label="item.CodeName" :value="item.Code"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="handleCreate">
        添加
      </el-button>
    <!--  <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download"
                 @click="handleDownload">
        Export
      </el-button>-->
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column
        type="selection"
        align="center"
        width="55">
      </el-table-column>
      <el-table-column label="机构名称" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.HospName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="考核指标" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ItemName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.OrderBy }}</span>
        </template>
      </el-table-column>
      <el-table-column label="考核时间" min-width="150px" align="center">
        <template slot-scope="scope">
        <!--  <span>{{ scope.row.OperatorTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>-->
          <span>{{ scope.row.OperatorTime | formatedate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="考核人" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.OperatorId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="考核得分" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Score }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否完成考核" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>否</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row,'ruleForm')">
            编辑
          </el-button>
          <el-button type="primary" size="mini" @click="queren(row)">
           确认
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.action.datainfo.PageIndex" :limit.sync="listQuery.action.datainfo.PageSize"
                @pagination="getList"/>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px"
               style=" margin-left:50px; width: 80%">
        <el-form-item label="考核机构" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="请选择" @change="jigouGet" style="width: 100%">
            <el-option v-for="item in HospName" :key="item.HospId" :label="item.HospName" :value="item.HospId"/>
          </el-select>
        </el-form-item>
        <el-form-item label="考核类型" prop="leixing">
          <el-select v-model="temp.leixing" placeholder="--请选择考核类型--" @change="leixingGet" style="width: 100%">
            <el-option v-for="item in jibie" :key="item.Code" :label="item.CodeName" :value="item.Code"/>
          </el-select>
          <!--<el-input v-model="temp.leixing" placeholder="请选择考核类型"></el-input>-->
        </el-form-item>
        <el-form-item label="考核时间段" prop="famount">
          <el-select v-model="temp.famount" placeholder="--考核时间段--" @change="selectGet" style="width: 100%">
            <el-option v-for="item in needcontent" :key="item.Code" :label="item.CodeName" :value="item.Code"/>
          </el-select>
          <!--<el-input v-model="temp.leixing" placeholder="请选择考核类型"></el-input>-->
        </el-form-item>
        <el-form-item label="考核时间" prop="timestamp" >
          <el-date-picker type="daterange"
                          v-model="temp.timestamp"
                          range-separator="至"
                          style="width: 100%"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          />
        </el-form-item>
        <el-form-item label="考核指标数" prop="">
          <div style="height: 100px;overflow-x: auto;overflow-y: auto">
            <el-tree
              :data="data"
              show-checkbox
              node-key="id"
              ref="tree"
              :props="defaultProps"
              :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{node, data }">
              <span>{{ node.label }}</span>
            </span>
            </el-tree>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
         取&nbsp;&nbsp;&nbsp;消
        </el-button>
        <el-button type="primary" @click="createData()">
          下一步
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="编辑">
      <el-form ref="ruleForm" :rules="rules" :model="ruleForm" label-position="left" label-width="100px"
               style=" margin-left:50px; width: 80%">
        <el-form-item label="考核机构：" prop="stage">
          <el-input  v-model="ruleForm.stage" placeholder="请输入内容" disabled></el-input>
        </el-form-item>
        <el-form-item label="考核指标：" prop="ItemNamed">
          <el-input  v-model="ruleForm.ItemNamed" placeholder="请输入内容" disabled></el-input>
        </el-form-item>
        <el-form-item label="得分：" prop="state">
          <el-input  v-model="ruleForm.state" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="人工系数：" prop="xishu">
          <el-input  v-model="ruleForm.xishu" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="系统系数:" prop="SystemCoefficient">
          <el-input  v-model="ruleForm.SystemCoefficient" disabled></el-input>
        </el-form-item>
        <el-form-item label="指标说明:" prop="ItemExplain">
          <el-input type="textarea" v-model="ruleForm.ItemExplain" disabled></el-input>
        </el-form-item>
        <el-form-item label="数据资料来源:" prop="content">
          <el-input type="textarea" v-model="ruleForm.content" disabled></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
         <el-button @click="dialogPvVisible = false">
         取&nbsp;&nbsp;&nbsp;消
        </el-button>
        <el-button type="primary" @click="trued()">确认</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="生成结果表"
      :visible.sync="centerDialogVisible"
      >
      <el-form ref="newForm" :rules="rules" :model="newForm" label-position="left" label-width="100px"
               style=" margin-left:50px; width: 80%">
        <el-form-item label="质量系数：" prop="MassCoefficient">
          <el-input  v-model="newForm.MassCoefficient" placeholder="请输入整数或者小数点后俩位"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="shengcheng()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, updateArticle, mechanism, treelist } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import { getToken1, getToken2 } from '@/utils/auth'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: '1', display_name: '1' },
  { key: '2', display_name: '2' },
  { key: '3', display_name: '3' },
  { key: '4', display_name: '4' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    formatedate: function (d) {
      if (d != "") {
        var date = new Date(parseInt(d.substring(6, 19)))
        return date.toLocaleDateString()
      }
    }
  },
  data() {
    return {
      data: null,
      codename: '',
      jigouname: '',
      leixingname: '',
      HospName: '',
      jibie: '',
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      needcontent: '',
      OperateOrganization: getToken1(),
      OperatorId: getToken2(),
      newForm: {
        MassCoefficient: ''
      },
      ruleForm: {
        stage: '',
        state: '',
        xishu: '',
        ItemNamed: '',
        ItemExplain: '',
        SystemCoefficient: '',
        content: ''
      },
      listQuery: {
        action: {
          authinfo: { serviceid: 902003 },
          datainfo: {
            HospName: '',
            TimeSlot: '',
            PageIndex: 1,
            PageSize: 10
          }
        }
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      statusOptions: ['published', 'draft', 'deleted'],
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: '',
        type: '',
        famount: '',
        stime: '',
        etime: '',
        leixing: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '创建'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: '考核机构不能为空', trigger: 'change' }],
        timestamp: [{ required: true, message: '时间不能为空', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }],
        famount: [{ required: true, message: '考核时间段不能为空', trigger: 'change' }],
        leixing: [{ required: true, message: '内容不能为空', trigger: 'change' }]
      },
      downloadLoading: false,
      centerDialogVisible: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created() {
    this.getList()
    this.tree()
    this.jigou()
    treelist({ action: { authinfo: { serviceid: 903001 }, datainfo: { CategoryNo: 301002 }}}).then(response => {
      let res = response.ResponseData
      this.needcontent = res
    })
    treelist({ action: { authinfo: { serviceid: 903001 }, datainfo: { CategoryNo: 301001 }}}).then(response => {
      let res = response.ResponseData
      this.jibie = res
    })
  },
  methods: {
    tree() {
      treelist({ action: { authinfo: { serviceid: 901003 }, datainfo: {}}}).then(response => {
        let res = response.ResponseData
        this.data = JSON.parse(res)
      })
    },
    jigou() {
      mechanism({ action: { authinfo: { serviceid: 903003 }, datainfo: { HospID: this.OperatorId }}}).then(response => {
        this.HospName = response.ResponseData
      })
    },
    GMTToStr(time) {
      let date = new Date(time)
      let Str = date.getFullYear() + '-' +
        (date.getMonth() + 1) + '-' +
        date.getDate() + ' '
      return Str
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.ResponseData
        this.total = response.Count
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: '',
        title: '',
        stime: '',
        etime: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.$refs.tree.getCheckedKeys().length == 0) {
            this.$message.error('指标数不能为空')
            return false
          }
          this.temp.stime = this.GMTToStr(this.temp.timestamp[0])
          this.temp.etime = this.GMTToStr(this.temp.timestamp[1])
          this.$router.push({ path: '/example/edit/1', query: { HospId: this.temp.type, codename: this.codename, jigouname: this.jigouname, leixingname: this.leixingname, AssessmentType: this.temp.leixing, TimeSlot: this.temp.famount, StatrTime: this.temp.stime, EndTime: this.temp.etime, ItemSNStr: this.$refs.tree.getCheckedKeys().join(',') }})
          this.dialogFormVisible = false
        }
      })
    },
    handleUpdate(row, ruleForm) {
      this.temp = Object.assign({}, row) // copy obj

      this.dialogPvVisible = true
      this.$nextTick(() => {
        this.$refs[ruleForm].resetFields()
      })
      treelist({ action: { authinfo: { serviceid: 902005 }, datainfo: { Id: this.temp.ID }}}).then(response => {
        let res = response.ResponseData
        this.ruleForm.state = res.Score
        this.ruleForm.stage = res.HospName
        this.ruleForm.xishu = res.InputCoefficient
        this.ruleForm.SystemCoefficient = res.SystemCoefficient
        this.ruleForm.ItemNamed = res.ItemName
        this.ruleForm.ItemExplain = res.ItemExplain
        this.ruleForm.content = res.DataSources
      })
    },
    trued() {
      treelist({ action: { authinfo: { serviceid: 902004 }, datainfo: { Id: this.temp.ID, InputCoefficient: this.ruleForm.xishu, Score: this.ruleForm.state }}}).then(() => {
      })
      this.dialogPvVisible = false
      this.getList()
      this.tree()
      this.jigou()
      this.$message({
        title: 'Success',
        message: '修改成功',
        type: 'success',
        duration: 2000
      })
    },
    queren(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.centerDialogVisible = true
      this.newForm.MassCoefficient = ''
    },
    shengcheng() {
      treelist({ action: { authinfo: { serviceid: 902006 }, datainfo: { IdStr: this.temp.ID, MassCoefficient: this.newForm.MassCoefficient, OperatorId: this.OperateOrganization, OperateOrganization: this.OperatorId }}}).then(() => {
        this.centerDialogVisible = false
        this.getList()
        this.tree()
        this.jigou()
        this.$message({
          title: 'Success',
          message: '生成成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
  /*    handleDownload() { 导出表格
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },*/
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}`
        ? 'ascending'
        : sort === `-${key}`
          ? 'descending'
          : ''
    },
    selectGet(val){ //这个vId也就是value值
      //locations是v-for里面的也是datas里面的值
      let obj = {}
      obj = this.needcontent.find((item)=>{
        return item.Code === val
      })
      let getName = ''
      getName = obj.CodeName
      this.codename = getName
    },
    jigouGet(val){ //这个vId也就是value值
      //locations是v-for里面的也是datas里面的值
      let obj = {}
      obj = this.HospName.find((item)=>{
        return item.HospId === val
      })
      let getName = ''
      getName = obj.HospName
      this.jigouname = getName
    },
    leixingGet(val){ //这个vId也就是value值
      //locations是v-for里面的也是datas里面的值
      let obj = {}
      obj = this.jibie.find((item)=>{
        return item.Code === val
      })
      let getName = ''
      getName = obj.CodeName
      this.leixingname = getName
    }
  }
}
</script>
