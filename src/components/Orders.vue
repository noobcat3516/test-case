<template>
    <div>
        <h2>Orders</h2>
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
                    prop="date"
                    label="Created at"
                    sortable
                    :filters="dateFilters"
                    :filter-method="filterUnique"
                />
                <el-table-column 
                    prop="supplier_article" 
                    label="Supplier article" 
                    sortable 
                    :filters="articleFilters"
                    :filter-method="filterUnique"
                />
                <el-table-column 
                    prop="date_close" 
                    label="Date close" 
                    sortable
                    :filters="closeFilters"
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

const dateFilters = ref([]);
const articleFilters = ref([]);
const closeFilters = ref([]);

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
        const response = await axios.get(props.baseUrl + 'orders', {
            params: {
                dateFrom: dateFrom.value,
                dateTo: dateTo.value,
                key: props.token,
                limit: 500,
                page: 1
            }
        });
        data.value = response.data;
        if (data.value) {
            getDateFilters();  
            getArticleFilters();
            getCloseFilters();
        }
    } catch (e) {
        error.value = e.message;
    } finally {
        loading.value = false;
    }
}

function getDateFilters() {
    const dateItems = [...new Set(data.value.data.map(item => item.date))];
    dateFilters.value = dateItems.map(val => ({ text: val, value: val }));
}

function getArticleFilters() {
    const articleItems = [...new Set(data.value.data.map(item => item.supplier_article))];
    articleFilters.value = articleItems.map(val => ({ text: val, value: val }));
}

function getCloseFilters() {
    const closeItems = [...new Set(data.value.data.map(item => item.date_close))];
    closeFilters.value = closeItems.map(val => ({ text: val, value: val }));
}

</script>