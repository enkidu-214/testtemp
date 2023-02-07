/* eslint-disable */
<template>
  <div class="login-container">
    <div class="login-area">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        autocomplete="on"
        label-position="left"
      >
        <div class="title-container">
          <h3 class="title">登录</h3>
        </div>
        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="用户名"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="on"
          />
        </el-form-item>
        <el-tooltip
          v-model="capsTooltip"
          content="Caps lock is On"
          placement="right"
          manual
        >
          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="密码"
              name="password"
              tabindex="2"
              autocomplete="on"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon
                :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
              />
            </span>
          </el-form-item>
        </el-tooltip>
        <el-button
          :loading="loading"
          type="primary"
          style="width: 80%; margin-bottom: 30px"
          @click.native.prevent="handleLogin"
          >登录</el-button
        >
        <el-button
          class="thirdparty-button"
          type="primary"
          @click="showDialog = true"
        >
          注册
        </el-button>
      </el-form>

      <el-dialog width="500px" title="注册" :visible.sync="showDialog">
        <Register />
      </el-dialog>
    </div>
  </div>
  <!-- <head-top
      :head-title="loginWay ? '登录' : '密码登录'"
      signinUp="true"
      goBack="true"
    >
    </head-top> -->
</template>

<script>
import headTop from "../../components/header/head";
import Register from "./component/register.vue";
import SvgIcon from "../../components/SvgIcon/SvgIcon.vue";
//import alertTip from '../../components/common/alertTip'
import { localapi, proapi, imgBaseUrl } from "../../config/env";
import { mapState, mapMutations } from "vuex";
import {
  mobileCode,
  checkExsis,
  sendLogin,
  getcaptchas,
  accountLogin,
} from "../../services/getData";

