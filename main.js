

//全域變數
const date = new Date();




const dateSelect = document.getElementById('dateSelect');

dateSelect.addEventListener('change',()=>{
  const dateStr = dateSelect.value;
    if (!dateStr) return;

  const { year, month, week } = getYearWeekMonth(dateStr);

  document.getElementById('yearField').value = year;
  document.getElementById('monthField').value = month;
  document.getElementById('weekField').value = week;

});


const weekdays = getWeekdays(date);
weekdays.forEach(weekday => {
  const option = document.createElement('option');
  option.value = weekday;  // option 的 value
  option.textContent = weekday; // 顯示在選單上的文字
  dateSelect.appendChild(option);
});
if (dateSelect.options.length > 0) {
  dateSelect.selectedIndex = 0;
  dateSelect.dispatchEvent(new Event('change'));
}


//function
//計算當周為第幾周

function getWeekNumber(date){
    const start = new Date(date.getFullYear(), 0, 1);
    const diff = date - start;
    return Math.ceil((diff / 86400000 + 1) / 7);

}
console.log(getWeekNumber(date));


function getWeekdays(date) {
  // 1. 保護原本的 date，不修改外部變數
  const d = new Date(date);

  // 2. 取得星期（0=日, 1=一, ..., 6=六）
  const day = d.getDay();

  // 3. 算出距離星期一要加減幾天
  // 若 day=0（星期日）需要特別處理
  const diffToMonday = day === 0 ? -6 : 1 - day;

  // 4. 設定為星期一
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);

  // 5. 從星期一往後五天
  const result = [];
  for (let i = 0; i < 5; i++) {
    const temp = new Date(monday);
    temp.setDate(monday.getDate() + i);
    result.push(dateFormat(temp));
  }

  return result;
}



//日期格式
function dateFormat(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 記得 JS 的月份是 0-11，要 +1
    const day = date.getDate();
    return `${year}/${month}/${day}`;
}
console.log(getWeekdays(date));

function parseDateFormat(dateStr){
  const [year,month,day] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day);
}

function getYearWeekMonth(dateStr){
  const date = parseDateFormat(dateStr);
    return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    week: getWeekNumber(date) 
  };
}





//串接後端api
async function getEmpName(){
  try {
    const url = await fetch('http://localhost:8080/workdiary/employees/all');
    const data = await url.json();
    return data.map(emp => emp.empName);
  } catch (err) {
    console.error('錯誤:', err);
    return [];
  }
}
//調用員工名稱api


async function loadEmpName() {
  const empNameList = document.getElementById('empNameList');
  const empNames = await getEmpName();

  empNames.forEach(empName => {
    const option = document.createElement('option');
    option.value = empName;
    option.textContent = empName;
    empNameList.appendChild(option);
  });
}
loadEmpName();
async function getEmpDept(empName) {
  const url = new URL('http://localhost:8080/workdiary/employees/dept');
  url.searchParams.append('EmpName', empName);

  const res = await fetch(url);
  const data = await res.json();
  return data;
}

// 監聽輸入框，使用者輸入完成（失去焦點或按 Enter）就抓資料
const empNameInput = document.getElementById('empNameValue');

empNameInput.addEventListener('change', async () => {
  const empName = empNameInput.value.trim();
  if (!empName) return; // 如果沒有輸入就不處理

  console.log('輸入完成的名字:', empName);
  const data = await getEmpDept(empName);

  // 自動帶入部門
  document.getElementById('empDeptField').value = data.dept || '';
});



async function getWorkItem(){
  try{
    const url = new URL('http://localhost:8080/workdiary/workitem/all');
    const res = await fetch(url);
    const data = await res.json();
    console.log(data.map(data => data.workItem));
    return data.map(data => data.workItem);
  }catch(err){
    console.log(err);
    return '';
  }
}
async function loadWorkItem(){
  const workItemSelect = document.getElementById('workItemSelect');
  const workitems = await getWorkItem();
  workitems.forEach(workitem => {
    const option = document.createElement('option');
    option.value = workitem;
    option.textContent = workitem;
    workItemSelect.appendChild(option);
  });
}
loadWorkItem();

async function getProjectName(){
  try{
    const url = new URL('http://localhost:8080/workdiary/projectname/all')
    const res = await fetch(url);
    const data = await res.json();
    return data.map(data => data.projectName);
  }catch(err){
    console.log(err);
    return '';
  }

}
async function loadProjectName(){
  const projectNameSelect = document.getElementById('projectNameSelect');
  const projectNames = await getProjectName();
  projectNames.forEach(projectName => {
    const option = document.createElement('option');
    option.value = projectName;
    option.textContent = projectName;
    projectNameSelect.appendChild(option);
  });

}
loadProjectName();

