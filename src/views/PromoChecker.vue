<template>
  <q-page>
    <q-btn label="SCRAPE!" @click="startScrape()" />
  </q-page>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      options: {
        token: '649C4B750F3E518325D31A61CA5FE500',
      },
      urls: {
        pa: [
          'https://www.bathandbodyworks.pa/buscapagina?fq=C%3a%2f24%2f&O=OrderByReleaseDateDESC&PS=12&sl=f9ecb8dc-ce02-48fc-ae85-de11e131655f&cc=12&sm=0&PageNumber=',
        ],
      },
      noPromoItems: [],
      emptyPage: false,
    }
  },
  methods: {
    async startScrape() {
      // for (let cc in this.urls) {
      //   for (let url in this.urls[cc]) {
      //     for (let i = 1; i <= 1; i++) {
      //       // console.log(`cc: ${cc} | i: ${i} - ${this.urls[cc][url]}${i}`)
      //       await this.scrape(this.urls[cc], i)
      //     }
      //   }
      // }
      console.log(`Starting scrape at ${this.urls.pa[0]}${this.pageNo}`)
      for (let i = 1; i <= 5; i++) {
        console.log(i)
        if (!this.emptyPage) {
          await this.scrape(this.urls.pa[0], i)
        } else {
          break
        }
      }

      // let index = 1
      // while (!this.emptyPage) {
      //   await this.scrape(this.urls.pa[0], index)
      //   index++
      // }
    },
    scrape(url, page) {
      this.options.url = url + page
      axios
        .post('https://api.scraperbox.com/scrape', this.options)
        .then(response => {
          if (response.data.length > 0) {
            this.extractItems(response.data)
          } else {
            this.emptyPage = true
          }
        })
        .catch(error => {
          console.error(error.response.data.errors || error)
        })
    },
    extractItems(code) {
      let el = document.createElement('html')
      el.innerHTML = code
      let items = el.getElementsByClassName('product-item__wrapper')
      items.forEach(item => {
        if (!item.children[0].children[5].innerHTML.includes('flag')) {
          this.noPromoItems.push(item)
        }
      })
      console.log(this.noPromoItems)
    },
  },
}
</script>
