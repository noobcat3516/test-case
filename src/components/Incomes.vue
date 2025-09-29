
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
            <button type="submit">Load</button>
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

const props = defineProps({
  token: { type: String, required: true },
  baseUrl: { type: String, required: true }
})

async function fetchData() {
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
                limit: 500,
                page: 1
            }
        });
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