function WorkItemModel(){
  let yearFieldValue = document.getElementById('yearField').value || '';
  let weekFieldValue = document.getElementById('weekField').value || '';
  let monthFieldValue = document.getElementById('monthField').value || '';
  let dateSelectValue = document.getElementById('dateSelect').value || '';
  let empNameValue = document.getElementById('empNameValue').value || '';
  let empDeptFieldValue = document.getElementById('empDeptField').value || '';
  let workItemSelectValue = document.getElementById('workItemSelect').value || '';
  let projectNameSelectValue = document.getElementById('projectNameSelect').value || '';
  let workDescriptionValue = document.getElementById('workDescription').value || '';
  let devMinuteValue = document.getElementById('devMinute').value || '';
  let serverMinuteValue = document.getElementById('serverMinute').value || '';
  let systemMinuteValue = document.getElementById('systemMinute').value || '';

  let fullWorkDescription = projectNameSelectValue+':'+workDescriptionValue;

  return{
    fields:{
      yearFieldValue,
      weekFieldValue,
      monthFieldValue,
      dateSelectValue,
      empNameValue,
      empDeptFieldValue,
      workItemSelectValue,
      fullWorkDescription,
      devMinuteValue,
      serverMinuteValue,
      systemMinuteValue
    },
    list:[
      yearFieldValue,
      weekFieldValue,
      monthFieldValue,
      dateSelectValue,
      empNameValue,
      empDeptFieldValue,
      workItemSelectValue,
      fullWorkDescription,
      devMinuteValue,
      serverMinuteValue,
      systemMinuteValue
    ]
  };
}


