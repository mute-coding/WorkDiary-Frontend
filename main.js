

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
  const d = new Date(date);
  const day = d.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);
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

const API_BASE_URL = 'http://localhost:8080';
//const API_BASE_URL = "https://phylis-nonpresentational-gussie.ngrok-free.dev";


//fetch api example
/*
async function getData() {
  const url = "https://example.org/products.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error(error.message);
  }
}
*/


//table無資料預設顯示
function showTableMessage(message){
  const tbody = document.getElementById('workItemRow');
    tbody.innerHTML = '';

  const tr = document.createElement('tr');
  const td = document.createElement('td');
  td.colSpan = 13; 
  td.textContent = message;
  td.style.textAlign = 'center';
  td.style.color = '#888';

  tr.appendChild(td);
  tbody.appendChild(tr);
}


//調用員工名稱api
async function loadEmpName() {
  const url = `${API_BASE_URL}/workdiary/employees/all`;
  //回傳response物件
  const response = await fetch(url,{
    method:'GET',
    headers:{
      'ngrok-skip-browser-warning': 'true'
    }
  });
  console.log(url);
  if (!response.ok) {
      throw new Error("server未開啟或發生異常");
  }
  //response物件轉json格式
  const empNameJsonData = await response.json();
  console.log(empNameJsonData);
  const empNameList = document.getElementById('empNameList');
  const empNames = empNameJsonData.map(data => data.empName);

  empNames.forEach(empName => {
    const option = document.createElement('option');
    option.value = empName;
    option.textContent = empName;
    empNameList.appendChild(option);
  });
}
loadEmpName();

async function getAllDept(){
  const url = `${API_BASE_URL}/workdiary/employees/allDept`;
  const response = await fetch(url,{
    method:'GET',
    headers:{
      'ngrok-skip-browser-warning': 'true'
    }
  });
  if (!response.ok) {
      throw new Error("server未開啟或發生異常");
  }
  console.log(response);

  const allDeptJsonData = await response.json();
  console.log(allDeptJsonData);
  const empDeptSelecter = document.getElementById('empDeptSelecter');
  allDeptJsonData.forEach(empDept => {
    const option = document.createElement('option');
    option.value = empDept;
    option.textContent = empDept;
    empDeptSelecter.appendChild(option);
  });

}
getAllDept();

