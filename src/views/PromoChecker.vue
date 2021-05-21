<template>
  <q-page>
    <div class="row ">
      <div class="col-lg-2 q-py-lg q-px-md">
        <q-select
          label="Country"
          v-model="selectedCountry"
          :options="[
            {label: 'Panama', value: 'pa'},
            {label: 'Guatemala', value: 'gt'},
            {label: 'Colombia', value: 'co'},
            {label: 'Peru', value: 'pe'},
            {label: 'Costa Rica', value: 'cr'},
          ]"
          filled
          map-options
          emit-value
        />
      </div>
      <div class="col-lg-2 q-py-lg q-px-md">
        <q-select
          label="Category"
          v-model="selectedCategory"
          :options="[
            {label: 'Body Care', value: 'bc'},
            {label: 'Hand Soaps', value: 'hs'},
            {label: 'Home Fragrances', value: 'hf'},
          ]"
          filled
          map-options
          emit-value
        />
      </div>
      <q-space />
      <div class="col-lg-1 q-py-lg q-px-md">
        <q-btn label="SCRAPE!" color="accent" @click="startScrape()" push />
      </div>
    </div>

    <!-- <div class="row">
      <div
        class="col-lg-3"
        v-for="(item, i) in noPromoItems"
        :key="i"
        v-html="item.outerHTML"
      ></div>
    </div> -->
    <div class="row">
      <div class="col-lg-2 q-pa-lg" v-for="(item, i) in noPromoItems" :key="i">
        <q-card>
          <q-card-section>
            <img :src="item.productImage" style="width: 100%" />
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div v-html="item.productName"></div>
          </q-card-section>
          <q-card-section>
            {{ item.sku }}
          </q-card-section>
          <q-card-actions>
            <q-btn
              icon="check"
              round
              color="green-7"
              @click="removeItemFromArray(i)"
              flat
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
    <q-dialog v-model="scrapeDialog" persistent>
      <q-card>
        <q-card-section>
          <div class="row q-mb-md">
            <q-space />
            <q-spinner-grid color="primary" size="2em" class="text-center" />
            <q-space />
          </div>
          <div class="text-h5 text-bold">SCRAPING!</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      scrapeDialog: false,
      selectedCountry: '',
      selectedCategory: '',
      options: {
        token: '649C4B750F3E518325D31A61CA5FE500',
      },
      urls: {
        pa: {
          bc:
            'https://www.bathandbodyworks.pa/buscapagina?fq=C%3a%2f1%2f&O=OrderByReleaseDateDESC&PS=12&sl=f9ecb8dc-ce02-48fc-ae85-de11e131655f&cc=12&sm=0&PageNumber=',
          hf:
            'https://www.bathandbodyworks.pa/buscapagina?fq=C%3a%2f24%2f&O=OrderByReleaseDateDESC&PS=12&sl=f9ecb8dc-ce02-48fc-ae85-de11e131655f&cc=12&sm=0&PageNumber=',
          hs:
            'https://www.bathandbodyworks.pa/buscapagina?fq=C%3a%2f16%2f&O=OrderByReleaseDateDESC&PS=12&sl=f9ecb8dc-ce02-48fc-ae85-de11e131655f&cc=12&sm=0&PageNumber=',
        },
        gt: {
          bc:
            'https://www.bathandbodyworks.gt/buscapagina?fq=C%3a%2f1%2f&fq=H%3a137&O=OrderByReleaseDateDESC&PS=12&sl=c909318e-bbfe-4ee4-818a-493c502e81be&cc=12&sm=0&PageNumber=',
          hf:
            'https://www.bathandbodyworks.gt/buscapagina?fq=C%3a%2f24%2f&fq=H%3a137&O=OrderByReleaseDateDESC&PS=12&sl=c909318e-bbfe-4ee4-818a-493c502e81be&cc=12&sm=0&PageNumber=',
          hs:
            'https://www.bathandbodyworks.gt/buscapagina?fq=C%3a%2f16%2f&fq=H%3a137&O=OrderByReleaseDateDESC&PS=12&sl=c909318e-bbfe-4ee4-818a-493c502e81be&cc=12&sm=0&PageNumber=',
        },
        co: {
          bc:
            'https://www.bathandbodyworks.co/buscapagina?fq=C%3a%2f1%2f&fq=H%3a145&O=OrderByReleaseDateDESC&PS=12&sl=5dd932b0-f527-43f5-81b1-8797615a4cb7&cc=12&sm=0&PageNumber=',
          hf:
            'https://www.bathandbodyworks.co/buscapagina?fq=C%3a%2f24%2f&fq=H%3a145&O=OrderByReleaseDateDESC&PS=12&sl=5dd932b0-f527-43f5-81b1-8797615a4cb7&cc=12&sm=0&PageNumber=',
          hs:
            'https://www.bathandbodyworks.co/buscapagina?fq=C%3a%2f16%2f&fq=H%3a145&O=OrderByReleaseDateDESC&PS=12&sl=5dd932b0-f527-43f5-81b1-8797615a4cb7&cc=12&sm=0&PageNumber=',
        },
        pe: {
          bc:
            'https://www.bathandbodyworks.pe/buscapagina?fq=C%3a%2f1%2f&O=OrderByReleaseDateDESC&PS=12&sl=ec99cbba-da25-424f-91dd-f1c365e2acd6&cc=12&sm=0&PageNumber=',
          hf:
            'https://www.bathandbodyworks.pe/buscapagina?fq=C%3a%2f24%2f&fq=H%3a137&O=OrderByReleaseDateDESC&PS=12&sl=ec99cbba-da25-424f-91dd-f1c365e2acd6&cc=12&sm=0&PageNumber=',
          hs:
            'https://www.bathandbodyworks.pe/buscapagina?fq=C%3a%2f16%2f&O=OrderByReleaseDateDESC&PS=12&sl=ec99cbba-da25-424f-91dd-f1c365e2acd6&cc=12&sm=0&PageNumber=',
        },
        cr: {
          bc:
            'https://www.bathandbodyworks.cr/buscapagina?fq=C%3a%2f1%2f&fq=H%3a137&O=OrderByReleaseDateDESC&PS=12&sl=67e66edd-61d7-4a33-a20d-3233a603a514&cc=12&sm=0&PageNumber=',
          hf:
            'https://www.bathandbodyworks.cr/buscapagina?fq=C%3a%2f24%2f&fq=H%3a137&O=OrderByReleaseDateDESC&PS=12&sl=67e66edd-61d7-4a33-a20d-3233a603a514&cc=12&sm=0&PageNumber=',
          hs:
            'https://www.bathandbodyworks.cr/buscapagina?fq=C%3a%2f16%2f&fq=H%3a137&O=OrderByReleaseDateDESC&PS=12&sl=67e66edd-61d7-4a33-a20d-3233a603a514&cc=12&sm=0&PageNumber=',
        },
      },
      noPromoItems: [],
      emptyPage: false,
    }
  },
  methods: {
    async startScrape() {
      this.scrapeDialog = true
      if (!this.selectedCategory || !this.selectedCountry) {
        alert('Please select a country and a category')
        return
      }
      this.noPromoItems = []
      let i = 1
      while (this.emptyPage != true) {
        await this.scrape(
          this.urls[this.selectedCountry][this.selectedCategory],
          i
        )
        i++
      }
    },
    async scrape(url, page) {
      console.log(url + page)
      this.options.url = url + page
      let response = await axios.post(
        'https://api.scraperbox.com/scrape',
        this.options
      )
      if (response.data.length > 0) {
        this.extractItems(response.data)
      } else {
        this.scrapeDialog = false
        this.emptyPage = true
      }
    },
    extractItems(code) {
      let el = document.createElement('html')
      el.innerHTML = code
      let items = el.getElementsByClassName('product-item__wrapper')
      items.forEach(item => {
        if (!item.children[0].children[5].innerHTML.includes('flag')) {
          let img = item.getElementsByTagName('IMG')
          let name = item.getElementsByClassName('product-item__name')
          let skuid = item.getElementsByTagName('a')
          skuid = skuid[0].dataset.skuid
          this.noPromoItems.push({
            productImage: img[0].getAttribute('src'),
            productName: name[0].innerHTML,
            sku: skuid,
          })
        }
      })
    },
    removeItemFromArray(i) {
      this.noPromoItems.splice(i, 1)
    },
  },
}
</script>
