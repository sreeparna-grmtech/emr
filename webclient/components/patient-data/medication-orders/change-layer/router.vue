<template>
  <div>
    <el-tabs v-model="activeHorizontalTab">
        <el-tab-pane label="Change" name="change">
            <el-divider>Add</el-divider>
            <medicationOrderAdd />
            <el-divider>Edit</el-divider>
            <medicationOrderMHorizontalEdit />
        </el-tab-pane>
        <el-tab-pane label="List" name="second">

            <el-button size="mini" type="primary" plain round @click="mfAdd()">Add</el-button>
            <el-divider direction="vertical"></el-divider>

            <el-button
            size="mini"
            :type="tableFilters.activeMeds ? 'primary' : 'info'"
            @click="tableFilters.activeMeds = !tableFilters.activeMeds"
            round
            >Active</el-button
            >
            <el-button
            size="mini"
            :type="tableFilters.inActiveMeds ? 'primary' : 'info'"
            @click="tableFilters.inActiveMeds = !tableFilters.inActiveMeds"
            round
            >Discontinued</el-button
            >
            <el-divider direction="vertical"></el-divider>

            <el-button
            size="mini"
            :type="tableFilters.scPrescribed ? 'primary' : 'info'"
            round
            @click="tableFilters.scPrescribed = !tableFilters.scPrescribed"
            >SC</el-button
            >
            <el-button
            size="mini"
            :type="tableFilters.nonSCPrescribed ? 'primary' : 'info'"
            round
            @click="tableFilters.nonSCPrescribed = !tableFilters.nonSCPrescribed"
            >Non-SC</el-button
            >
            <el-divider direction="vertical"></el-divider>
            <el-dropdown @command="mfConditionDropDownCommand">
            <el-button size="mini" type="primary" plain round>
                Condition - {{ tableFilters.conditions }} <i class="el-icon-arrow-down el-icon--right"></i
            ></el-button>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="All">All</el-dropdown-item>
                <el-dropdown-item command="Depression">Depression</el-dropdown-item>
                <el-dropdown-item command="Anxiety">Anxiety</el-dropdown-item>
            </el-dropdown-menu>
            </el-dropdown>
            <el-divider direction="vertical"></el-divider>

            <!-- TABLE START -->
            <el-table :data="cfFilteredTableData" style="width: 100%">
            <el-table-column prop="meds" label="Medication" width="180"> </el-table-column>
            <el-table-column prop="dose" label="Dose" width="100"> </el-table-column>
            <el-table-column prop="instructions" label="Instructions"> </el-table-column>
            <el-table-column prop="prescribed" label="Prescribed"
                ><template slot-scope="scope">
                {{ scope.row.prescribed | moment }}
                </template>
            </el-table-column>
            <el-table-column prop="provider" label="Provider"> </el-table-column>
            <el-table-column prop="condition" label="Condition">
                <template slot-scope="scope">
                <el-button type="text" size="small" @click="tableFilters.conditions = scope.row.condition">{{
                    scope.row.condition
                }}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="discDate" label="Disc date">
                <template slot-scope="scope">
                <div v-if="scope.row.discDate === null">
                    <el-button type="text" size="small">Discontinue</el-button>
                </div>
                <div v-else>
                    {{ scope.row.discDate | moment }}
                </div>
                </template>
            </el-table-column>
            <el-table-column prop="reconciledDate" label="Reconc. date">
                <template slot-scope="scope">
                {{ scope.row.reconciledDate | moment }}
                </template>
            </el-table-column>
            <el-table-column prop="orders" label="Orders"> </el-table-column>
            <el-table-column prop="notes" label="Notes"> </el-table-column>
            <el-table-column fixed="right" label="Operations" width="120">
                <template slot-scope="scope">
                <span v-if="scope.row.provider !== 'not-sc' && scope.row.discDate === null">
                    <el-button type="text" size="small">Order</el-button>
                </span>
                <el-button type="text" size="small">Info</el-button>
                </template>
            </el-table-column>
            </el-table>
            <highcharts :constructor-type="'ganttChart'" :options="cfChartOptions"></highcharts>
        </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Highcharts from 'highcharts'
import Gantt from 'highcharts/modules/gantt'
import { Chart } from 'highcharts-vue'
Gantt(Highcharts)

import moment from 'moment'

import medicationOrderMHorizontalEdit from './medit-horizontal.vue'
import medicationOrderAdd from './medication-order-add.vue'

