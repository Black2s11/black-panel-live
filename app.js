const API='https://loadervippub.x10.mx/api/keys_api.php';
let keys=[], apiKey=sessionStorage.getItem('black_panel_api_key')||'';
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function toast(t){const x=$('#toast');x.textContent=t;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),1900)}
async function call(action,data={},method='POST'){
  if(!apiKey){$('#authDlg').showModal();throw new Error('AUTH');}
  const body=new URLSearchParams({api_key:apiKey,action,...data});
  const url=method==='GET'?API+'?'+body.toString():API;
  const r=await fetch(url,{method,headers:{'Accept':'application/json',...(method==='POST'?{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'}:{})},body:method==='POST'?body:null,cache:'no-store'});
  const j=await r.json().catch(()=>({status:false,message:'Invalid server response'}));
  if(!r.ok||!j.status)throw new Error(j.message||('HTTP '+r.status));
  return j;
}
function state(k){if(String(k.status)==='0')return'disabled';return Number(k.used_devices||0)>0?'used':'active'}
function render(){
 const q=$('#search').value.trim().toLowerCase(),f=$('#filter').value;
 const list=keys.filter(k=>(f==='all'||state(k)===f)&&((k.user_key+' '+k.game).toLowerCase().includes(q)));
 $('#rows').innerHTML=list.map((k,i)=>`<tr><td>${i+1}</td><td>${esc(k.game)}</td><td><span class="key">${esc(k.user_key)}</span></td><td>${k.used_devices||0}/${esc(k.max_devices)}</td><td>${esc(k.duration)} يوم</td><td><span class="badge ${state(k)}">${state(k)==='active'?'فعّال':state(k)==='used'?'مستخدم':'موقوف'}</span></td><td class="ops"><button class="rowbtn" data-a="copy" data-id="${esc(k.id_keys)}">نسخ</button><button class="rowbtn" data-a="edit" data-id="${esc(k.id_keys)}">تعديل</button><button class="rowbtn" data-a="reset" data-id="${esc(k.id_keys)}">Reset</button><button class="rowbtn" data-a="toggle" data-id="${esc(k.id_keys)}">${String(k.status)==='0'?'تفعيل':'إيقاف'}</button><button class="rowbtn danger" data-a="delete" data-id="${esc(k.id_keys)}">حذف</button></td></tr>`).join('');
 $('#empty').style.display=list.length?'none':'block';
 $('#sTotal').textContent=keys.length;$('#sActive').textContent=keys.filter(k=>String(k.status)!=='0').length;$('#sDisabled').textContent=keys.filter(k=>String(k.status)==='0').length;$('#sUsed').textContent=keys.filter(k=>Number(k.used_devices||0)>0).length;
}
async function load(){try{const j=await call('list',{},'GET');keys=j.keys||[];$('#online').textContent='● متصل';$('#online').className='status ok';render()}catch(e){if(e.message!=='AUTH'){ $('#online').textContent='● غير متصل';$('#online').className='status bad';toast(e.message)}}}
$('#authForm').addEventListener('submit',async e=>{e.preventDefault();apiKey=$('#apiKey').value.trim();try{await call('ping',{},'GET');sessionStorage.setItem('black_panel_api_key',apiKey);$('#authDlg').close();load()}catch(err){apiKey='';sessionStorage.removeItem('black_panel_api_key');toast('مفتاح غير صحيح أو السيرفر غير متاح')}});
$('#openCreate').addEventListener('click',()=>$('#createDlg').showModal());
$('#createForm').addEventListener('submit',async e=>{e.preventDefault();try{await call('generate',{game:$('#game').value.trim(),duration:$('#days').value,max_devices:$('#devices').value,loopcount:$('#count').value,admin_note:$('#note').value.trim()});$('#createDlg').close();toast('تم إنشاء الأكواد');load()}catch(err){toast(err.message)}});
$('#search').addEventListener('input',render);$('#filter').addEventListener('change',render);$('#refresh').addEventListener('click',load);
$('#rows').addEventListener('click',async e=>{const b=e.target.closest('button[data-a]');if(!b)return;const k=keys.find(x=>String(x.id_keys)===b.dataset.id);if(!k)return;const a=b.dataset.a;
 if(a==='copy'){try{await navigator.clipboard.writeText(k.user_key);toast('تم النسخ')}catch{toast(k.user_key)}return}
 if(a==='edit'){ $('#editId').value=k.id_keys;$('#editKey').value=k.user_key;$('#editDays').value=k.duration;$('#editDevices').value=k.max_devices;$('#editNote').value=k.admin_note||'';$('#editDlg').showModal();return}
 if(a==='delete'&&!confirm('حذف هذا الكود نهائياً؟'))return;
 try{if(a==='reset')await call('reset_devices',{id_keys:k.id_keys});if(a==='toggle')await call('set_status',{id_keys:k.id_keys,status:String(k.status)==='0'?'1':'0'});if(a==='delete')await call('delete_key',{id_keys:k.id_keys});toast('تم التنفيذ');load()}catch(err){toast(err.message)}
});
$('#editForm').addEventListener('submit',async e=>{e.preventDefault();try{await call('update_key',{id_keys:$('#editId').value,user_key:$('#editKey').value.trim(),duration:$('#editDays').value,max_devices:$('#editDevices').value,admin_note:$('#editNote').value.trim()});$('#editDlg').close();toast('تم حفظ التعديل');load()}catch(err){toast(err.message)}});
if(!apiKey)$('#authDlg').showModal();else load();