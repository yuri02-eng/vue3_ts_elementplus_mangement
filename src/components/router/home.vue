<script setup>
// 正确导入组件（Element Plus 组件名使用 PascalCase）
import { ElCarousel, ElCarouselItem } from 'element-plus'

// 示例数据（推荐使用真实数据源）
const carouselItems = [
  { id: 1, img: new URL('@/assets/img/1.jpg', import.meta.url).href},
  { id: 2, img: new URL('@/assets/img/2.jpg', import.meta.url).href},
  { id: 3, img: new URL('@/assets/img/3.jpg', import.meta.url).href }
]
</script>

<template>
  <div class="home-container">
    <h1>Home</h1>
    <div class="carousel-wrapper">
      <!-- 添加 height 属性和箭头控制 -->
      <el-carousel
          indicator-position="outside"
          :height="'400px'"
          arrow="always"
      >
        <!-- 使用数据驱动循环 -->
        <el-carousel-item
            v-for="item in carouselItems"
            :key="item.id"
        >
          <div class="carousel-item">
            <!-- 使用动态路径和错误处理 -->
            <img
                :src="item.img"
                alt="Carousel Image"
                class="carousel-image"
                @error="handleImageError"
            />
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  padding: 20px;
}

.carousel-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

/* 轮播项容器 */
.carousel-item {
  height: 400px; /* 与 Carousel 高度一致 */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa; /* 备用背景色 */
}

/* 图片样式 */
.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 保持比例填充容器 */
}


:deep(.el-carousel__indicators) {
  bottom: -40px;
}

:deep(.el-carousel__indicator button) {
  background-color: #c0c4cc;
  &.is-active {
    background-color: #409eff;
  }
}
.el-carousel__item {
  /*position: relative;  组件内部实现的逻辑使用到了这个属性，如果设置会覆盖原有逻辑，从而导致了轮播图异常 */
  overflow: hidden;
  border-radius: 8px;
  transition: all 0.3s ease;
}
</style>