export default {
  data: function () {
    return {
      activeHorizontalTab: 'change',
      tableData: [
        {
          meds: 'Aspirin',
          dose: '10 mg',
          instructions: 'Daily',
          prescribed: 1607854627231, // milliseconds for Wed Jan 31 2001 14:40:08 From https://currentmillis.com/
          provider: 'VS',
          condition: 'Depression',
          discDate: null,
          reconciledDate: 1607854627231,
          orders: 1,
          notes: 'asda',
        },
        {
          meds: 'Lexapro',
          dose: '20 mg',
          instructions: 'With water',
          prescribed: 988789908908, // milliseconds for Wed May 02 2001 07:51:48 From https://currentmillis.com/
          provider: 'SP',
          condition: 'Anxiety',
          discDate: 1107854627231,
          reconciledDate: 1607854627231,
          orders: 2,
          notes: 'asd',
        },
        {
          meds: 'Lithium',
          dose: '30 mg',
          instructions: 'Before food',
          prescribed: 999999908998, // milliseconds for Sun Sep 09 2001 01:45:08 From https://currentmillis.com/
          provider: 'not-sc',
          condition: 'Cold',
          discDate: 1607854627231,
          reconciledDate: 1607854627231,
          orders: 3,
          notes: 'asdads',
        },
      ],
      filteredTable: [],
      tableFilters: {
        activeMeds: true,
        inActiveMeds: true,
        scPrescribed: true,
        nonSCPrescribed: true,
        conditions: 'All',
      },
    }
  },
  components: {
    highcharts: Chart,
    medicationOrderMHorizontalEdit,
    medicationOrderAdd
  },
  filters: {
    moment: function (date) {
      return moment(date).format('MMM Do YYYY')
    },
  },
  computed: {
    cfFilteredTableData() {
      this.filteredTable = this.tableData.map((a) => Object.assign({}, a))

      // Finding which are activemeds
      if (this.tableFilters.activeMeds === false && this.tableFilters.inActiveMeds === false) {
        // no matches
        return []
      } else if (this.tableFilters.activeMeds === true && this.tableFilters.inActiveMeds === true) {
        // all matches
      } else if (this.tableFilters.activeMeds === true) {
        var i = this.filteredTable.length
        while (i--) {
          if (this.filteredTable[i].discDate === null) {
            continue // discDate for Medications is null for meds that are active.
          }
          const diff = Date.now() - this.filteredTable[i].discDate
          if (diff > 0) {
            this.filteredTable.splice(i, 1)
          }
        }
      } else if (this.tableFilters.activeMeds === false) {
        // looking for meds that have already been discontinued
        var i = this.filteredTable.length
        while (i--) {
          if (this.filteredTable[i].discDate === null) {
            this.filteredTable.splice(i, 1)
            continue // discDate for Medications is null for meds that are active.
          }
          const diff = this.filteredTable[i].discDate - Date.now()
          if (diff > 0) {
            this.filteredTable.splice(i, 1)
          }
        }
      }

      // Fiding which are prescribed by SC doctors
      if (this.tableFilters.scPrescribed === false && this.tableFilters.nonSCPrescribed === false) {
        // no matches
        return []
      } else if (this.tableFilters.scPrescribed === true && this.tableFilters.nonSCPrescribed === true) {
        // all matches
      } else if (this.tableFilters.scPrescribed === true) {
        var i = this.filteredTable.length
        while (i--) {
          if (this.filteredTable[i].provider === 'not-sc') {
            this.filteredTable.splice(i, 1)
          }
        }
      } else if (this.tableFilters.nonSCPrescribed === true) {
        var i = this.filteredTable.length
        while (i--) {
          if (this.filteredTable[i].provider !== 'not-sc') {
            this.filteredTable.splice(i, 1)
          }
        }
      }

      if (this.tableFilters.conditions === 'All') {
        // do nothing
      } else {
        var i = this.filteredTable.length
        while (i--) {
          if (this.filteredTable[i].condition !== this.tableFilters.conditions) {
            this.filteredTable.splice(i, 1)
          }
        }
      }

      return this.filteredTable
    },
    cfChartOptions() {
      // creating chart data
      var chartData = new Array()

      for (let i = 0; i < this.filteredTable.length; i++) {
        var obj = new Object()
        obj.name = this.filteredTable[i]['meds']
        obj.start = this.filteredTable[i]['prescribed']
        if (this.filteredTable[i]['discDate'] === null) {
          obj.end = Date.now()
        } else {
          obj.end = this.filteredTable[i]['discDate']
        }
        chartData.push(obj)
      }

      var chart = {
        title: {
          text: '',
        },
        credits: {
          enabled: false,
        },
        series: [
          {
            name: 'Med overlap',
            data: chartData,
            pointWidth: 10, // Ref: https://api.highcharts.com/gantt/series.gantt.pointWidth
          },
        ],
      }
      return chart
    },
  },
  methods: {
    mfAdd() {
      const newData = {
        meds: 'Lithium',
        dose: '30 mg',
        instructions: 'Before food',
        prescribed: '2/12/2020',
        provider: 'CS',
        condition: 'Cold',
        discDate: '12/12/2023',
        reconciledDate: '12/12/2020',
        orders: 3,
        notes: 'asdads',
        actions: '<button>Order</button>',
      }
      this.tableData.push(newData)
    },
    mfConditionDropDownCommand(p) {
      this.tableFilters.conditions = p
    },
  },
}
</script>
