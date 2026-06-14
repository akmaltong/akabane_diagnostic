/*
KUNGFU MAN · AKABANE
doctor-patient-loader.js v2

Фикс:
- если CRM передал patient_id, но имя не подставилось,
  этот файл сам загружает пациента из Supabase и вставляет ФИО в диагностику.

Подключение в doctor/index.html перед </body>:

<script src="../shared/doctor-patient-loader.js"></script>
*/

(function(){
  const SUPABASE_URL = 'https://ytalluctuccinghqaotw.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_1rbvxxVRGzBVOYUKbMku4w_jEo8dQxd';

  function getParams(){
    const params = new URLSearchParams(location.search);

    return {
      patientId:
        params.get('patient_id') ||
        params.get('patientId') ||
        params.get('patient') ||
        localStorage.getItem('akabane_active_patient_id') ||
        '',

      patientName:
        params.get('patient_name') ||
        params.get('patientName') ||
        localStorage.getItem('akabane_active_patient_name') ||
        ''
    };
  }

  function savePatient(patient){
    if(!patient) return;

    const payload = {
      id: patient.id || '',
      full_name: patient.full_name || patient.name || '',
      name: patient.full_name || patient.name || '',
      phone: patient.phone || ''
    };

    localStorage.setItem('akabane_current_patient', JSON.stringify(payload));
    localStorage.setItem('akabane_selected_patient', JSON.stringify(payload));
    localStorage.setItem('akabane_active_patient_id', payload.id);
    localStorage.setItem('akabane_active_patient_name', payload.full_name);

    window.akabaneCurrentPatient = payload;
    window.currentPatient = payload;
    window.currentPatientId = payload.id;
    window.selectedPatientId = payload.id;

    return payload;
  }

  async function fetchPatientById(patientId){
    if(!patientId) return null;

    if(!window.supabase){
      console.warn('Supabase SDK ещё не загружен');
      return null;
    }

    const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    const { data, error } = await sb
      .from('patients')
      .select('*')
      .eq('id', patientId)
      .maybeSingle();

    if(error){
      console.error('Ошибка загрузки пациента:', error.message);
      return null;
    }

    return data;
  }

  function fillPatientName(patient){
    if(!patient) return;

    const patientName = patient.full_name || patient.name || '';
    const patientId = patient.id || '';

    if(!patientName) return;

    const inputs = Array.from(document.querySelectorAll('input'));

    const targetInputs = inputs.filter(i => {
      const type = (i.getAttribute('type') || 'text').toLowerCase();
      const ph = (i.getAttribute('placeholder') || '').toLowerCase();
      const id = (i.id || '').toLowerCase();
      const name = (i.name || '').toLowerCase();

      return type === 'text' && (
        ph.includes('фио') ||
        ph.includes('пациент') ||
        id.includes('patient') ||
        id.includes('fio') ||
        name.includes('patient') ||
        name.includes('fio')
      );
    });

    if(targetInputs[0]){
      targetInputs[0].value = patientName;
      targetInputs[0].dataset.patientId = patientId;
      targetInputs[0].dispatchEvent(new Event('input', {bubbles:true}));
      targetInputs[0].dispatchEvent(new Event('change', {bubbles:true}));
    }
  }

  function patchStartButton(patient){
    if(!patient) return;

    const buttons = Array.from(document.querySelectorAll('button'));

    buttons.forEach(btn => {
      const txt = (btn.textContent || '').toLowerCase();

      if(txt.includes('начать диагностику') && !btn.dataset.patientPatch){
        btn.dataset.patientPatch = '1';

        btn.addEventListener('click', function(){
          savePatient(patient);
          fillPatientName(patient);
        }, true);
      }
    });
  }

  async function run(){
    let { patientId, patientName } = getParams();

    let patient = null;

    if(patientId && patientName){
      patient = {
        id: patientId,
        full_name: patientName
      };
    }

    if(patientId && !patientName){
      patient = await fetchPatientById(patientId);
    }

    if(!patient){
      try{
        const saved =
          JSON.parse(localStorage.getItem('akabane_current_patient') || 'null') ||
          JSON.parse(localStorage.getItem('akabane_selected_patient') || 'null');

        if(saved && (saved.full_name || saved.name)){
          patient = saved;
        }
      }catch(e){}
    }

    if(!patient) return;

    patient = savePatient(patient);

    fillPatientName(patient);
    patchStartButton(patient);

    setTimeout(() => {
      fillPatientName(patient);
      patchStartButton(patient);
    }, 300);

    setTimeout(() => {
      fillPatientName(patient);
      patchStartButton(patient);
    }, 1000);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', run);
  }else{
    run();
  }
})();
