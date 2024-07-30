<template>
  <div class="nomal-checkbox">
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
    <el-checkbox-group :value="checkedList">
      <el-checkbox v-for="c in checkList" :label="c" :key="c" @change="handleCheckeChange($event, c)">
        {{ c }}
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
  export default {
    model: {
      prop: 'checkedList',
      event: 'change'
    },
    props: {
      checkList: { default: [] },
      checkedList: { default: [] }
    },
    data() {
      return {
        checkAll: false,
        isIndeterminate: false
      };
    },
    methods: {
      handleCheckAllChange(val) {
        this.isIndeterminate = false;
        const tmp = val ? this.checkList : [];
        this.$emit('change', tmp);
      },
      handleCheckeChange(e, c) {
        const tmp = e ? [...this.checkedList, c] : this.checkedList.filter(v => v !== c)
        let checkedCount = tmp.length;
        this.checkAll = checkedCount === this.checkList.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.checkList.length;
        this.$emit('change', tmp)
      }
    }
  }
</script>

<style scoped lang="scss">
  .nomal-checkbox {
    display: flex;
    gap: 1em;
  }
</style>