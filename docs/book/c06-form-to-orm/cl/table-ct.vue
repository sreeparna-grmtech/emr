<template>
  <div>
    From sixth chapter - Hello world
    <el-input
      placeholder="Please input"
      :value="mfGetFldValue(1, 'msg')"
      @input="mfSetFldValueUsingCache($event, 1, 'msg')"
    ></el-input>
  </div>
</template>
<script>
import ormClientSideTable from "../db/client-side/helloworld.js"; // Path without @ can be resolved by vsCode. Hence do not use webpack specific @ sign that represents src folder.

export default {
  methods: {
    mfGetFldValue(pClientSideRowId, pFldName) {
      const value = ormClientSideTable.fnGetFldValue(
        pClientSideRowId,
        pFldName
      );
      return value;
    },
    mfSetFldValueUsingCache(pEvent, pClientSideRowId, pFldName) {
      const rowStatus = 24; // 2 is new on client and 4 is changed on client
      ormClientSideTable.fnSetFldValue(
        pEvent,
        pClientSideRowId,
        pFldName,
        rowStatus
      );
      this.$forceUpdate(); // Not able to remove it. For the different methods tried read: cts/core/manage-rows-of-table-in-client-side-orm.js:133/fnPutFldValueInCache
    },
  },
};
</script>
