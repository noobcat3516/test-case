<template>
    <div>
        <h1>Sales</h1>
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
        <div v-if="loading">Loading...</div>
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
                    prop="last_change_date" 
                    label="Last change date" 
                    sortable 
                    :filters="lstFilters"
                    :filter-method="filterUnique"
                />
                <el-table-column 
                    prop="warehouse_name" 
                    label="Warehouse" 
                    sortable
                    :filters="warehouseFilters"
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
const lstFilters = ref([]);
const warehouseFilters = ref([]);

const props = defineProps({
  token: { type: String, required: true },
  baseUrl: { type: String, required: true }
})

async function fetchData() {
    loading.value = true;
    error.value = '';
    try {
        const response = await axios.get(props.baseUrl, {
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
            getlstFilters();
            getWarehouseFilters();
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

function getlstFilters() {
    const lstFiltersItems = [...new Set(data.value.data.map(item => item.date_close))];
    lstFilters.value = lstFiltersItems.map(val => ({ text: val, value: val }));
}

function getWarehouseFilters() {
    const warehouseItems = [...new Set(data.value.data.map(item => item.warehouse_name))];
    warehouseFilters.value = warehouseItems.map(val => ({ text: val, value: val }));
}

</script>