const insertBtn = document.getElementById('insertBtn');
insertBtn.addEventListener('click', async () => {
   

  

  const { fields, list: workItems } = WorkItemModel();

  // ===== 欄位檢查 =====
  for (let i = 0; i < workItems.length - 3; i++) {
    if (workItems[i] === '') {
      alert('有空欄位');
      return;
    }
  }

  // ===== 組送後端資料 =====
  const workItemJson = {
    year: fields.yearFieldValue,
    week: fields.weekFieldValue,
    month: fields.monthFieldValue,
    date: fields.dateSelectValue,
    initDept: fields.empDeptFieldValue,
    initBy: fields.empNameValue,
    workitem: fields.workItemSelectValue,
    itemDescribe: fields.fullWorkDescription,
    devMinute: fields.devMinuteValue,
    supportMinute: fields.serverMinuteValue,
    systemMinute: fields.systemMinuteValue
  };

  try {
    let res;
    const editId = insertBtn.dataset.editId; 

    if(editId){
        res = await fetch(`http://localhost:8080/workdiary/update/${editId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(workItemJson)
      });

    }else{
      res = await fetch('http://localhost:8080/workdiary/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(workItemJson)
      });


    }

    
    if (!res.ok) {
      throw new Error('新增失敗');
    }

  
    await getWorkItems();
    insertBtn.dataset.editId = '';


    // ===== 清空表單 =====
    document.getElementById('empNameValue').value = '';
    document.getElementById('empDeptField').value = '';
    document.getElementById('workDescription').value = '';
    document.getElementById('devMinute').value = '';
    document.getElementById('serverMinute').value = '';
    document.getElementById('devMinute').value = '';


  } catch (err) {
    console.error(err);
    alert('新增資料失敗，請稍後再試');
  }
});

function  getWorkItems(){

  const url = new URL('http://localhost:8080/workdiary/all');

  fetch(url, { method: "GET" })
    .then(response => response.json())
    .then(json => {
        console.log(json);
        workDiariesActions(json);
        const sumByDate = sumWeekMinutes(json);
        renderWeekSum(sumByDate);
      })
    .catch(err => console.error("Fetch error:", err));
}

function workDiariesActions(json){
  const tbody = document.getElementById('workItemRow');
  tbody.innerHTML = ""; // 先清空

    json.forEach(item => {
      let id = item.id;
      console.log(id);
      const tr = document.createElement('tr');

      // 依照顯示欄位順序，加欄位
      const values = [
        item.year,
        item.week,
        item.month,
        item.date,
        item.initBy,
        item.initDept,
        item.workitem,
        item.itemDescribe,
        item.devMinute,
        item.supportMinute,
        item.systemMinute
      ];

      values.forEach(v => {
        const td = document.createElement('td');
        td.textContent = v;
        tr.appendChild(td);
      });
          /* ===== 修改按鈕 ===== */
      const editTd = document.createElement('td');
      const editBtn = document.createElement('button');

      editBtn.addEventListener('click',()=>{
        // 年
        document.getElementById('yearField').value = item.year;

        // 週
        document.getElementById('weekField').value = item.week;

        // 月
        document.getElementById('monthField').value = item.month;

        // 日期
        document.getElementById('dateSelect').value = item.date;

        // 員工姓名
        document.getElementById('empNameValue').value = item.initBy;

        // 部門
        document.getElementById('empDeptField').value = item.initDept;

        // 工作項目
        document.getElementById('workItemSelect').value = item.workitem;

        const [projectName, workDesc] = item.itemDescribe.split(':');
        document.getElementById('projectNameSelect').value = projectName || '';
        document.getElementById('workDescription').value = workDesc || '';

        // 工時
        document.getElementById('devMinute').value = item.devMinute;
        document.getElementById('serverMinute').value = item.supportMinute;
        document.getElementById('systemMinute').value = item.systemMinute;

        document.getElementById('insertBtn').dataset.editId = item.id;
        const editId = insertBtn.dataset.editId;
        console.log(editId);
        
      })


      editBtn.textContent = '修改';
      editBtn.className = 'btn btn-sm btn-warning';

      editTd.appendChild(editBtn);
      tr.appendChild(editTd);

      /* ===== 刪除按鈕 ===== */
      const deleteTd = document.createElement('td');
      const deleteBtn = document.createElement('button');
      
      deleteBtn.addEventListener('click',()=>{
        alert('確定要刪除嗎?');
        fetch('http://localhost:8080/workdiary/delete/'+id,{
          method:'DELETE',
        })
        .then(res => res.text()) 
        .then(res => console.log(res))  
        .then(() => {
          getWorkItems();

        })

      })
        
      deleteBtn.textContent = '刪除';
      deleteBtn.className = 'btn btn-sm btn-danger';

      deleteTd.appendChild(deleteBtn);
      tr.appendChild(deleteTd);
      
      tbody.appendChild(tr);
  });
}


getWorkItems();
const saveNewEmployeeBtn = document.getElementById('saveNewEmployeeBtn');
const saveNewProjectNameBtn = document.getElementById('saveNewProjectNameBtn');
const modalSaveBtn = document.querySelector('.modalSaveBtn');

document.querySelectorAll('.modalSaveBtn').forEach(btn=>{
  btn.addEventListener('click',async()=>{
    const type = btn.dataset.type;
     try {
      if (type === 'createEmployee') {
        await saveEmployee();
        closeModal('createNewEmployeeModal');
        loadEmpName();
      }

      if (type === 'createProjectName') {
        await saveProject();
        closeModal('createNewProjectNameModal');
        loadProjectName();

      }
    } catch (error) {
      alert(error.message);
    }
  });
});


async function saveEmployee() {
  const empName = document.getElementById('empName').value.trim();
  const empId = document.getElementById('empId').value.trim();
  const empDept = document.getElementById('empDept').value.trim();

  // 表單驗證
  if (!empName || !empId || !empDept) {
    throw new Error('請填寫所有員工欄位');
  }

  const res = await fetch('http://localhost:8080/workdiary/employees/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ empName, empId, empDept })
  });

  if (!res.ok) {
    throw new Error('新增員工失敗');
  }
}


async function saveProject() {
  const projectName = document.getElementById('projectName').value.trim();

  if (!projectName) {
    throw new Error('請輸入專案名稱');
  }

  const res = await fetch('http://localhost:8080/workdiary/projectname/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectName })
  });

  if (!res.ok) {
    throw new Error('新增專案失敗');
  }
}

function closeModal(modalId) {
  const modalEl = document.getElementById(modalId);
  const modal = bootstrap.Modal.getInstance(modalEl);
  modal.hide();
}

document.getElementById('downloadExcel').addEventListener('click',async()=>{
  const res = await fetch('http://localhost:8080/workdiary/download',{
    method:'GET'
  });
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'WorkDiary.xlsx';
  a.click();

  window.URL.revokeObjectURL(url);
});

document.getElementById('sendMail').addEventListener('click',async()=>{
  try{
    const res = await fetch('http://localhost:8080/workdiary/sendmail',{
      method:'GET'
    })
    if(!res.ok){
      throw new Error('郵件發失敗');
    }
    const message = await res.text();
    alert(message);

  } catch (err) {
      console.error(err);
      alert('寄信時發生錯誤');
    }
});

document.getElementById('deleteAll').addEventListener('click',async()=>{
  try{
    const res = await fetch('http://localhost:8080/workdiary/delete',{
      method:'DELETE'
    });
    const message = await res.text();
    alert(message);
    await getWorkItems();

  } catch (err) {
      console.error(err);
      alert('刪除時發生錯誤');
    }
});

function sumWeekMinutes(workitems){
  const result = {};

  workitems.forEach(workitem => {
    const date = workitem.date;

    const dev = Number(workitem.devMinute) || 0;
    const support = Number(workitem.supportMinute) || 0;
    const system = Number(workitem.systemMinute) || 0;

    const total = dev + support + system;

    if (!result[date]) {
      result[date] = 0;
    }

    result[date] += total;
  });

  console.log('加總結果:', result); // ⭐ 建議保留
  return result;
}


const thisDateMap = {
  0: 'mondayDate',
  1: 'tuesdayDate',
  2: 'wednesdayDate',
  3: 'thursdayDate',
  4: 'fridayDate'
};

function renderWeekSum(sumByDate) {
  const weekDates = getWeekdays(new Date()); 

  weekDates.forEach((dateStr, index) => {
    const container = document.getElementById(thisDateMap[index]);
    if (!container) return;

    const totalMinute = sumByDate[dateStr] || 0;

    // 清空舊資料（避免重複顯示）
    container.innerHTML = `
      <p>${dateStr}</p>
      <p class="totalMinute">
        總工時：${totalMinute} 分
      </p>
    `;
  });
}
















