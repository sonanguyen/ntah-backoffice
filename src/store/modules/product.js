/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/05 21:25:59
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
  state: () => ({
    agencies: null,    
  }),
  getters: {
    agencies() {
      return this.agencies || []
    },
  },
  actions: {
    setAgencies(agencies) {
      this.agencies = agencies
    },
    resetProduct() {
      this.$reset()
    },
  },
})
