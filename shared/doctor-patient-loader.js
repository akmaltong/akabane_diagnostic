/*
KUNGFU MAN · AKABANE
Фикс выбора пациента при запуске диагностики из CRM.

Подключить в doctor/index.html перед закрывающим </body>:

<script src="../shared/doctor-patient-loader.js"></script>
*/

(function(){
  const params = new URLSearchParams(location.search);
  const patientId =
    params.get('patient_id') ||
    params.get('patientId') ||
    params.get('patient') ||
    localStorage.getItem('akabane_active_patient_id') ||
    '';

  const patientName =
    params.get('patient_name') ||
    params.get('patientName') ||
    localStorage.getItem('akabane_active_patient_name') ||
    '';

  if(!patientId && !patientName) return;

  const payload = {
    id: patientId,
    full_name: patientName,
    name: patientName
  };

  localStorage.setItem('akabane_current_patient', JSON.stringify(payload));
  localStorage.setItem('akabane_selected_patient', JSON.stringify(payload));
  localStorage.setItem('akabane_active_patient_id', patientId);
  localStorage.setItem('akabane_active_patient_name', patientName);

  window.akabaneCurrentPatient = payload;
  window.currentPatient = payload;
  window.currentPatientId = patientId;
  window.selectedPatientId = patientId;

  function fillPatientInputs(){
    const inputs = Array.from(document.querySelectorAll('input'));
    const textInputs = inputs.filter(i => {
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

    if(textInputs[0] && patientName){
      textInputs[0].value = patientName;
      textInputs[0].dispatchEvent(new Event('input', {bubbles:true}));
      textInputs[0].dispatchEvent(new Event('change', {bubbles:true}));
    }

    const selectedLabels = Array.from(document.querySelectorAll('*')).filter(el => {
      const txt = (el.textContent || '').trim();
      return txt.includes('Выбран:') || txt.includes('Выбран пациент');
    });

    selectedLabels.forEach(el => {
      el.textContent = 'Выбран: ' + patientName;
    });
  }

  function patchStartButtons(){
    const buttons = Array.from(document.querySelectorAll('button'));
    buttons.forEach(btn => {
      const txt = (btn.textContent || '').toLowerCase();
      if(txt.includes('начать диагностику')){
        btn.addEventListener('click', function(){
          localStorage.setItem('akabane_current_patient', JSON.stringify(payload));
          localStorage.setItem('akabane_selected_patient', JSON.stringify(payload));
          localStorage.setItem('akabane_active_patient_id', patientId);
          localStorage.setItem('akabane_active_patient_name', patientName);

          window.akabaneCurrentPatient = payload;
          window.currentPatient = payload;
          window.currentPatientId = patientId;
          window.selectedPatientId = patientId;

          fillPatientInputs();
        }, true);
      }
    });
  }

  function run(){
    fillPatientInputs();
    patchStartButtons();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', run);
  }else{
    run();
  }

  setTimeout(run, 300);
  setTimeout(run, 1000);
})();
