/* Code architecture doc is at reference implementation name/db/full-sync-with-db-server-mixin.js
In this file only doc unique to this ct is written */

import orm from '~/cts/spi/1t-1rMf/temperature/db/orm-temperature.js'
export default {
  methods: {
    async mxGetDataFromDb() {
      const pro = await orm.api().get(orm.apiUrl + '/1')
      if (pro.ok) {
      }
    },
  },
}
