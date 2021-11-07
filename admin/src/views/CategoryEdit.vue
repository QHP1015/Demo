<template>
  <div class="about">
    <h1>{{id ? '编辑' : '新建'}}分类</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="上级分类">
        <el-select v-model="model.parent">
          <el-option v-for="item in parents" :key="item._id"
          :label="item.name" :value="item._id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  // 接收id的组件，跟路由解耦
  props:{
    id:{}
  },

  data() {
    return {
      model: {},
      parents: [],
    };
  },
  methods: {
    async save() {
      // 测试是否运行
      console.log("save")

      let res;  // eslint-disable-line no-unused-vars
      if(this.id){
        res = await this.$http.put(`rest/categories/${this.id}`, this.model) 
      }else{
        res = await this.$http.post("rest/categories", this.model) 
      }
      this.$router.push("/categories/list");
      // 提示信息
      this.$message({
        type: "success",
        message: "保存成功！",
      });
    },
    async fetch(){
      const res = await this.$http.get(`rest/categories/${this.id}`)
      this.model = res.data
    },
    async fetchParents(){
      const res = await this.$http.get(`rest/categories`)
      this.parents = res.data
    }
  },
  created(){
    // 如果有id就把这个列表的信息显示出来
    this.id && this.fetch()
    // 获取分类数据
    this.fetchParents()
  }
};
</script>