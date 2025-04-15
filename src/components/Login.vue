<script setup lang="ts">
import {
  reactive,
  ref,
} from 'vue';
import {
  ElButton,
  ElLoading,
  ElMessage,
} from 'element-plus';

import { useRouter } from 'vue-router';

// 路由状态
const router = useRouter();

// 登陆表单数据
const loginForm = reactive({
  account: '',
  password: '',
  captcha: ''
})

// form表单的实例
const formRef = ref<FormInstance>()

/**
 * 提交
 */
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  // 显示加载动画
  const loading = ElLoading.service({
    lock: true,
    text: '正在登陆',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  // 这里可以添加后续的登录逻辑，如模拟登录成功跳转
  setTimeout(() => {
    // 由于去掉了登录状态存储，不再设置 authorization
    router.push('/index');
    loading.close();
  }, 1000);
}

// 验证码路径
const captchaSrc = ref('/api/login/captcha');

/**
 * 刷新验证码
 */
const changecaptchaSrc = () => {
  captchaSrc.value = '/api/login/captcha?t_=' + new Date().getTime();
}
</script>

<template>
  <div class="loginPage">
    <el-card class="loginPanel">
      <div class="loginPanelInner">
        <div class="logo">
          <img src="../../assets/images/logo.png">
        </div>
        <el-divider direction="vertical" border-style="dashed" class="split" />
        <div class="loginForm">
          <div class="systemName"> 用户登陆 </div>
          <el-form ref="formRef" size="large" :model="loginForm" label-width="120px" class="form">
            <el-form-item label="账号：">
              <el-input v-model="loginForm.account" placeholder="请输入账号" autocomplete="off"
                        suffix-icon="UserFilled" />
            </el-form-item>
            <el-form-item label="密码：">
              <el-input v-model="loginForm.password" placeholder="请输入密码" type="password"
                        autocomplete="off" suffix-icon="Lock" />
            </el-form-item>
            <el-form-item label="验证码：">
              <div style="display: flex;width: 100%;">
                <div style="flex:1">
                  <el-input v-model.number="loginForm.captcha" placeholder="请输入验证码" />
                </div>
                <div class="captchaSrc">
                  <img :src="captchaSrc" @click="changecaptchaSrc">
                </div>
              </div>
            </el-form-item>
            <div class="registerBtn">
              <el-link type="primary" href="/register" :underline="false">
                去账户？点击注册 </el-link>
            </div>
            <el-form-item>
              <el-button type="primary" @click="submitForm(formRef)" class="loginBtn">
                登陆 </el-button>
              <router-link to="/"><el-button type="danger">跳转</el-button></router-link>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
    <div class="footer">
      @Copyright 君君军通用管理系统 备案信息：陕432432432
    </div>
  </div>
</template>

<style scoped>
.common-layout {
  position: fixed;
  inset: 0;
}
.loginPage {
  width: 100%;
  height: 100%;
  display: flex;
  justify-items: center;
  justify-content: center;
  align-items: center;
  background: linear-gradient(133deg, #1994bb, #19acbb, #19b4bb, #2a89db);
}

.loginPage .loginPanel {
  width: 60%;
  height: 60%;
  min-width: 600px;
  max-width: 1000px;
  min-height: 400px;
  max-height: 500px;
  margin: 0 auto;
}

.loginPage .loginPanel :deep(.el-card__body) {
  width: 100%;
  height: 100%;
}

.loginPage .loginPanel .loginPanelInner {
  width: 100%;
  height: 100%;
  display: flex;
}

.loginPage .loginPanel .loginPanelInner .logo {
  width: 40%;
  text-align: center;
  display: flex;
  justify-items: center;
  justify-content: center;
  align-items: center;
}

.loginPage .loginPanel .loginPanelInner .logo img {
  width: 50%;
}

.loginPage .loginPanel .loginPanelInner .split {
  height: calc(100% - 40px);
}

.loginPage .loginPanel .loginPanelInner .loginForm {
  flex: 1;
}

.loginPage .loginPanel .loginPanelInner .loginForm .systemName {
  text-align: center;
  font-size: 30px;
  line-height: 60px;
  letter-spacing: 3px;
  margin-bottom: 20px;
}

.loginPage .loginPanel .loginPanelInner .loginForm .form {
  width: 80%
}

.loginPage .loginPanel .loginPanelInner .loginForm .form .loginBtn {
  width: 100%;
}

.loginPage .loginPanel .loginPanelInner .loginForm .form .captchaSrc {
  width: 100px;
  height: 100%;
  padding-left: 10px;
}

.loginPage .loginPanel .loginPanelInner .loginForm .form .captchaSrc img {
  width: 100px;
  height: 100%;
  cursor: pointer;
}

.loginPage .loginPanel .loginPanelInner .loginForm .form .registerBtn {
  text-align: right;
  line-height: 40px;
  margin-bottom: 5px;
}

.footer {
  position: fixed;
  bottom: 0px;
  line-height: 40px;
  text-align: center;
  font-size: 14px;
  color: #fff;
}
</style>