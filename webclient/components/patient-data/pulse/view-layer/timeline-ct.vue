<template>
  <timeLineView :_formDef="formDef"></timeLineView>
</template>

<script>
import timeLineView from '@/components//papers/view-appt-note/templates/generic-timeline-structure.vue'
import { pulseFormDef } from '@/components/patient-data/pulse/db/client-side/structure/pulse-of-a-patient-table.js'

export default {
  components: { timeLineView },

  data: function () {
    return {
      formDef: pulseFormDef,
    }
  },
}
</script>
