<template>
  <div class="panel">
    <div class="controls">
      <label class="field field-symbols">
        <span class="field-label">Symbols</span>
        <input
          v-model="symbolsInput"
          class="field-input"
          placeholder="AAPL,MSFT,NVDA,AMZN,GOOGL"
          @keyup.enter="loadData"
        />
      </label>

      <label class="field field-rows">
        <span class="field-label">Preview rows</span>
        <input
          type="number"
          v-model.number="previewRows"
          class="field-input field-input-narrow"
          min="10"
          max="20"
        />
      </label>

      <button class="load-btn" @click="loadData" :disabled="loading">
        <span v-if="loading" class="spinner" aria-hidden="true"></span>
        {{ loading ? 'Loading' : 'Load data' }}
      </button>
    </div>

    <p v-if="error" class="state-msg state-error">
      Couldn't reach the API — {{ error }}
    </p>

    <div v-if="rows.length" class="table-scroll">
      <table class="price-table">
        <thead>
          <tr>
            <th class="col-date">Date</th>
            <th v-for="sym in symbols" :key="sym">{{ sym }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in rows" :key="i">
            <td class="col-date">{{ row.date }}</td>
            <td
              v-for="sym in symbols"
              :key="sym"
              :class="cellClass(i, sym)"
            >
              {{ formatPrice(row[sym]) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else-if="!loading && !error" class="state-msg">
      Enter your symbols and press Load data to preview the matrix.
    </p>

    <details v-if="rawFallback" class="raw-fallback" open>
      <summary>
        Couldn't map this response to a table — showing the raw JSON so you can
        adjust normalizeResponse() in PriceMatrixPreview.vue.
      </summary>
      <pre>{{ rawFallback }}</pre>
    </details>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const symbolsInput = ref('AAPL,MSFT,NVDA,AMZN,GOOGL')
const previewRows = ref(15)
const loading = ref(false)
const error = ref('')
const rows = ref([])
const symbols = ref([])
const rawFallback = ref('')

function formatPrice(value) {
  if (value === undefined || value === null || Number.isNaN(value)) return '—'
  return Number(value).toFixed(2)
}

// So sánh với dòng trước đó (cùng mã) để tô màu tăng/giảm kiểu bảng giá chứng khoán
function cellClass(rowIndex, sym) {
  if (rowIndex === 0) return ''
  const current = rows.value[rowIndex][sym]
  const previous = rows.value[rowIndex - 1][sym]
  if (current == null || previous == null) return ''
  if (current > previous) return 'up'
  if (current < previous) return 'down'
  return ''
}

// Cố gắng nhận diện vài kiểu JSON phổ biến mà backend FastAPI/pandas hay trả về
// và chuyển tất cả về cùng 1 dạng: [{ date, AAPL, MSFT, ... }, ...]
function normalizeResponse(json, requestedSymbols) {
  if (Array.isArray(json) && json.length && typeof json[0] === 'object') {
    const syms = Object.keys(json[0]).filter((k) => k.toLowerCase() !== 'date')
    return { rows: json, symbols: syms }
  }

  const dateKey = Object.keys(json || {}).find((k) =>
    ['date', 'dates', 'index'].includes(k.toLowerCase())
  )
  if (dateKey && Array.isArray(json[dateKey])) {
    const dates = json[dateKey]
    const syms = Object.keys(json).filter((k) => k !== dateKey)
    const out = dates.map((d, i) => {
      const row = { date: d }
      syms.forEach((s) => (row[s] = json[s][i]))
      return row
    })
    return { rows: out, symbols: syms }
  }

  if (json && Array.isArray(json.columns) && Array.isArray(json.data)) {
    const dateIdx = json.columns.findIndex((c) =>
      String(c).toLowerCase().includes('date')
    )
    const syms = json.columns.filter((_, i) => i !== dateIdx)
    const out = json.data.map((rowArr, i) => {
      const row = { date: dateIdx >= 0 ? rowArr[dateIdx] : json.index?.[i] }
      json.columns.forEach((c, ci) => {
        if (ci !== dateIdx) row[c] = rowArr[ci]
      })
      return row
    })
    return { rows: out, symbols: syms }
  }

  if (json && (json.data || json.result)) {
    return normalizeResponse(json.data ?? json.result, requestedSymbols)
  }

  return null
}

async function loadData() {
  loading.value = true
  error.value = ''
  rawFallback.value = ''
  rows.value = []

  const symbolList = symbolsInput.value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  const params = new URLSearchParams()
  symbolList.forEach((s) => params.append('symbols', s))
  params.append('days', 252)

  try {
    const res = await fetch(
      `/api/v1/data-pipeline/cleaned-price-matrix?${params.toString()}`
    )
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()

    const normalized = normalizeResponse(json, symbolList)
    if (normalized) {
      symbols.value = normalized.symbols
      rows.value = normalized.rows.slice(0, previewRows.value)
    } else {
      rawFallback.value = JSON.stringify(json, null, 2)
    }
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.panel {
  background: var(--bg-panel);
  border: 1px solid var(--rule);
  border-radius: 8px;
  padding: 24px;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  gap: 20px;
  margin-bottom: 22px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-symbols {
  flex: 1 1 280px;
}

.field-label {
  font-size: 12px;
  color: var(--text-muted);
}

.field-input {
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--text-primary);
  background: var(--bg-inset);
  border: 1px solid var(--rule);
  border-radius: 5px;
  padding: 9px 12px;
  outline: none;
  transition: border-color 0.15s ease;
}

.field-input:focus {
  border-color: var(--accent);
}

.field-input-narrow {
  width: 90px;
}

.load-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 500;
  color: #14120a;
  background: var(--accent);
  border: none;
  border-radius: 5px;
  padding: 10px 18px;
  height: 38px;
  cursor: pointer;
  transition: filter 0.15s ease;
}

.load-btn:hover:not(:disabled) {
  filter: brightness(1.08);
}

.load-btn:disabled {
  opacity: 0.65;
  cursor: default;
}

.spinner {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(20, 18, 10, 0.35);
  border-top-color: #14120a;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.state-msg {
  font-size: 14px;
  color: var(--text-muted);
  margin: 4px 0 0;
}

.state-error {
  color: var(--down);
}

.table-scroll {
  overflow-x: auto;
  border: 1px solid var(--rule);
  border-radius: 6px;
}

.price-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-mono);
  font-size: 13.5px;
}

.price-table th,
.price-table td {
  padding: 10px 16px;
  text-align: right;
  white-space: nowrap;
}

.price-table th {
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: 12.5px;
  color: var(--text-muted);
  text-align: right;
  border-bottom: 1px solid var(--rule);
  background: var(--bg-inset);
}

.price-table .col-date {
  text-align: left;
  color: var(--text-muted);
  font-weight: 400;
}

.price-table th.col-date {
  color: var(--text-muted);
}

.price-table tbody tr:nth-child(even) {
  background: var(--bg-panel-alt);
}

.price-table tbody tr:hover {
  background: var(--accent-soft);
}

.price-table tbody td {
  border-bottom: 1px solid var(--rule-soft);
  color: var(--text-primary);
}

.price-table tbody tr:last-child td {
  border-bottom: none;
}

.up {
  color: var(--up);
}

.down {
  color: var(--down);
}

.raw-fallback {
  margin-top: 18px;
  font-size: 13px;
  color: var(--text-muted);
}

.raw-fallback pre {
  background: var(--bg-inset);
  color: var(--text-primary);
  padding: 14px;
  border-radius: 6px;
  overflow: auto;
  max-height: 400px;
  font-family: var(--font-mono);
  font-size: 12.5px;
  border: 1px solid var(--rule);
}

@media (max-width: 600px) {
  .panel {
    padding: 16px;
  }
  .controls {
    gap: 14px;
  }
}
</style>
