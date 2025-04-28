<script setup lang="ts">
import {
  reactive,
  ref,
  watch,
} from 'vue';
import {
  ElButton,
  ElLoading,
  ElMessage,
  FormInstance,
  FormRules,
} from 'element-plus';
import useLoginStore from "@/stores/login";
import {useRouter} from 'vue-router';
import {ArrowRight, Fold, User} from "@element-plus/icons-vue";
import type IAccount from "@/stores/login";

// 表单校验规则
// 定义 RuleForm 类型
interface RuleForm {
  account: string;
  password: string;
  captcha: string;
}

// 路由状态
const router = useRouter();

// 登陆表单数据
const activeName = ref('account');
const loginForm = reactive({
  account: localStorage.getItem('account') ?? '',
  password: localStorage.getItem('password') ?? '',
  captcha: ''
})

// 使用类型化的 ref 和初始化逻辑
const rememberPassword = ref<boolean>(false)
if (localStorage.getItem('isRemPwd') == 'true') {
  rememberPassword.value = true
}

// // 监听变化并安全存储
watch(rememberPassword, (newValue) => {
  localStorage.setItem('isRemPwd', String(newValue))
})
// /**
//  * 提交
//  */
const loginStore = useLoginStore()
const submitForm = async (formEl: FormInstance | undefined) => {
  if (rememberPassword.value) {
    localStorage.setItem('account', loginForm.account)
    localStorage.setItem('password', loginForm.password)
  } else {
    localStorage.removeItem('account')
    localStorage.removeItem('password')
  }
  if (!formEl) return;
  const loading = ElLoading.service({
    lock: true,
    text: '正在登陆',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  try {
    const valid = await formEl.validate();
    if (valid) {
      // 根据登录类型分支处理
      if (activeName.value === 'account') {
        const success = await loginStore.accountLogin({
          account: loginForm.account,
          password: loginForm.password
        })
        if (success) {
          const getRole = await loginStore.getRole(Number(loginStore.id))
          console.log("userInfo" + loginStore.userInfo)
          const getMenus = await loginStore.getRoleMenusById(Number(loginStore.userInfo.role.id))
          console.log(getRole,getMenus)
          if (getRole && getMenus) {
            console.log("尝试跳转")
            const localRoutes:RouteRecordRaw[]=[]
            const files:Record<string, any>=import.meta.glob('@/router/**/*.ts',{
              eager:true
            })
            for (const key in files) {
              const module = files[key].default
              localRoutes.push(module)
            }
            for (const menu of loginStore.userMenus) {
              for (const submenu of menu.children) {
                const route=localRoutes.find((item)=>item.path===submenu.path)
                if (route) router.addRoute("main",route)
              }
            }
            await router.push('/home')
          }
        } else {
          ElMessage.error('账号或密码错误')
        }
        loading.close()
      } else if (activeName.value === 'phone') {
        // 添加手机登录逻辑
        throw new Error('手机登录功能尚未实现');
      } else {
        console.log('表单验证不通过');
        loading.close();
      }
    }
  } catch (error) {
    console.error('登录流程异常:', error);
    ElMessage.error(`操作失败: ${error instanceof Error ? error.message : '未知错误'}`);
    loading.close();
  }
}

// 验证码路径
const captchaSrc = ref('/api/login/captcha');
const formRef = ref<FormInstance>()
/**
 * 刷新验证码
 */
const changecaptchaSrc = () => {
  captchaSrc.value = '/api/login/captcha?t_=' + new Date().getTime();
}

const rules = reactive<FormRules<RuleForm>>({
  account: [
    {required: true, message: '账号不能为空', trigger: 'blur'},
    {
      min: 6,
      max: 20,
      message: '长度在 6 到 20 个字符',
      trigger: 'blur'
    },
    {
      pattern: /^[a-zA-Z0-9_]+$/,
      message: '只能包含字母、数字和下划线',
      trigger: 'blur'
    }
  ],
  password: [
    {required: true, message: '密码不能为空', trigger: 'blur'},
    {
      min: 6,
      message: '密码长度不能小于6位',
      trigger: 'blur'
    },
    {
      pattern: /^(?=.*[A-Za-z])(?=.*\d).+$/,
      message: '必须包含字母和数字',
      trigger: 'blur'
    }
  ],
  captcha: [
    {required: true, message: '验证码不能为空', trigger: 'blur'},
    {type: 'number', message: '验证码必须为数字', trigger: 'blur'}
  ]
})
</script>

<template>
  <div class="loginPage">
    <div class="main">
      <el-tabs type="border-card" :stretch=true v-model="activeName">
        <el-tab-pane label="账号密码登陆" name="account">
          <template #label>
            <div class="label">
              <el-icon>
                <User/>
              </el-icon>
              <span>账号密码登陆</span>
            </div>
          </template>
          <el-card class="loginPanel">
            <div class="loginPanelInner">
              <div class="logo">
                <img src="../../assets/images/logo.png">
              </div>
              <el-divider direction="vertical" border-style="dashed" class="split"/>
              <div class="loginForm">
                <div class="systemName"> 账号密码登陆</div>
                <el-form ref="formRef" size="large" :model="loginForm" label-width="90px" class="form" :rules="rules">
                  <el-form-item label="账号：" prop="account">
                    <el-input v-model="loginForm.account" placeholder="请输入账号" autocomplete="off"
                              suffix-icon="UserFilled"/>
                  </el-form-item>
                  <el-form-item label="密码：" prop="password">
                    <el-input v-model="loginForm.password" placeholder="请输入密码" type="password"
                              autocomplete="off" suffix-icon="Lock"/>
                  </el-form-item>
                  <el-form-item label="验证码：">
                    <div style="display: flex;width: 100%;">
                      <div style="flex:1">
                        <el-input v-model.number="loginForm.captcha" placeholder="请输入验证码"/>
                      </div>
                      <div class="captchaSrc">
                        <img :src="captchaSrc" @click="changecaptchaSrc">
                      </div>
                    </div>
                  </el-form-item>
                  <div class="registerBtn">
                    <el-link type="primary" href="/register" :underline="false">
                      去账户？点击注册
                    </el-link>
                  </div>
                  <div class="rmPlogin">
                    <div style="margin-left: 20px;">
                      <el-checkbox v-model="rememberPassword">记住密码</el-checkbox>
                    </div>
                    <div>
                      <el-button type="primary" @click="submitForm(formRef)" class="loginBtn">
                        登陆
                      </el-button>
                    </div>
                  </div>
                </el-form>
              </div>
            </div>
          </el-card>
        </el-tab-pane>
        <el-tab-pane label="手机号登陆" name="phone">
          <template #label>
            <div class="label">
              <el-icon>
                <Iphone/>
              </el-icon>
              <span>手机号登陆</span>
            </div>
          </template>
          <el-card class="loginPanel">
            <div class="loginPanelInner">
              <div class="logo">
                <img src="../../assets/images/logo.png">
              </div>
              <el-divider direction="vertical" border-style="dashed" class="split"/>
              <div class="loginForm">
                <div class="systemName"> 手机号登陆</div>
                <el-form ref="" size="large" :model="loginForm" label-width="120px" class="form">
                  <!--                  表单验证失败问题，配置了两个表单的验证都是formRef,导致第二个覆盖了第一个绑定，相当于现在的formRef对第二个表单进行验证，然后并未绑定任何prop-->
                  <el-form-item label="手机号：">
                    <el-input v-model="loginForm.account" placeholder="请输入手机号" autocomplete="off"
                              suffix-icon="UserFilled"/>
                  </el-form-item>
                  <el-form-item label="密码：">
                    <el-input v-model="loginForm.password" placeholder="请输入密码" type="password"
                              autocomplete="off" suffix-icon="Lock"/>
                  </el-form-item>
                  <el-form-item label="验证码：">
                    <div style="display: flex;width: 100%;">
                      <div style="flex:1">
                        <el-input v-model.number="loginForm.captcha" placeholder="请输入验证码"/>
                      </div>
                      <div class="captchaSrc">
                        <img :src="captchaSrc" @click="changecaptchaSrc">
                      </div>
                    </div>
                  </el-form-item>
                  <div class="registerBtn">
                    <el-link type="primary" href="/register" :underline="false">
                      去账户？点击注册
                    </el-link>
                  </div>
                  <el-form-item>
                    <el-button type="primary" @click="submitForm(formRef)" class="loginBtn">
                      登陆
                    </el-button>
                    <router-link to="/">
                      <el-button type="danger">跳转</el-button>
                    </router-link>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="footer">
      @Copyright 君君军通用管理系统 备案信息：陕432432432
    </div>
  </div>
</template>

<style scoped>
.rmPlogin {
  display: flex;
  justify-content: space-around;
  content-position: start;
  align-items: center;
}

.common-layout {
  position: fixed;
  inset: 0;
}

.main {
  position: absolute;
  min-height: 300px;
  min-width: 300px;
}

.label {
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    margin-left: 5px;
  }
}

.loginPage {
  position: relative;
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

.loginPage .loginPanel .loginPanelInner .loginForm .form {
  text-align: right;
  line-height: 40px;
  margin-bottom: 5px;
}

.registerBtn {
  display: flex;
  justify-content: center;
  align-items: center;
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