export default {
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入用户名"));
      }
      var reg = /^[a-zA-Z]\w{4,15}$/;
      if (!reg.test(value)) {
        return callback(new Error("字母开头，5-16字节，字母数字下划线组合"));
      }
      callback();
    };
    const validatePassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        var reg = /^[\u0021-\u007E]{6,16}$/;
        if (!reg.test(value)) {
          return callback(new Error("长度6-16"));
        }
        callback();
      }
    };
    return {
      loginWay: false, //登录方式，默认短信登录
      showPassword: false, // 是否显示密码
      phoneNumber: null, //电话号码
      mobileCode: null, //短信验证码
      validate_token: null, //获取短信时返回的验证值，登录时需要
      computedTime: 0, //倒数记时
      userInfo: null, //获取到的用户信息
      userAccount: null, //用户名
      passWord: null, //密码
      captchaCodeImg: null, //验证码地址
      codeNumber: null, //验证码
      showAlert: false, //显示提示组件
      alertText: null, //提示的内容

      loginForm: {
        username: "",
        password: "",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      passwordType: "password",
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          // FIXME
          // this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true,
    },
  },
  created() {
    this.getCaptchaCode();
  },
  mounted() {
    if (this.loginForm.username === "") {
      this.$refs.username.focus();
    } else if (this.loginForm.password === "") {
      this.$refs.password.focus();
    }
  },
  components: {
    headTop,
    Register,
    SvgIcon,
    //alertTip,
  },
  computed: {
    //判断手机号码
    rightPhoneNumber: function () {
      return /^1\d{10}$/gi.test(this.phoneNumber);
    },
  },
  methods: {
    ...mapMutations(["RECORD_USERINFO"]),

    checkCapslock(e) {
      const { key } = e;
      this.capsTooltip = key && key.length === 1 && key >= "A" && key <= "Z";
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("monitor", this.loginForm)
            .then(() => {
              console.log(
                "login sucess, path = " +
                  this.redirect +
                  ", query = " +
                  this.otherQuery
              );
              this.$router.push({
                path: this.redirect || "/",
                query: this.otherQuery,
              });
              this.loading = false;
            })
            .catch(() => {
              console.log("login failed");
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    //改变登录方式
    changeLoginWay() {
      this.loginWay = !this.loginWay;
    },
    //是否显示密码
    changePassWordType() {
      this.showPassword = !this.showPassword;
    },
    //获取验证吗，线上环境使用固定的图片，生产环境使用真实的验证码
    async getCaptchaCode() {
      let res = await getcaptchas();
      this.captchaCodeImg = res.code;
    },
    //获取短信验证码
    async getVerifyCode() {
      if (this.rightPhoneNumber) {
        this.computedTime = 30;
        this.timer = setInterval(() => {
          this.computedTime--;
          if (this.computedTime == 0) {
            clearInterval(this.timer);
          }
        }, 1000);
        //判读用户是否存在
        let exsis = await checkExsis(this.phoneNumber, "mobile");
        if (exsis.message) {
          this.showAlert = true;
          this.alertText = exsis.message;
          return;
        } else if (!exsis.is_exists) {
          this.showAlert = true;
          this.alertText = "您输入的手机号尚未绑定";
          return;
        }
        //发送短信验证码
        let res = await mobileCode(this.phoneNumber);
        if (res.message) {
          this.showAlert = true;
          this.alertText = res.message;
          return;
        }
        this.validate_token = res.validate_token;
      }
    },
    //发送登录信息
    async mobileLogin() {
      if (this.loginWay) {
        if (!this.rightPhoneNumber) {
          this.showAlert = true;
          this.alertText = "手机号码不正确";
          return;
        } else if (!/^\d{6}$/gi.test(this.mobileCode)) {
          this.showAlert = true;
          this.alertText = "短信验证码不正确";
          return;
        }
        //手机号登录
        this.userInfo = await sendLogin(
          this.mobileCode,
          this.phoneNumber,
          this.validate_token
        );
      } else {
        if (!this.userAccount) {
          this.showAlert = true;
          this.alertText = "请输入手机号/邮箱/用户名";
          return;
        } else if (!this.passWord) {
          this.showAlert = true;
          this.alertText = "请输入密码";
          return;
        } else if (!this.codeNumber) {
          this.showAlert = true;
          this.alertText = "请输入验证码";
          return;
        }
        //用户名登录
        this.userInfo = await accountLogin(
          this.userAccount,
          this.passWord,
          this.codeNumber
        );
      }
      //如果返回的值不正确，则弹出提示框，返回的值正确则返回上一页
      if (!this.userInfo.user_id) {
        this.showAlert = true;
        this.alertText = this.userInfo.message;
        if (!this.loginWay) this.getCaptchaCode();
      } else {
        this.RECORD_USERINFO(this.userInfo);
        this.$router.go(-1);
      }
    },
    closeTip() {
      this.showAlert = false;
    },
  },
};
</script>


<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

// $bg:#283443;
$bg: #ff0000;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
@import "../../style/mixin";

$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  height: 100%;
  width: 100%;
  background-color: $bg;
  /*background: url("http://www.lanct.com/uploads/allimg/20200106/1-20010621425CK.png");*/
  /*background-repeat: no-repeat;*/
  overflow: hidden;
  .login-area {
    margin: 15% 30%;
    border: solid;
    border-color: rgba(21, 34, 51, 0.1);
    background:rgba(21, 34, 51, 0.7);
    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      // padding: 160px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }

    .thirdparty-button {
      position: absolute;
      width: 15%;
    }

    @media only screen and (max-width: 470px) {
      .thirdparty-button {
        display: none;
      }
    }
  }
}

.loginContainer {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  /*background: url("http://www.lanct.com/uploads/allimg/20200106/1-20010621425CK.png");*/
  /*background-repeat: no-repeat;*/
  overflow: hidden;
}
.change_login {
  position: absolute;
  @include ct;
  right: 0.75rem;
  @include sc(0.7rem, #fff);
}

.loginForm {
  background-color: #fff;
  margin-top: 0.6rem;
  .input_container {
    display: flex;
    justify-content: space-between;
    padding: 0.6rem 0.8rem;
    border-bottom: 1px solid #f1f1f1;
    input {
      @include sc(0.7rem, #666);
    }
    button {
      @include sc(0.65rem, #fff);
      font-family: Helvetica Neue, Tahoma, Arial;
      padding: 0.28rem 0.4rem;
      border: 1px;
      border-radius: 0.15rem;
    }
    .right_phone_number {
      background-color: #4cd964;
    }
  }
  .phone_number {
    padding: 0.3rem 0.8rem;
  }
  .captcha_code_container {
    height: 2.2rem;
    .img_change_img {
      display: flex;
      align-items: center;
      img {
        @include wh(3.5rem, 1.5rem);
        margin-right: 0.2rem;
      }
      .change_img {
        display: flex;
        flex-direction: "column";
        flex-wrap: wrap;
        width: 2rem;
        justify-content: center;
        p {
          @include sc(0.55rem, #666);
        }
        p:nth-of-type(2) {
          color: #3b95e9;
          margin-top: 0.2rem;
        }
      }
    }
  }
}
.login_tips {
  @include sc(0.5rem, red);
  padding: 0.4rem 0.6rem;
  line-height: 0.5rem;
  a {
    color: #3b95e9;
  }
}
.login_container {
  margin: 0 0.5rem 1rem;
  @include sc(0.7rem, #fff);
  background-color: #4cd964;
  padding: 0.5rem 0;
  border: 1px;
  border-radius: 0.15rem;
  text-align: center;
}
.button_switch {
  background-color: #ccc;
  display: flex;
  justify-content: center;
  @include wh(2rem, 0.7rem);
  padding: 0 0.2rem;
  border: 1px;
  border-radius: 0.5rem;
  position: relative;
  .circle_button {
    transition: all 0.3s;
    position: absolute;
    top: -0.2rem;
    z-index: 1;
    left: -0.3rem;
    @include wh(1.2rem, 1.2rem);
    box-shadow: 0 0.026667rem 0.053333rem 0 rgba(0, 0, 0, 0.1);
    background-color: #f1f1f1;
    border-radius: 50%;
  }
  .trans_to_right {
    transform: translateX(1.3rem);
  }
  span {
    @include sc(0.45rem, #fff);
    transform: translateY(0.05rem);
    line-height: 0.6rem;
  }
  span:nth-of-type(2) {
    transform: translateY(-0.08rem);
  }
}
.change_to_text {
  background-color: #4cd964;
}
.to_forget {
  float: right;
  @include sc(0.6rem, #3b95e9);
  margin-right: 0.3rem;
}
</style>
