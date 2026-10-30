const $ = (id) =>document.getElementById(id);
const esc = (s) =>String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

let members = [];
let editingId = null;

async function api(path, method = 'GET', body){
    const res = await fetch('/api' + path, {
        method,
        headers: {'Content-Type': 'application/json'},
        body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Request failed");
    return data;
}

async function loadPlans(){
    const plans = await api('/plans');
    $(memberPlan).innerHTML = plans.length
        ? plans.map((p) => `<option value="${p._id}">${p.duration} month(s) - ${p.rate}</option>`).join('')
        : '<option value="">No plans yet</option>';
}

$('savePlan').addEventListener('click', async () => {
    try {
        await api('/plans', 'POST', {duration: $('duration').value, rate: $('rate').value});
        $('duration').value = '';
        $('rate').value = '';
        loadPlans();
    } catch (err) {
        alert(err.message);
    }
});