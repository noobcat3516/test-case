
<template>
    <div>
        <h2>Incomes</h2>
        <nav>
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/incomes">Incomes</RouterLink>
            <RouterLink to="/sales">Sales</RouterLink>
            <RouterLink to="/orders">Orders</RouterLink>
            <RouterLink to="/stocks">Stocks</RouterLink>
        </nav>
        <form @submit.prevent="fetchData">
            <label>
                Date From:
                <el-mention type="date" v-model="dateFrom" required />
            </label>
            <label>
                Date To:
                <el-mention type="date" v-model="dateTo" required />
            </label>
            <button type="submit" :class="loading ? 'notLoaded' : ''">Load</button>
        </form>
        <div class="loading" v-if="loading">
            <el-progress :percentage="100" :indeterminate="true" :show-text="false"/>
        </div>
        <div v-if="error" style="color:red">{{ error }}</div>
        <div v-if="data && Array.isArray(data.data)">
            <el-table :data="data.data" style="width: 100%">
                <el-table-column prop="income_id" label="ID" sortable/>
                <el-table-column
                    prop="tech_size"
                    label="Size"
                    sortable
                    :filters="sizeFilters"
                    :filter-method="filterUnique"
                />
                <el-table-column 
                    prop="quantity" 
                    label="Quantity" 
                    sortable 
                    :filters="quantityFilters"
                    :filter-method="filterUnique"
                />
                <el-table-column 
                    prop="nm_id" 
                    label="NM ID" 
                    sortable
                    :filters="nmFilters"
                    :filter-method="filterUnique"/>
            </el-table>
            <el-pagination
                background
                v-model:page-size="pageSize"
                :page-sizes="[10, 50, 100, 250, 500]"
                layout="total, sizes, prev, pager, next"
                :size="size"
                :total='totalValue'
                @size-change="() => { fetchData(1); }"
                @current-change="(val) => { page = val; fetchData(page); }"
            />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { filterUnique } from '../js/unigueFilter';

const dateFrom = ref('');
const dateTo = ref('');
const data = ref(null);
const loading = ref(false);
const error = ref('');

const sizeFilters = ref([]);
const quantityFilters = ref([]);
const nmFilters = ref([]);

const totalValue = ref(500);
const pageSize = ref(10);
const size = ref('default');

const props = defineProps({
  token: { type: String, required: true },
  baseUrl: { type: String, required: true }
})

async function fetchData(page = 1) {
    loading.value = true;
    error.value = '';
    try {
        if (dateFrom.value > dateTo.value) {
            throw new Error('Date from cannot be later than Date To');
        }
        const response = await axios.get(props.baseUrl + 'incomes', {
            params: {
                dateFrom: dateFrom.value,
                dateTo: dateTo.value,
                key: props.token,
                limit: pageSize.value,
                page: page
            }
        });
        totalValue.value = response.data.meta.total;
        data.value = response.data;
        if(data.value) {
            getSizeFilters();  
            getQuantityFilters();
            getNmFilters();
        }
    } catch (e) {
        error.value = e.message;
    } finally {
        loading.value = false;
    }
}

function getSizeFilters() {
    const sizeItems = [...new Set(data.value.data.map(item => item.tech_size))];
    sizeFilters.value = sizeItems.map(val => ({ text: val, value: val }));
}
function getQuantityFilters() {
    const quantityItems = [...new Set(data.value.data.map(item => item.quantity))];
    quantityFilters.value = quantityItems.map(val => ({ text: val, value: val }));
}
function getNmFilters() {
    const nmItems = [...new Set(data.value.data.map(item => item.nm_id))];
    nmFilters.value = nmItems.map(val => ({ text: val, value: val }));
}
</script>