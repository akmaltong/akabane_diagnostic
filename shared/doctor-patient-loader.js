/*
KUNGFU MAN · AKABANE
doctor-patient-loader.js v3 HARD FIX

Что делает:
1. Берёт patient_id / patient_name из URL.
2. Если имени нет — берёт из localStorage.
3. Если всё равно нет — для реальных ID подставляет имя вручную:
   11111111-1111-4111-8111-111111111111 = Рустамчон
   22222222-2222-4222-8222-222222222222 = АбдуАхад
4. Заполняет поле ФИО пациента несколько раз, чтобы основной скрипт диагностики не успел стереть значение.
*/

(function(){
  const FALLBACK_PATIENTS = {
    '11111111-1111-4111-8111-111111111111': 'Рустамчон',
    '22222222-2222-4222-8222-222222222222': 'АбдуАхад'
  };

  function getSavedJson(key){
    try{
      return JSON.parse(localStorage.getItem(key) || 'null');
    }catch(e){
      return null;
    }
  }

  function readPatient(){
    const params = new URLSearchParams(location.search);

    let patientId =
      params.get('patient_id') ||
      params.get('patientId') ||
      params.get('patient') ||
      localStorage.getItem('akabane_active_patient_id') ||
      '';

    let patientName =
      params.get('patient_name') ||
      params.get('patientName') ||
      params.get('name') ||
      localStorage.getItem('akabane_active_patient_name') ||
      '';

    const saved1 = getSavedJson('akabane_current_patient');
    const saved2 = getSavedJson('akabane_selected_patient');

    if(!patientId){
      patientId = saved1?.id || saved2?.id || '';
    }

    if(!patientName){
      patientName =
        saved1?.full_name ||
        saved1?.name ||
        saved2?.full_name ||
        saved2?.name ||
        '';
    }

    if(patientId && !patientName && FALLBACK_PATIENTS[patientId]){
      patientName = FALLBACK_PATIENTS[patientId];
    }

    return {
      id: patientId,
      full_name: patientName,
      name: patientName
    };
  }

  function savePatient(patient){
    if(!patient || (!patient.id && !patient.full_name)) return;

    localStorage.setItem('akabane_current_patient', JSON.stringify(patient));
    localStorage.setItem('akabane_selected_patient', JSON.stringify(patient));
    localStorage.setItem('akabane_active_patient_id', patient.id || '');
    localStorage.setItem('akabane_active_patient_name', patient.full_name || '');

    window.akabaneCurrentPatient = patient;
    window.currentPatient = patient;
    window.currentPatientId = patient.id || '';
    window.selectedPatientId = patient.id || '';
    window.patientId = patient.id || '';
    window.patientName = patient.full_name || '';
  }

  function findPatientInput(){
    const inputs = Array.from(document.querySelectorAll('input'));

    let byId = inputs.find(i => {
      const id = (i.id || '').toLowerCase();
      const name = (i.name || '').toLowerCase();
      return id.includes('patient') || id.includes('fio') || name.includes('patient') || name.includes('fio');
    });

    if(byId) return byId;

    let byPlaceholder = inputs.find(i => {
      const ph = (i.getAttribute('placeholder') || '').toLowerCase();
      return ph.includes('фио') || ph.includes('пациент');
    });

    if(byPlaceholder) return byPlaceholder;

    return inputs.find(i => ((i.getAttribute('type') || 'text').toLowerCase() === 'text')) || null;
  }

  function fillPatient(patient){
    if(!patient || !patient.full_name) return false;

    const input = findPatientInput();
    if(!input) return false;

    input.value = patient.full_name;
    input.dataset.patientId = patient.id || '';

    input.dispatchEvent(new Event('input', { bubbles:true }));
    input.dispatchEvent(new Event('change', { bubbles:true }));
    input.dispatchEvent(new KeyboardEvent('keyup', { bubbles:true }));

    savePatient(patient);

    return true;
  }

  function patchStartButton(patient){
    const buttons = Array.from(document.querySelectorAll('button'));

    buttons.forEach(btn => {
      const txt = (btn.textContent || '').toLowerCase();

      if(txt.includes('начать диагностику') && !btn.dataset.akabanePatientPatch){
        btn.dataset.akabanePatientPatch = '1';

        btn.addEventListener('click', function(e){
          savePatient(patient);
          fillPatient(patient);

          const input = findPatientInput();
          if(input && !input.value && patient.full_name){
            input.value = patient.full_name;
          }
        }, true);
      }
    });
  }

  function run(){
    const patient = readPatient();

    if(!patient.id && !patient.full_name) return;

    savePatient(patient);
    fillPatient(patient);
    patchStartButton(patient);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', run);
  }else{
    run();
  }

  // Жёстко повторяем, потому что основной скрипт диагностики может перерисовать поле.
  setTimeout(run, 100);
  setTimeout(run, 300);
  setTimeout(run, 700);
  setTimeout(run, 1200);
  setTimeout(run, 2000);
})();
