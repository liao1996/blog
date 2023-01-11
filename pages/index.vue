<template>
  <div class="container">
    <el-backtop></el-backtop>
    <nav>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="1">全部</el-menu-item>
        <el-submenu index="2">
          <template slot="title">分类</template>
          <el-menu-item index="3">前端</el-menu-item>
          <el-menu-item index="4">算法</el-menu-item>
          <el-menu-item index="5">架构</el-menu-item>
          <el-submenu index="6">
            <template slot="title">其他</template>
            <el-menu-item index="7">生活琐事</el-menu-item>
            <el-menu-item index="8">心灵鸡汤</el-menu-item>
            <el-menu-item index="9">天马行空</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-menu-item index="0">
          <a href="http://www.eightythousand.com:518" target="_blank">小喵八万</a>
        </el-menu-item>
        <el-submenu index="10">
          <template slot="title">👭🔗</template>
          <el-menu-item index="10-1">
            <a href="https://wangjinxu.top" target="_blank" style="width: 100%;display: block;">霜寒</a>
          </el-menu-item>
        </el-submenu>
      </el-menu>
      <div class="line"></div>
    </nav>
    <div class="head_left" :style="{top:headTop+'px',left:headLeft+'%'}">
      <div class="head_left_box">
        <div class="notice_box">
          <p class="notice_title">
            <i class="el-icon-date" style="line-height: 1px;margin-right: 10px;"></i>择一隅孤独终老
          </p>
          <transition-group name="noticeList" tag="ul" class="notice_list">
            <li v-for="(item,index) in notice.slice(0,4)" :key="item.id">
              <i v-if="index===0 || index===1" class="iconfont icon-remen" style="color:red"></i>
              <span class="notice_time">{{item.time}}</span>
              <p class="notice_content">{{item.content}}</p>
            </li>
          </transition-group>
        </div>      
          <i class="el-icon-right seeall" @click="drawer = true"></i>     
      </div>
    </div>
    <div>
      <transition-group
        name="bolgList"
        tag="ul"
        class="bolg_list"
        v-infinite-scroll="loadMore"
        :infinite-scroll-disabled="disabled "
        infinite-scroll-distance="10"
      >
        <li
          v-for="(item,index) in blogList"
          :key="item.title"
          :hid="item.id"
          :data-index="index"
          :class="{bolg_click:bolgListClick==item.id}"
          @mousedown="BolgDown"
          @mouseup="BolgUp"
        >
          <nuxt-link :to="{ name: 'detail-id', path:'/detail' ,query: {id: item.id}}">
            <div class="list_img_box">
              <span v-if="item.isTop===1" class="isTop">置顶</span>
              <div class="list_title_box">
                <div class="list_title">
                  <i class="el-icon-d-arrow-left" size="20"></i>
                  {{item.title}}
                  <i class="el-icon-d-arrow-right" size="20"></i>
                </div>
                <p
                  style="text-align: center;color: rgba(92,107,119,0.8);"
                  class="list_time"
                >发布日期：&nbsp;&nbsp;&nbsp;{{item.time}}</p>
              </div>
            </div>
            <div class="list_info">
              <p class="list_content">{{text(item.content) | FontFilter}}</p>
              <div class="list_record">
                <span class="list_record_span" style="margin-left: 0px;">
                  <i class="el-icon-view" size="15"></i>
                  &nbsp;&nbsp;&nbsp;{{item.readNum}}
                </span>
                <span class="list_record_span">
                  <i class="el-icon-star-on" size="15"></i>
                  &nbsp;&nbsp;&nbsp;{{item.loveNum}}
                </span>
                <!-- <span class="list_record_span">
                  <i class="el-icon-chat-line-round" size="15"></i>
                  &nbsp;&nbsp;{{item.fontNum}}
                </span>-->
                <div class="list_tag">
                  <div class="tag">
                    <i
                      :class="$store.state.style.tag[item.tag].style"
                      :style="{color:$store.state.style.tag[item.tag].color}"
                    >&nbsp;{{item.tag}}</i>
                  </div>
                </div>
              </div>
            </div>
          </nuxt-link>
        </li>
      </transition-group>

      <el-alert v-if="loading" title="加载中..." type="info" :closable="false" center show-icon></el-alert>
      <el-alert v-if="noMore" title="没有更多了" type="success" :closable="false" center show-icon></el-alert>
    </div>

    <div class="head_right" :style="{top:headTop+'px',right:headRight+'%'}">
      <el-card shadow="hover">
        <div slot="header">
          <span>我在人间凑数，在尘世漫步</span>
          <el-button
            style="float: right; padding: 3px 0;"
            type="text"
            @click="handleProfile"
            icon="el-icon-refresh-right"
          ></el-button>
        </div>
        <vab-profile v-if="profileShow" :avatar="headImg" user-name="小透明手辰"></vab-profile>
      </el-card>
      <a href="https://beian.miit.gov.cn">京ICP备20016846号</a>
    </div>

    <el-drawer
      :visible.sync="drawer"
      :direction="direction"
      :with-header="false"
      style=" overflow: scroll"
    >
      <transition-group name="noticeList" tag="ul" class="notice_list" style="margin: 20px 30px ;">
        <li v-for="(item,index) in notice" :key="item.id">
          <i class="el-icon-paperclip" :style="{color:index%2===0 ? 'red ':'blue'}"></i>
          <span class="notice_time">{{item.time}}</span>
          <p class="notice_content">{{item.content}}</p>
        </li>
      </transition-group>
    </el-drawer>
  </div>
