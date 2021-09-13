<template>
  <q-page class="q-pa-lg">
    <div class="row q-mb-sm">
      <div class="col-lg-2 q-pa-sm">
        <div class="text-subtitle2">Country</div>
        <q-select
          filled
          label="Select"
          :options="[
            'Panama',
            'Guatemala',
            'Colombia',
            'Peru',
            'CostaRica',
            'Paraguay',
            'Ecuador',
          ]"
          map-options
          emit-value
          v-model="selectedCountry"
        />
      </div>
      <div class="col-lg-2 q-pa-sm">
        <div class="text-subtitle2">Product Name</div>
        <q-input filled label="Product Name" v-model="productNameSearch" />
      </div>
      <div class="col-lg-2 q-pa-sm">
        <div class="text-subtitle2">Department</div>
        <q-input filled label="Product Department" v-model="departmentSearch" />
      </div>
      <div class="col-lg-2 q-pa-sm">
        <div class="text-subtitle2">Category</div>
        <q-input filled label="Product Category" v-model="categorySearch" />
      </div>
      <div class="col-lg-2 q-pa-sm">
        <div class="text-subtitle2">SKU Name</div>
        <q-input filled label="Product SKU Name" v-model="skuNameSearch" />
      </div>
      <div class="col-lg-2 q-pa-sm">
        <div class="text-subtitle2">Reference</div>
        <q-input
          type="number"
          filled
          label="Product Reference"
          v-model="skuSearch"
        />
      </div>
    </div>
    <div class="row q-mb-sm q-px-sm">
      <q-btn
        color="accent"
        outline
        size="sm"
        :disable="tableExportCSV.length == 0"
      >
        <download-excel :data="tableExportCSV">Export Table</download-excel>
      </q-btn>
    </div>
    <div class="row">
      <div class="col-lg-8 q-pa-sm">
        <q-table
          title="Products"
          :data="filterProductsBySku"
          :columns="columns"
          row-key="name"
          :pagination.sync="initialPagination"
        >
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.label }}
              </q-th>
              <q-th auto-width />
            </q-tr>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td
                key="productName"
                :props="props"
                v-html="props.row['_ProductName (Required)']"
              />
              <q-td key="department" :props="props">
                {{ props.row['_DepartamentName'] }}
              </q-td>
              <q-td key="category" :props="props">
                {{ props.row['_CategoryName'] }}
              </q-td>
              <q-td key="skuName" :props="props">
                {{ props.row['_SkuName'] }}
              </q-td>
              <q-td key="skuReference" :props="props">
                {{ props.row['_SKUReferenceCode'] }}
              </q-td>
              <q-td key="vtexSku" :props="props">
                {{ props.row['_SkuId (Not changeable)'] }}
              </q-td>
              <q-td key="urlLink" :props="props">
                <a
                  :href="
                    getStoreLink(props.row['_CaptionLink (Not changeable)'])
                  "
                  target="_blank"
                  style="text-decoration: none"
                >
                  <q-btn size="sm" color="accent" round flat icon="store" />
                </a>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
      <div class="col-lg-4 q-pa-sm">
        <q-card class="q-mb-md">
          <q-card-section>
            <div class="text-h6">Insert References</div>
          </q-card-section>
          <q-card-section>
            <q-input
              type="textarea"
              rows="10"
              filled
              label="References"
              v-model="skuList"
            />
          </q-card-section>
          <q-card-actions>
            <q-space />
            <q-btn
              flat
              label="Generate"
              color="primary"
              @click="generateSkuCollection"
            />
          </q-card-actions>
        </q-card>
        <q-card>
          <q-card-section>
            <div class="text-h6">Vtex SKUs</div>
          </q-card-section>
          <q-card-section v-if="skuCSV.length > 0">
            <div class="text-body">
              <!-- <div class="text-body2 q-mb-sm">
                References added: {{ this.skuList.split('\n').length }}
              </div> -->
              <div class="text-body2 q-mb-sm">
                References found: {{ skuCSV.length }} /
                {{ insertedReferences }}
              </div>
              <download-excel :data="skuCSV">
                <q-btn color="accent" label="Export CSV" outline size="sm" />
              </download-excel>
            </div>
          </q-card-section>
          <q-card-section v-else>
            <div class="text-caption">Insert references in space above.</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      selectedCountry: '',
      productNameSearch: '',
      departmentSearch: '',
      categorySearch: '',
      skuNameSearch: '',
      skuSearch: '',
      insertedReferences: '',
      skuList: '',
      skuCSV: [],
      tableExportCSV: [],
      data: [],
      columns: [
        {
          name: 'productName',
          label: 'Product Name',
          align: 'left',
          field: '_ProductName (Required)',
          sortable: true,
        },
        {
          name: 'department',
          label: 'Department',
          align: 'left',
          field: '_DepartamentName',
          sortable: true,
        },
        {
          name: 'category',
          label: 'Category',
          align: 'left',
          field: '_CategoryName',
          sortable: true,
        },
        {
          name: 'skuName',
          label: 'SKU Name',
          align: 'left',
          field: '_SkuName',
          sortable: true,
        },
        {
          name: 'skuReference',
          label: 'Reference',
          align: 'left',
          field: '_SKUReferenceCode',
          sortable: true,
        },
        {
          name: 'vtexSku',
          label: 'Vtex SKU',
          align: 'left',
          field: '_SkuId (Not changeable)',
          sortable: true,
        },
        {
          name: 'urlLink',
          label: '',
          align: 'left',
          field: '_CaptionLink (Not changeable)',
        },
      ],
      initialPagination: {
        rowsPerPage: 15,
        sortBy: 'vtexSku',
        descending: true,
      },
    }
  },
  methods: {
    generateSkuCollection() {
      this.skuCSV = []
      let skus = this.skuList.split('\n')
      this.insertedReferences = skus.length
      for (let item of skus) {
        for (let sku of this.data) {
          if (item == sku['_SKUReferenceCode']) {
            this.skuCSV.push({SKU: sku['_SkuId (Not changeable)']})
            break
          }
        }
      }
    },
    loadData() {
      let country = this.selectedCountry.toLocaleLowerCase()
      this.data = require(`@/assets/data-${country}.json`)
      this.data = this.data.Sheet1
      this.data.forEach(item => {
        item['_SkuId (Not changeable)'] = parseInt(
          item['_SkuId (Not changeable)']
        )
      })
    },
    getStoreLink(link) {
      if (this.selectedCountry == 'panama') {
        return `https://www.bathandbodyworks.pa/${link}/p`
      }
      if (this.selectedCountry == 'guatemala') {
        return `https://www.bathandbodyworks.gt/${link}/p`
      }
      if (this.selectedCountry == 'colombia') {
        return `https://www.bathandbodyworks.co/${link}/p`
      }
      if (this.selectedCountry == 'peru') {
        return `https://www.bathandbodyworks.pe/${link}/p`
      }
      if (this.selectedCountry == 'costarica') {
        return `https://www.bathandbodyworks.cr/${link}/p`
      }
      if (this.selectedCountry == 'paraguay') {
        return `https://www.bathandbodyworks.com.py/${link}/p`
      }
      if (this.selectedCountry == 'ecuador') {
        return `https://www.bathandbodyworks.ec/${link}/p`
      }
    },
  },
  computed: {
    filterProductsBySku() {
      let filteredProducts = []
      this.data.forEach(item => {
        if (
          item['_SKUReferenceCode'].includes(this.skuSearch) &&
          item['_ProductName (Required)']
            .toLowerCase()
            .includes(this.productNameSearch.toLowerCase()) &&
          item['_CategoryName']
            .toLowerCase()
            .includes(this.categorySearch.toLowerCase()) &&
          item['_SkuName']
            .toLowerCase()
            .includes(this.skuNameSearch.toLowerCase()) &&
          item['_DepartamentName']
            .toLowerCase()
            .includes(this.departmentSearch.toLowerCase())
        )
          filteredProducts.push(item)
      })
      this.tableExportCSV = []
      filteredProducts.forEach(product => {
        this.tableExportCSV.push({SKU: product['_SkuId (Not changeable)']})
      })
      return filteredProducts
    },
  },
  watch: {
    selectedCountry: function() {
      this.loadData()
    },
  },
}
</script>
