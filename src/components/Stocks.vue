<template>
    <div>
        <h2>Stocks</h2>
        <nav>
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/incomes">Incomes</RouterLink>
            <RouterLink to="/sales">Sales</RouterLink>
            <RouterLink to="/orders">Orders</RouterLink>
            <RouterLink to="/stocks">Stocks</RouterLink>
        </nav>
        <form @submit.prevent="fetchData">
            <label>
                <el-mention type="date" v-model="dateFrom" readonly />
            </label>
            <button type="submit" :class="loading ? 'notLoaded' : ''">Load</button>
        </form>
        <div class="loading" v-if="loading">
            <el-progress :percentage="100" :indeterminate="true" :show-text="false"/>
        </div>
        <div v-if="error" style="color:red">{{ error }}</div>
            <div v-if="data && Array.isArray(data.data)">
                <el-table :data="data.data" style="width: 100%">
                    <el-table-column prop="date" label="Date"/>
                    <el-table-column
                        prop="barcode"
                        label="Barcode"
                        sortable
                        :filters="barcodeFilters"
                        :filter-method="filterUnique"
                    />
                    <el-table-column 
                        prop="subject" 
                        label="Subject" 
                        sortable 
                        :filters="subjectFilters"
                        :filter-method="filterUnique"
                        />
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

const dateFrom = new Date().toISOString().slice(0, 10);
const data = ref(null);
const loading = ref(false);
const error = ref('');

const token = 'E6kUTYrYwZq2tN4QEtyzsbEBk3ie';
const baseUrl = 'https://cors-anywhere.herokuapp.com/http://109.73.206.144:6969/api/stocks';

const barcodeFilters = ref([]);
const subjectFilters = ref([]);

const totalValue = ref(500);
const pageSize = ref(10);
const size = ref('default');

async function fetchData(page = 1) {
    loading.value = true;
    error.value = '';
    try {
        const response = await axios.get(baseUrl, {
            params: {
                dateFrom: dateFrom,
                key: token,
                limit: pageSize.value,
                page: page
            }
        });
        totalValue.value = response.data.meta.total;
        data.value = response.data;
        if (data.value) {
            getBarcodeFilters();  
            getSubjectFilters();
        }
    } catch (e) {
        error.value = e.message;
    } finally {
        loading.value = false;
    }
}

function getSubjectFilters() {
    const subjectItems = [...new Set(data.value.data.map(item => item.subject))];
    subjectFilters.value = subjectItems.map(val => ({ text: val, value: val }));
}

function getBarcodeFilters() {
    const barcodeItems = [...new Set(data.value.data.map(item => item.barcode))];
    barcodeFilters.value = barcodeItems.map(val => ({ text: val, value: val }));
}
</script>