</template>

<script>
import headImg from "~/assets/img/header.jpg";
import VabProfile from "~/components/VabProfile";
import { getBlogList, getAnnouncement } from "~/api/articlelist";
import $ from "jquery";
const getdata = (id = 0, falge = 0, size = 0) => {
  return getBlogList(id, falge, size)
    .then((res) => {
      if (res.resultCode == 1) {
        return res.result;
      }
    })
    .catch((err) => {});
};
export default {
  name: "Index",
  components: {
    VabProfile,
  },
  data() {
    return {
      profileShow: true,
      headImg: headImg,
      headTop: 150,
      headRight: 5,
      headLeft: 5,
      activeIndex: "1",
      notice: [],
      bolgListClick: "",
      loading: false,
      falge: 0, //文章类型
      size: 0,
      drawer: false, //是否查看所有公告
      direction: "ltr",
    };
  },
  computed: {
    blogList() {
      return this.$store.state.global.blogList;
    },
    disabled() {
      return this.loading || this.noMore;
    },
    noMore() {
      return this.blogList.length >= this.count;
    },
    count() {
      return this.$store.state.global.count;
    },
  },
  async fetch({ store }) {
    const data = await getdata();
    // console.log(data)
    store.commit("global/updateBlogList", data.data);
    store.commit("global/updateCount", data.count);
  },
  mounted() {
    this.BindEvent();
    this.handleProfile();
    this.getAnnouncementData();
  },
  methods: {
    //公告栏
    getAnnouncementData() {
      getAnnouncement().then((res) => {
        this.notice = res.result.announcement;
      });
    },
    handleProfile() {
      this.profileShow = false;
      setTimeout(() => {
        this.profileShow = true;
      }, 100);
    },
    loadMore() {
      if (!this.noMore) {
        this.loading = true;
        this.size += 3;
        getdata(0, this.falge, this.size).then((res) => {
          const newBlogList = this.blogList.concat(res.data);
          this.$store.commit("global/updateBlogList", newBlogList);
          this.$store.commit("global/updateCount", res.count);
          this.loading = false;
        });
      }
    },
    handleSelect(key) {
      if (!isNaN(key)) {
        this.falge = key;
        this.size = 3;
        getdata(0, this.falge).then((res) => {
          this.$store.commit("global/updateBlogList", res.data);
          this.$store.commit("global/updateCount", res.count);
        });
      }
    },
    BolgDown(el) {
      this.bolgListClick = el.currentTarget.getAttribute("hid");
    },
    BolgUp(el) {
      this.bolgListClick = "";
    },
    BindEvent() {
      $(document).on("scroll", (ev) => {
        if (this.$route.path == "/") {
          this.headTop = $(document).scrollTop() + 150;
        }
      });
    },
    text(str) {
      str = str.replace(/<\/?[^>]*>/g, ""); //去除HTML tag
      str = str.replace(/[ | ]*\n/g, "\n"); //去除行尾空白
      str = str.replace(/\n[\s| | ]*\r/g, "\n"); //去除多余空行
      str = str.replace(/&nbsp;/gi, ""); //去掉&nbsp;
      str = str.replace(/\s/g, ""); //将空格去掉
      return str;
    },
  },
  filters: {
    FontFilter(val) {
      return val.substr(0, 200) + "...";
    },
  },
};
</script>

<style lang="stylus" scoped>
@import url('~/assets/pagecss/blogmain.css');
@import url('~/assets/pagecss/blogmainmobile.css');

.container {
  nav {
    left: 0;
    background-color: #fff;
    position: fixed;
    top: 5rem;
    width: 100%;
    z-index: 102;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    transition: all 0.2s;
    transform: translateZ(0);

    @media screen and (min-width: 960px) {
      .el-menu-demo {
        left: 38rem;
      }
    }
  }

  /deep/ .el-alert--success, .el-alert--info {
    width: 55vw;
    margin: auto;
    top: 25px;
  }

  /deep/ .el-backtop {
    bottom: 10px !important;
  }

  /deep/ .el-drawer {
    width: 90%;
    overflow-y: auto;
  }
   /deep/ :focus {
    outline: 0;
  }
}
</style>
