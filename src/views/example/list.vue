<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="编号" width="80" type="index">
      </el-table-column>

      <el-table-column width="180px" align="center" label="机构名称">
        <template slot-scope="scope">
          <span>{{ scope.row.HospName}}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="上级机构名称">
        <template slot-scope="scope">
          <span>{{ scope.row.PHospName }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" align="center" label="得分" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.Score }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" align="center" label="质量系数">
        <template slot-scope="scope">
          <span>{{ scope.row.MassCoefficient }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="考核时间段" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.TimeSlot }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.action.datainfo.PageIndex" :limit.sync="listQuery.action.datainfo.PageSize" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList } from '@/api/article'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ArticleList',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  activated() {
    this.getList()
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        action: {
          authinfo: { serviceid: 902007 },
          datainfo: {
            PageIndex: 1,
            PageSize: 10
          }
        }
      }
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.ResponseData
        this.total = response.Count
        this.listLoading = false
      })
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
