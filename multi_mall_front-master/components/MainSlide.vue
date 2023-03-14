<template>
  <div class="main_slide_wrap">
    <div class="main_slide_inner">
      <div class="swiper_wrap">
<!--        <swiper class="swiper" :options="mainSlide">-->
<!--          <swiper-slide v-for="(item, i) in mainSlide.list" :key="mainSlide.list.src" >-->
<!--&lt;!&ndash;            <div :style='styleObject(`${item.backgroundImage}`, `${item.backgroundImage}`)'>&ndash;&gt;-->
<!--&lt;!&ndash;            <div v-bind:style="{backgroundColor: item.backgroundColor? item.backgroundColor : '', backgroundImage: item.backgroundImage? item.backgroundImage : ''}"></div>&ndash;&gt;-->
<!--            <div class="main_slide_style" :style="`background: url(${item.backgroundImage}) center ${item.backgroundColor? item.backgroundColor : ''}`">-->
<!--&lt;!&ndash;            <div class="main_slide_style test" :style="{ backgroundColor: item.backgroundColor, backgroundImage: item.backgroundImage }">&ndash;&gt;-->
<!--              <template v-if="mainSlide.list.inSite">-->
<!--                <nuxt-link :to="item.link">-->
<!--                  <div style="font-size: 12px; display: inline-block; width: 50px; height: 50px">???{{ item.backgroundImage }}</div>-->
<!--                  <img :src="item.src ? item.src : ''"/>-->
<!--                </nuxt-link>-->
<!--              </template>-->
<!--              <template v-if="mainSlide.list.inSite && item.link">-->
<!--                <a :href="item.link">-->
<!--                  <img :src="item.src ? item.src : ''"/>-->
<!--                </a>-->
<!--              </template>-->
<!--              <template v-else>-->
<!--                <div>-->
<!--                  <img :src="item.src ? item.src : ''"/>-->
<!--                </div>-->
<!--              </template>-->
<!--            </div>-->
<!--          </swiper-slide>-->
<!--        </swiper>-->

        <swiper class="swiper" :options="mainSlide">
          <swiper-slide >
            <div class="main_slide_style" style="background: url('https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/main/molly_app_banner_back.png') center calc(100%); background-repeat: repeat-x;">
              <div>
                <img src='https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/main/molly_app_banner.png'/>
              </div>
            </div>
          </swiper-slide>
        </swiper>

<!--        <div class="center_wrap">-->
<!--          <div class="page_controller_wrap">-->
<!--            <div class="num_wrap">-->
<!--              <span id="current"></span>-->
<!--              <span>/</span>-->
<!--              <span id="total"></span>-->
<!--            </div>-->
<!--            <div class="swiper-button-prev main_prev swiper-button-white hidden-xs" slot="button-prev"></div>-->
<!--            <div class="swiper-button-next main_next swiper-button-white hidden-xs" slot="button-next"></div>-->
<!--          </div>-->
<!--          <ul class="number_swiper-pagination" slot="pagination"></ul>-->
<!--        </div>-->

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainSlide',
  data: () => ({
    mainSlide: {
      slidesPerView: 1,
      slidesPerGroup: 1,
      speed: 1500,
      autoplay: {
        delay: 2500,
      },
      // loop: true,
      on: {
        init: () => {
          // const total = document.getElementsByClassName('main_slide_style').length;
          // if (total) {
          //   document.getElementById('total').innerText = `${total - 2}`;
          // } else {
          //   document.getElementById('total').innerText = '';
          // }
        },
        // slideChangeTransitionEnd: () => {
        //   const current = document.getElementsByClassName('swiper-slide-active')[0].getAttribute('data-swiper-slide-index');
        //   if (current) {
        //     document.getElementById('current').innerText = `${Number(current) + 1}`;
        //   } else {
        //     document.getElementById('current').innerText = '';
        //   }
        // },
      },
      pagination: {
        // el: '.number_swiper-pagination',
        // clickable: true,
        // dynamicBullets: true,
        // type: 'fraction',
        // type: 'custom',

        // renderBullet: (index, className) => {
        //   const bullet = `<li class="${className}">${index + 1}</li>`;
        //   return bullet;
        // },

      },
      // navigation: {
      //   nextEl: '.main_next',
      //   prevEl: '.main_prev',
      // },

      list: {
        slide0: {
          src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/main/molly_app_banner.png',
          backgroundColor: '',
          backgroundImage: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/main/molly_app_banner_back.png',
          link: '',
          inSite: true,
        },
        // slide1: {
        //   src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/main_banner_pc_01.png',
        //   backgroundColor: '#FDFF8A',
        //   backgroundImage: '',
        //   link: '/store/33',
        //   inSite: true,
        // },
        // slide3: {
        //   src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/main_banner_pc_03.png',
        //   backgroundColor: '#F5C760',
        //   backgroundImage: '',
        //   link: '/price_group?cate=610a479f5f64f2df12e3f443',
        //   inSite: true,
        // },
        // slide4: {
        //   src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/main_banner_pc_04.png',
        //   backgroundColor: '#9BCC9E',
        //   backgroundImage: '',
        //   link: '/price_group?cate=610a47da5f64f2df12e3f9c4',
        //   inSite: true,
        // },
        // slide5: {
        //   src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/main_banner_pc_05.png',
        //   backgroundColor: '#F7C9C9',
        //   backgroundImage: '',
        //   link: '/price_group?cate=610a48155f64f2df12e3fe68',
        //   inSite: true,
        // },
        // slide6: {
        //   src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/main_banner_pc_06.png',
        //   backgroundColor: '#FDFF8A',
        //   backgroundImage: '',
        //   link: '/price_group?cate=610a47805f64f2df12e3f0ab',
        //   inSite: true,
        // },
        // slide7: {
        //   src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/main_banner_pc_07.png',
        //   backgroundColor: '#F8C895',
        //   backgroundImage: '',
        //   link: '/price_group?cate=610a47675f64f2df12e3ecc0',
        //   inSite: true,
        // },
        // slide8: {
        //   src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/main_banner_pc_08.png',
        //   backgroundColor: '#CAD8DD',
        //   backgroundImage: '',
        //   link: '/price_group?cate=610a48355f64f2df12e400b3',
        //   inSite: true,
        // },
        // slide9: {
        //   src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/main_banner_pc_09.png',
        //   backgroundColor: '#DFDFD2',
        //   backgroundImage: '',
        //   link: '/price_group?cate=610a48315f64f2df12e40072',
        //   inSite: true,
        // },
        // slide10: {
        //   src: 'https://multi-mall.s3.ap-northeast-2.amazonaws.com/banner/main_banner_pc_10.png',
        //   backgroundColor: '#9194C8',
        //   backgroundImage: '',
        //   link: '/store/37',
        //   inSite: true,
        // },
      },
    },
  }),
};
</script>