//抓取員工部門
async function getEmpDept(empName) {
  //寫入RequestParame參數
  const params = new URLSearchParams({
    EmpName: empName
  });
  const url = `${API_BASE_URL}/workdiary/employees/dept?${params.toString()}`;
  const response = await fetch(url,{
    method:'GET',
    headers:{
      'ngrok-skip-browser-warning': 'true'
    }
  });
  if (!response.ok) {
      throw new Error("server未開啟或發生異常");
  }
  const empDeptJsonData = await response.json();
  return empDeptJsonData;
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



async function loadWorkItem(){
  const url = `${API_BASE_URL}/workdiary/workitem/all`;
  const response = await fetch(url,{
    method:'GET',
    headers:{
      'ngrok-skip-browser-warning': 'true'
    }
  });
  if (!response.ok) {
      throw new Error("server未開啟或發生異常");
  }
  const workItemJsonData = await response.json();
  console.log(workItemJsonData.map(data => data.workItem));
  const workItemSelect = document.getElementById('workItemSelect');
  const workitems = workItemJsonData.map(data => data.workItem);
  workitems.forEach(workitem => {
    const option = document.createElement('option');
    option.value = workitem;
    option.textContent = workitem;
    workItemSelect.appendChild(option);
  });
}
loadWorkItem();


async function loadProjectName(){
  const url = `${API_BASE_URL}/workdiary/projectname/all`;
  const response = await fetch(url,{
    method:'GET',
    headers:{
      'ngrok-skip-browser-warning': 'true'
    }
  });
  if (!response.ok) {
      throw new Error("server未開啟或發生異常");
  }
  const projectNameJsonData = await response.json();
  const projectNameSelect = document.getElementById('projectNameSelect');
  const projectNames = projectNameJsonData.map(data => data.projectName);
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
    let url;
    let response;
    const editId = insertBtn.dataset.editId; 
    if(editId){
        url = `${API_BASE_URL}/workdiary/update/${editId}`
        response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(workItemJson)
      });
    if (!response.ok) {
      throw new Error("server未開啟或發生異常");
    }

    }else{
      url = `${API_BASE_URL}/workdiary/save`;
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(workItemJson)
      });
    }
    if (!response.ok) {
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

async function  getWorkItems(){
  const url = `${API_BASE_URL}/workdiary/all`;
  try{
    const response = await fetch(url,{
      method:'GET',
      headers:{
        'ngrok-skip-browser-warning': 'true'
      }
    });
    if (!response.ok) {
      throw new Error("server未開啟或發生異常");
    }
    const workItemJsonData = await response.json();
    console.log(workItemJsonData);
    if (!workItemJsonData || workItemJsonData.length === 0) {
      showTableMessage('無資料');
      renderWeekSum({});
      return;
    }
    workDiariesActions(workItemJsonData);
    const sumByDate = sumWeekMinutes(workItemJsonData);
    renderWeekSum(sumByDate);
  }catch(error) {
    console.error(error);
    showTableMessage('無資料或 Server 未開啟');
    renderWeekSum({});
  }
}

function workDiariesActions(workItenjson){
  const tbody = document.getElementById('workItemRow');
  tbody.innerHTML = ""; // 先清空
    workItenjson.forEach(item => {
      let deleteID = item.id;
      console.log(deleteID);
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
      
      deleteBtn.addEventListener('click',async ()=>{
        alert('確定要刪除嗎?');

        const url = `${API_BASE_URL}/workdiary/delete/`+deleteID;
        const response = await fetch(url,{
          method:'DELETE',
          headers:{
            'ngrok-skip-browser-warning': 'true'
          }
        });
        if (!response.ok) {
          throw new Error("server未開啟或發生異常");
        }
        const message = await response.text();
        alert(message);
        getWorkItems();
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
  const empDept = document.getElementById('empDeptSelecter').value.trim();


  // 表單驗證
  if (!empName || !empId || !empDept) {
    throw new Error('請填寫所有員工欄位');
  }

  const url = `${API_BASE_URL}/workdiary/employees/create`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true' 
    },
    body: JSON.stringify({ empName, empId, empDept })
  });
  if (!response.ok) {
      throw new Error("server未開啟或發生異常");
  }
  document.getElementById('empName').value = "";
  document.getElementById('empId').value = "";
  document.getElementById('empDeptSelecter').value = "";
  alert("新增員工成功");

  if (!response.ok) {
    throw new Error('新增員工失敗');
  }
}


async function saveProject() {
  const projectName = document.getElementById('projectName').value.trim();

  if (!projectName) {
    throw new Error('請輸入專案名稱');
  }
  const url = `${API_BASE_URL}/workdiary/projectname/create`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    },
    body: JSON.stringify({ projectName })
  });

  document.getElementById('projectName').value = "";

  if (!response.ok) {
    throw new Error('新增專案失敗');
  }
}

function closeModal(modalId) {
  const modalEl = document.getElementById(modalId);
  const modal = bootstrap.Modal.getInstance(modalEl);
  modal.hide();
}

document.getElementById('downloadExcel').addEventListener('click',async()=>{
  
  const url = `${API_BASE_URL}/workdiary/download`;
  
  const response = await fetch(url,{
    method:'GET',
    headers:{
      'ngrok-skip-browser-warning': 'true'
    }
  });
  if (!response.ok) {
      throw new Error("server未開啟或發生異常");
  }
  const blob = await response.blob();
  const dowmloadURL = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'WorkDiary.xlsx';
  a.click();

  window.URL.revokeObjectURL(dowmloadURL);
});

document.getElementById('sendMail').addEventListener('click',async()=>{
  try{

    const url = `${API_BASE_URL}/workdiary/sendmail`;

    const response = await fetch(url,{
      method:'GET',
      headers:{
        'ngrok-skip-browser-warning': 'true'
      }

    })
    if(!response.ok){
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
    const url = `${API_BASE_URL}/workdiary/delete`;
    const response = await fetch(url,{
      method:'DELETE',
      'ngrok-skip-browser-warning': 'true'
    });
    if (!response.ok) {
      throw new Error("server未開啟或發生異常");
    }
    const message = await response.text();
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

  console.log('加總結果:', result); 
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
















