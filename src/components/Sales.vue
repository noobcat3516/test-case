<template>
    <div>
        <h2>Sales</h2>
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
                <el-table-column 
                    prop="sale_id" 
                    label="sale" 
                    sortable/>
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

const dateFilters = ref([]);
const lstFilters = ref([]);
const warehouseFilters = ref([]);

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
        const response = await axios.get(props.baseUrl + 'sales', {
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