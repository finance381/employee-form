import { useState, useRef } from 'react'
import { supabase } from './lib/supabase'
import { prepUpload } from './lib/uploadHelper'

var DOC_TYPES = [
  { key: 'aadhaar', label: 'Aadhaar Card', labelKey: 'doc_aadhaar', required: false },
  { key: 'pan', label: 'PAN Card', labelKey: 'doc_pan', required: false },
  { key: 'passport', label: 'Passport', labelKey: 'doc_passport', required: false },
  { key: 'resume', label: 'Resume', labelKey: 'doc_resume', required: false },
  { key: 'driving_license', label: 'Driving Licence', labelKey: 'doc_driving_license', required: false },
  { key: 'voter_id', label: 'Voter ID', labelKey: 'doc_voter_id', required: false },
  { key: 'bank_proof', label: 'Bank Passbook / Cheque', labelKey: 'doc_bank_proof', required: false },
  { key: 'education', label: 'Educational Certificate', labelKey: 'doc_education', required: false },
  { key: 'previous_employment', label: 'Previous Employment Letter', labelKey: 'doc_previous_employment', required: false },
  { key: 'address_proof', label: 'Address Proof', labelKey: 'doc_address_proof', required: false },
  { key: 'medical_fitness', label: 'Medical Fitness Certificate', labelKey: 'doc_medical_fitness', required: false },
  { key: 'police_verification', label: 'Police Verification', labelKey: 'doc_police_verification', required: false }
]

var T = {
  en: {
    header_title: 'New Employee Joining Form',
    header_subtitle: 'Fill in your details to join',
    success_title: 'Submission Received',
    success_msg: 'Your details have been submitted successfully.',
    success_ref: 'Reference Number',
    success_hint: 'Please share this reference with HR. Someone will contact you for next steps.',
    lang_en: 'EN', lang_hi: 'हिं',

    sec1_title: 'Personal Details', sec1_sub: 'Basic information about you',
    sec2_title: 'Address', sec2_sub: 'Where you live',
    sec3_title: 'Emergency Contact', sec3_sub: 'In case we need to reach someone',
    sec4_title: 'Bank Details', sec4_sub: 'Optional — for salary transfer',
    sec5_title: 'Salary', sec5_sub: 'Wages and monthly salary',
    sec6_title: 'Previous Employment', sec6_sub: 'Your last job details',
    sec7_title: 'Documents', sec7_sub: 'All uploads optional',
    sec8_title: 'Declaration', sec8_sub: '',

    lbl_photo: 'Employee Photo', lbl_source: 'Source / Reference by',
    lbl_full_name: 'Full Name', lbl_father_name: "Father's Name",
    lbl_dob: 'Date of Birth', lbl_gender: 'Gender',
    lbl_mobile: 'Mobile Number', lbl_email: 'Email ID',
    lbl_aadhaar_no: 'Aadhaar Number', lbl_pan_no: 'PAN Number',
    gender_select: '-- Select --', gender_male: 'Male', gender_female: 'Female', gender_other: 'Other',
    lbl_cur_addr: 'Current Address', lbl_cur_pin: 'Current Pin Code',
    lbl_perm_same: 'Permanent address same as current',
    lbl_perm_addr: 'Permanent Address', lbl_perm_pin: 'Permanent Pin Code',
    lbl_emg_name: 'Contact Person Name', lbl_relationship: 'Relationship',
    lbl_bank_name: 'Bank Name', lbl_branch: 'Branch',
    lbl_acct_num: 'Account Number', lbl_ifsc: 'IFSC Code',
    lbl_night_wage: 'Nightly Wages (₹)', lbl_new_salary: 'New Salary (₹ / month)',
    lbl_resume: 'Resume',
    lbl_hiring_person: 'Hiring Person', lbl_hire_department: 'Job Department',
    ph_hiring_person: 'Name of person who hired you', ph_hire_department: 'e.g. Housekeeping, Kitchen',
    lbl_prev_company: 'Previous Company Name', lbl_city: 'City', lbl_state: 'State',
    lbl_prev_salary: 'Previous Drawn Salary (₹)',

    ph_as_per_aadhaar: 'As per Aadhaar', ph_referrer: 'Who referred you?',
    ph_10_digit: '10-digit number', ph_email: 'you@example.com',
    ph_aadhaar_12: '12 digits', ph_pan_fmt: 'AAAAA9999A',
    ph_addr: 'House / Street / City / State', ph_relationship: 'Father / Spouse / etc',
    ph_ifsc: 'ABCD0123456', ph_company: 'Company name',
    ph_city: 'City', ph_state: 'State',

    doc_aadhaar: 'Aadhaar Card', doc_pan: 'PAN Card', doc_passport: 'Passport',
    doc_resume: 'Resume', doc_driving_license: 'Driving Licence', doc_voter_id: 'Voter ID',
    doc_bank_proof: 'Bank Passbook / Cheque', doc_education: 'Educational Certificate',
    doc_previous_employment: 'Previous Employment Letter', doc_address_proof: 'Address Proof',
    doc_medical_fitness: 'Medical Fitness Certificate', doc_police_verification: 'Police Verification',

    decl_text: 'I declare that all information provided is correct and true to the best of my knowledge.',

    photo_added: 'Photo added', retake: 'Retake', choose_diff: 'Choose different', remove: 'Remove',
    add_photo: 'Add employee photo', add_photo_hint: 'Take a selfie or choose from gallery',
    cam_btn: '📷 Camera', gal_btn: '🖼️ Gallery',
    tap_upload: 'Tap to upload (image or PDF)',

    err_full_name: 'Full Name required', err_mobile: 'Mobile Number required',
    err_aadhaar_fmt: 'Aadhaar must be 12 digits', err_pan_fmt: 'PAN format invalid (AAAAA9999A)',
    err_cur_addr: 'Current address required', err_emg: 'Emergency contact required',
    err_new_salary: 'New Salary required', err_prev_company: 'Previous Company Name required',
    err_prev_city: 'Previous City required', err_prev_state: 'Previous State required',
    err_prev_salary: 'Previous Drawn Salary required', err_ifsc: 'IFSC format invalid',
    err_declaration: 'Please accept the declaration',

    prog_preparing: 'Preparing submission...', prog_photo: 'Compressing photo...',
    prog_compressing: 'Compressing files...', prog_compressing_x: 'Compressing {name}...',
    prog_uploading: 'Uploading...',
    submitting: 'Submitting...', submit: 'Submit Form'
  },
  hi: {
    header_title: 'नया कर्मचारी ज्वाइनिंग फॉर्म',
    header_subtitle: 'अपने विवरण भरें',
    success_title: 'जमा हो गया',
    success_msg: 'आपके विवरण सफलतापूर्वक जमा हो गए हैं।',
    success_ref: 'संदर्भ संख्या',
    success_hint: 'कृपया इस संदर्भ संख्या को HR के साथ साझा करें। कोई आपसे अगले चरणों के लिए संपर्क करेगा।',
    lang_en: 'EN', lang_hi: 'हिं',

    sec1_title: 'व्यक्तिगत जानकारी', sec1_sub: 'आपकी बुनियादी जानकारी',
    sec2_title: 'पता', sec2_sub: 'आप कहाँ रहते हैं',
    sec3_title: 'आपातकालीन संपर्क', sec3_sub: 'आपात स्थिति में संपर्क',
    sec4_title: 'बैंक विवरण', sec4_sub: 'वैकल्पिक — वेतन जमा के लिए',
    sec5_title: 'वेतन', sec5_sub: 'मजदूरी और मासिक वेतन',
    sec6_title: 'पिछला रोज़गार', sec6_sub: 'आपकी पिछली नौकरी के विवरण',
    sec7_title: 'दस्तावेज़', sec7_sub: 'सभी अपलोड वैकल्पिक',
    sec8_title: 'घोषणा', sec8_sub: '',

    lbl_photo: 'कर्मचारी की फ़ोटो', lbl_source: 'संदर्भ / किसने भेजा',
    lbl_full_name: 'पूरा नाम', lbl_father_name: 'पिता का नाम',
    lbl_dob: 'जन्म तिथि', lbl_gender: 'लिंग',
    lbl_mobile: 'मोबाइल नंबर', lbl_email: 'ईमेल आईडी',
    lbl_aadhaar_no: 'आधार संख्या', lbl_pan_no: 'पैन संख्या',
    gender_select: '-- चुनें --', gender_male: 'पुरुष', gender_female: 'महिला', gender_other: 'अन्य',
    lbl_cur_addr: 'वर्तमान पता', lbl_cur_pin: 'वर्तमान पिन कोड',
    lbl_perm_same: 'स्थायी पता वर्तमान पते के समान है',
    lbl_perm_addr: 'स्थायी पता', lbl_perm_pin: 'स्थायी पिन कोड',
    lbl_emg_name: 'संपर्क व्यक्ति का नाम', lbl_relationship: 'रिश्ता',
    lbl_bank_name: 'बैंक का नाम', lbl_branch: 'शाखा',
    lbl_acct_num: 'खाता संख्या', lbl_ifsc: 'IFSC कोड',
    lbl_night_wage: 'रात्रि मजदूरी (₹)', lbl_new_salary: 'नया वेतन (₹ / माह)',
    lbl_resume: 'रिज्यूमे',
    lbl_hiring_person: 'भर्ती करने वाला', lbl_hire_department: 'कार्य विभाग',
    ph_hiring_person: 'आपको भर्ती करने वाले का नाम', ph_hire_department: 'जैसे हाउसकीपिंग, रसोई',
    lbl_prev_company: 'पिछली कंपनी का नाम', lbl_city: 'शहर', lbl_state: 'राज्य',
    lbl_prev_salary: 'पिछला आहरित वेतन (₹)',

    ph_as_per_aadhaar: 'आधार के अनुसार', ph_referrer: 'आपको किसने भेजा?',
    ph_10_digit: '10 अंकों का नंबर', ph_email: 'you@example.com',
    ph_aadhaar_12: '12 अंक', ph_pan_fmt: 'AAAAA9999A',
    ph_addr: 'मकान / गली / शहर / राज्य', ph_relationship: 'पिता / जीवनसाथी / आदि',
    ph_ifsc: 'ABCD0123456', ph_company: 'कंपनी का नाम',
    ph_city: 'शहर', ph_state: 'राज्य',

    doc_aadhaar: 'आधार कार्ड', doc_pan: 'पैन कार्ड', doc_passport: 'पासपोर्ट',
    doc_resume: 'रिज्यूमे', doc_driving_license: 'ड्राइविंग लाइसेंस', doc_voter_id: 'मतदाता पहचान पत्र',
    doc_bank_proof: 'बैंक पासबुक / चेक', doc_education: 'शैक्षिक प्रमाण पत्र',
    doc_previous_employment: 'पिछले रोज़गार का पत्र', doc_address_proof: 'पता प्रमाण',
    doc_medical_fitness: 'चिकित्सा फिटनेस प्रमाण पत्र', doc_police_verification: 'पुलिस सत्यापन',

    decl_text: 'मैं घोषणा करता/करती हूँ कि ऊपर दी गई सभी जानकारी सही है।',

    photo_added: 'फ़ोटो जोड़ी गई', retake: 'फिर से लें', choose_diff: 'दूसरी चुनें', remove: 'हटाएं',
    add_photo: 'कर्मचारी की फ़ोटो जोड़ें', add_photo_hint: 'सेल्फी लें या गैलरी से चुनें',
    cam_btn: '📷 कैमरा', gal_btn: '🖼️ गैलरी',
    tap_upload: 'अपलोड करने के लिए दबाएं (छवि या PDF)',

    err_full_name: 'पूरा नाम आवश्यक है', err_mobile: 'मोबाइल नंबर आवश्यक है',
    err_aadhaar_fmt: 'आधार 12 अंकों का होना चाहिए', err_pan_fmt: 'पैन प्रारूप गलत है (AAAAA9999A)',
    err_cur_addr: 'वर्तमान पता आवश्यक है', err_emg: 'आपातकालीन संपर्क आवश्यक है',
    err_new_salary: 'नया वेतन आवश्यक है', err_prev_company: 'पिछली कंपनी का नाम आवश्यक है',
    err_prev_city: 'पिछला शहर आवश्यक है', err_prev_state: 'पिछला राज्य आवश्यक है',
    err_prev_salary: 'पिछला आहरित वेतन आवश्यक है', err_ifsc: 'IFSC प्रारूप गलत है',
    err_declaration: 'कृपया घोषणा स्वीकार करें',

    prog_preparing: 'जमा करने की तैयारी...', prog_photo: 'फ़ोटो संपीड़ित की जा रही है...',
    prog_compressing: 'फ़ाइलें संपीड़ित की जा रही हैं...', prog_compressing_x: '{name} संपीड़ित की जा रही है...',
    prog_uploading: 'अपलोड हो रहा है...',
    submitting: 'जमा हो रहा है...', submit: 'फॉर्म जमा करें'
  }
}

function tr(lang, k) {
  return (T[lang] && T[lang][k]) || T.en[k] || k
}

function fileExt(name) {
  var i = name.lastIndexOf('.')
  return i > 0 ? name.substring(i + 1).toLowerCase() : 'bin'
}

function humanSize(b) {
  if (!b) return ''
  if (b < 1024) return b + ' B'
  if (b < 1024 * 1024) return (b / 1024).toFixed(0) + ' KB'
  return (b / 1024 / 1024).toFixed(1) + ' MB'
}

function Section(props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 mb-4">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold shrink-0">{props.n}</div>
        <div>
          <h2 className="text-base md:text-lg font-semibold text-gray-900">{props.title}</h2>
          {props.subtitle ? <p className="text-xs text-gray-500 mt-0.5">{props.subtitle}</p> : null}
        </div>
      </div>
      {props.children}
    </div>
  )
}

function Field(props) {
  return (
    <label className={'block ' + (props.className || 'mb-4')}>
      <span className="text-xs font-medium text-gray-600 block mb-1.5 uppercase tracking-wide">
        {props.label}{props.required ? <span className="text-red-500"> *</span> : null}
      </span>
      {props.children}
    </label>
  )
}

var inputBase = 'w-full border border-gray-200 rounded-lg px-3.5 py-2.5 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition'

function TextInput(props) {
  return <input {...props} style={Object.assign({ fontSize: '16px' }, props.style || {})}
    className={inputBase + ' ' + (props.className || '')} />
}

function TextArea(props) {
  return <textarea {...props} style={Object.assign({ fontSize: '16px' }, props.style || {})}
    className={inputBase + ' resize-none ' + (props.className || '')} />
}

function SelectInput(props) {
  return <select {...props} style={Object.assign({ fontSize: '16px' }, props.style || {})}
    className={inputBase + ' ' + (props.className || '')}>{props.children}</select>
}

function PhotoUpload(props) {
  var camRef = useRef(null)
  var galRef = useRef(null)
  var f = props.file
  var previewUrl = f ? URL.createObjectURL(f) : null
  var t = props.t || function (k) { return k }
  function pickCam(e) { e.stopPropagation(); if (camRef.current) camRef.current.click() }
  function pickGal(e) { e.stopPropagation(); if (galRef.current) galRef.current.click() }
  function clear(e) { e.stopPropagation(); props.onChange(null); if (camRef.current) camRef.current.value = ''; if (galRef.current) galRef.current.value = '' }
  return (
    <div>
      <input ref={camRef} type="file" accept="image/*" capture="user" className="hidden"
        onChange={function (e) { props.onChange(e.target.files[0] || null) }} />
      <input ref={galRef} type="file" accept="image/*" className="hidden"
        onChange={function (e) { props.onChange(e.target.files[0] || null) }} />

      {previewUrl ? (
        <div className="flex items-center gap-4 border-2 border-dashed border-gray-200 rounded-xl p-4">
          <img src={previewUrl} alt="Photo" className="w-20 h-20 rounded-lg object-cover border border-gray-200" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900">{t('photo_added')}</div>
            <div className="text-xs text-gray-500 mt-0.5 truncate">{f.name + ' • ' + humanSize(f.size)}</div>
            <div className="flex gap-2 mt-2">
              <button type="button" onClick={pickCam} className="text-xs px-2 py-1 rounded border border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-medium">{t('retake')}</button>
              <button type="button" onClick={pickGal} className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium">{t('choose_diff')}</button>
              <button type="button" onClick={clear} className="text-xs px-2 py-1 rounded text-red-500 hover:text-red-600 font-medium ml-auto">{t('remove')}</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900">{t('add_photo')}</div>
              <div className="text-xs text-gray-500 mt-0.5">{t('add_photo_hint')}</div>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button type="button" onClick={pickCam}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition">
              {t('cam_btn')}
            </button>
            <button type="button" onClick={pickGal}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition">
              {t('gal_btn')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function DocUpload(props) {
  var inputRef = useRef(null)
  var f = props.file
  var t = props.t || function (k) { return k }
  function pick() { if (inputRef.current) inputRef.current.click() }
  function clear(e) { e.stopPropagation(); props.onChange(null); if (inputRef.current) inputRef.current.value = '' }
  return (
    <div className={'border rounded-xl p-4 transition ' + (f ? 'border-green-300 bg-green-50/40' : 'border-gray-200 bg-gray-50/40 hover:border-indigo-300 hover:bg-indigo-50/30')}>
      <input ref={inputRef} type="file" accept="image/*,application/pdf" className="hidden"
        onChange={function (e) { props.onChange(e.target.files[0] || null) }} />
      <div onClick={pick} className="cursor-pointer flex items-center gap-3">
        <div className={'w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ' + (f ? 'bg-green-500 text-white' : 'bg-white border border-gray-200 text-gray-400')}>
          {f ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
            {props.label}{props.required ? <span className="text-red-500">*</span> : null}
          </div>
          <div className="text-xs text-gray-500 mt-0.5 truncate">
            {f ? (f.name + ' • ' + humanSize(f.size)) : t('tap_upload')}
          </div>
        </div>
        {f ? (
          <button type="button" onClick={clear} className="text-xs text-red-500 hover:text-red-600 font-medium shrink-0">{t('remove')}</button>
        ) : null}
      </div>
    </div>
  )
}

function PublicEmployeeForm() {
  var [saving, setSaving] = useState(false)
  var [done, setDone] = useState(null)
  var [error, setError] = useState('')
  var [uploadProgress, setUploadProgress] = useState('')
  var [lang, setLang] = useState(function () {
    try { var v = localStorage.getItem('emp_lang'); return v === 'en' ? 'en' : 'hi' } catch (e) { return 'hi' }
  })
  function switchLang(next) {
    setLang(next)
    try { localStorage.setItem('emp_lang', next) } catch (e) {}
  }
  function t(k) { return tr(lang, k) }

  var [sourceRef, setSourceRef] = useState('')
  var [photoFile, setPhotoFile] = useState(null)
  var [fullName, setFullName] = useState('')
  var [fatherName, setFatherName] = useState('')
  var [dob, setDob] = useState('')
  var [gender, setGender] = useState('')
  var [mobile, setMobile] = useState('')
  var [email, setEmail] = useState('')
  var [aadhaar, setAadhaar] = useState('')
  var [pan, setPan] = useState('')

  var [curAddr, setCurAddr] = useState('')
  var [curPin, setCurPin] = useState('')
  var [permSame, setPermSame] = useState(false)
  var [permAddr, setPermAddr] = useState('')
  var [permPin, setPermPin] = useState('')

  var [emgName, setEmgName] = useState('')
  var [emgRel, setEmgRel] = useState('')
  var [emgMob, setEmgMob] = useState('')

  var [bankName, setBankName] = useState('')
  var [branchName, setBranchName] = useState('')
  var [acctNum, setAcctNum] = useState('')
  var [ifsc, setIfsc] = useState('')

  var [nightWage, setNightWage] = useState('')
  var [prevSalary, setPrevSalary] = useState('')
  var [newSalary, setNewSalary] = useState('')
  var [hiringPerson, setHiringPerson] = useState('')
  var [hireDepartment, setHireDepartment] = useState('')

  var [prevCompany, setPrevCompany] = useState('')
  var [prevCity, setPrevCity] = useState('')
  var [prevState, setPrevState] = useState('')

  var [docFiles, setDocFiles] = useState({})
  var [declared, setDeclared] = useState(false)

  var honeyRef = useRef(null)

  function setDocFile(k, f) {
    var next = Object.assign({}, docFiles)
    next[k] = f
    setDocFiles(next)
  }

  async function handleSubmit(e) {
    if (e && e.preventDefault) e.preventDefault()
    if (saving) return
    setError('')

    if (!fullName.trim()) return setError(t('err_full_name'))
    if (!mobile.trim()) return setError(t('err_mobile'))
    if (aadhaar.trim() && !/^[0-9]{12}$/.test(aadhaar.replace(/\s/g, ''))) return setError(t('err_aadhaar_fmt'))
    if (pan.trim() && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan.trim().toUpperCase())) return setError(t('err_pan_fmt'))
    if (!curAddr.trim()) return setError(t('err_cur_addr'))
    if (!emgName.trim() || !emgRel.trim() || !emgMob.trim()) return setError(t('err_emg'))
    if (!newSalary || Number(newSalary) <= 0) return setError(t('err_new_salary'))
    if (!prevCompany.trim()) return setError(t('err_prev_company'))
    if (!prevCity.trim()) return setError(t('err_prev_city'))
    if (!prevState.trim()) return setError(t('err_prev_state'))
    if (!prevSalary || Number(prevSalary) <= 0) return setError(t('err_prev_salary'))
    if (ifsc && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.trim().toUpperCase())) return setError(t('err_ifsc'))
    if (!declared) return setError(t('err_declaration'))

    setSaving(true)
    try {
      setUploadProgress(t('prog_preparing'))
      var payload = {
        source_reference: sourceRef.trim() || null,
        full_name: fullName.trim(),
        father_name: fatherName.trim() || null,
        dob: dob || null,
        gender: gender || null,
        contact_number: mobile.trim(),
        personal_email: email.trim() || null,
        aadhaar_number: aadhaar.replace(/\s/g, ''),
        pan_number: pan.trim().toUpperCase(),
        present_address: curAddr.trim(),
        present_pincode: curPin.trim() || null,
        permanent_same_as_current: permSame,
        permanent_address: permSame ? curAddr.trim() : (permAddr.trim() || null),
        permanent_pincode: permSame ? (curPin.trim() || null) : (permPin.trim() || null),
        emergency_contact_name: emgName.trim(),
        emergency_contact_relationship: emgRel.trim(),
        emergency_contact_number: emgMob.trim(),
        bank_name: bankName.trim() || null,
        branch_name: branchName.trim() || null,
        bank_account_number: acctNum.trim() || null,
        ifsc_code: ifsc.trim().toUpperCase() || null,
        night_wage_rupees: nightWage ? Number(nightWage) : null,
        prev_drawn_salary_rupees: prevSalary ? Number(prevSalary) : null,
        new_salary_rupees: newSalary ? Number(newSalary) : null,
        previous_company_name: prevCompany.trim() || null,
        previous_city: prevCity.trim() || null,
        previous_state: prevState.trim() || null,
        hiring_person: hiringPerson.trim() || null,
        hire_department: hireDepartment.trim() || null,
        declaration_accepted: true,
        honey_field: honeyRef.current ? honeyRef.current.value : ''
      }

      var fd = new FormData()
      fd.append('payload', JSON.stringify(payload))
      if (photoFile) {
        setUploadProgress(t('prog_photo'))
        var photoF = await prepUpload(photoFile, 100)
        fd.append('photo', photoF, 'photo.' + fileExt(photoF.name))
      }
      for (var i = 0; i < DOC_TYPES.length; i++) {
        var dt = DOC_TYPES[i]
        var f = docFiles[dt.key]
        if (!f) continue
        setUploadProgress(t('prog_compressing_x').replace('{name}', t(dt.labelKey)))
        var prepped = await prepUpload(f, 200)
        fd.append('doc_' + dt.key, prepped, dt.key + '.' + fileExt(prepped.name))
      }

      setUploadProgress(t('prog_uploading'))
      var res = await supabase.functions.invoke('submit-employee', { body: fd })
      if (res.error) {
        var msg = res.error.message || 'Submission failed'
        try {
          var body = res.error.context && res.error.context.body
          if (body) {
            var parsed = typeof body === 'string' ? JSON.parse(body) : body
            if (parsed && parsed.error) msg = parsed.error
          }
        } catch (ex) {}
        throw new Error(msg)
      }
      if (!res.data || !res.data.ok) throw new Error((res.data && res.data.error) || 'Submission failed')
      setDone({ ref: res.data.reference_code })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err.message || String(err))
    } finally {
      setSaving(false)
      setUploadProgress('')
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-5">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('success_title')}</h1>
          <p className="text-gray-500 text-sm mb-6">{t('success_msg')}</p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="text-xs text-gray-500 mb-1">{t('success_ref')}</div>
            <div className="font-mono text-lg font-semibold text-gray-900">{done.ref}</div>
          </div>
          <p className="text-xs text-gray-500">{t('success_hint')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-3xl mx-auto px-4 py-6 md:py-8">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl md:text-3xl font-bold">{t('header_title')}</h1>
              <p className="text-indigo-100 text-sm mt-1">{t('header_subtitle')}</p>
            </div>
            <div className="flex rounded-full bg-white/20 backdrop-blur p-0.5 text-xs font-semibold shrink-0">
              <button type="button" onClick={function () { switchLang('en') }}
                className={'px-3 py-1 rounded-full transition ' + (lang === 'en' ? 'bg-white text-indigo-700' : 'text-white/90 hover:text-white')}
                style={{ fontSize: '13px' }}>
                {t('lang_en')}
              </button>
              <button type="button" onClick={function () { switchLang('hi') }}
                className={'px-3 py-1 rounded-full transition ' + (lang === 'hi' ? 'bg-white text-indigo-700' : 'text-white/90 hover:text-white')}
                style={{ fontSize: '13px' }}>
                {t('lang_hi')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 pb-32">
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }} aria-hidden="true">
          <input ref={honeyRef} type="text" name="website" tabIndex="-1" autoComplete="off" />
        </div>

        <Section n="1" title={t('sec1_title')} subtitle={t('sec1_sub')}>
          <Field label={t('lbl_photo')} className="mb-5">
            <PhotoUpload file={photoFile} onChange={setPhotoFile} lang={lang} t={t} />
          </Field>
          <Field label={t('lbl_source')}>
            <TextInput value={sourceRef} onChange={function (e) { setSourceRef(e.target.value) }} placeholder={t('ph_referrer')} />
          </Field>
          <Field label={t('lbl_full_name')} required>
            <TextInput value={fullName} onChange={function (e) { setFullName(e.target.value) }} placeholder={t('ph_as_per_aadhaar')} />
          </Field>
          <Field label={t('lbl_father_name')}>
            <TextInput value={fatherName} onChange={function (e) { setFatherName(e.target.value) }} />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label={t('lbl_dob')}>
              <TextInput type="date" value={dob} onChange={function (e) { setDob(e.target.value) }} />
            </Field>
            <Field label={t('lbl_gender')}>
              <SelectInput value={gender} onChange={function (e) { setGender(e.target.value) }}>
                <option value="">{t('gender_select')}</option>
                <option value="Male">{t('gender_male')}</option>
                <option value="Female">{t('gender_female')}</option>
                <option value="Other">{t('gender_other')}</option>
              </SelectInput>
            </Field>
          </div>
          <Field label={t('lbl_mobile')} required>
            <TextInput type="tel" value={mobile} onChange={function (e) { setMobile(e.target.value) }} placeholder={t('ph_10_digit')} />
          </Field>
          <Field label={t('lbl_email')}>
            <TextInput type="email" value={email} onChange={function (e) { setEmail(e.target.value) }} placeholder={t('ph_email')} />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label={t('lbl_aadhaar_no')}>
              <TextInput value={aadhaar} onChange={function (e) { setAadhaar(e.target.value.replace(/\s/g, '')) }} maxLength="12" placeholder={t('ph_aadhaar_12')} />
            </Field>
            <Field label={t('lbl_pan_no')}>
              <TextInput value={pan} onChange={function (e) { setPan(e.target.value.toUpperCase()) }} maxLength="10" placeholder={t('ph_pan_fmt')} />
            </Field>
          </div>
        </Section>

        <Section n="2" title={t('sec2_title')} subtitle={t('sec2_sub')}>
          <Field label={t('lbl_cur_addr')} required>
            <TextArea rows="2" value={curAddr} onChange={function (e) { setCurAddr(e.target.value) }} placeholder={t('ph_addr')} />
          </Field>
          <Field label={t('lbl_cur_pin')}>
            <TextInput value={curPin} onChange={function (e) { setCurPin(e.target.value.replace(/\D/g, '')) }} maxLength="10" />
          </Field>
          <label className="flex items-center gap-2.5 mb-4 cursor-pointer select-none py-1">
            <input type="checkbox" checked={permSame} onChange={function (e) { setPermSame(e.target.checked) }}
              className="w-4 h-4 accent-indigo-600" />
            <span className="text-sm text-gray-700">{t('lbl_perm_same')}</span>
          </label>
          {!permSame ? (
            <div>
              <Field label={t('lbl_perm_addr')}>
                <TextArea rows="2" value={permAddr} onChange={function (e) { setPermAddr(e.target.value) }} />
              </Field>
              <Field label={t('lbl_perm_pin')} className="mb-0">
                <TextInput value={permPin} onChange={function (e) { setPermPin(e.target.value.replace(/\D/g, '')) }} maxLength="10" />
              </Field>
            </div>
          ) : null}
        </Section>

        <Section n="3" title={t('sec3_title')} subtitle={t('sec3_sub')}>
          <Field label={t('lbl_emg_name')} required>
            <TextInput value={emgName} onChange={function (e) { setEmgName(e.target.value) }} />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label={t('lbl_relationship')} required>
              <TextInput value={emgRel} onChange={function (e) { setEmgRel(e.target.value) }} placeholder={t('ph_relationship')} />
            </Field>
            <Field label={t('lbl_mobile')} required className="mb-0">
              <TextInput type="tel" value={emgMob} onChange={function (e) { setEmgMob(e.target.value) }} />
            </Field>
          </div>
        </Section>

        <Section n="4" title={t('sec4_title')} subtitle={t('sec4_sub')}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label={t('lbl_bank_name')}>
              <TextInput value={bankName} onChange={function (e) { setBankName(e.target.value) }} />
            </Field>
            <Field label={t('lbl_branch')}>
              <TextInput value={branchName} onChange={function (e) { setBranchName(e.target.value) }} />
            </Field>
            <Field label={t('lbl_acct_num')}>
              <TextInput value={acctNum} onChange={function (e) { setAcctNum(e.target.value.replace(/\D/g, '')) }} />
            </Field>
            <Field label={t('lbl_ifsc')} className="mb-0">
              <TextInput value={ifsc} onChange={function (e) { setIfsc(e.target.value.toUpperCase()) }} maxLength="11" placeholder={t('ph_ifsc')} />
            </Field>
          </div>
        </Section>

        <Section n="5" title={t('sec5_title')} subtitle={t('sec5_sub')}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <Field label={t('lbl_night_wage')} className="mb-0">
              <TextInput type="number" min="0" step="1" value={nightWage} onChange={function (e) { setNightWage(e.target.value) }} placeholder="0" />
            </Field>
            <Field label={t('lbl_new_salary')} required className="mb-0">
              <TextInput type="number" min="0" step="1" value={newSalary} onChange={function (e) { setNewSalary(e.target.value) }} placeholder="0" />
            </Field>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <Field label={t('lbl_hiring_person')} className="mb-0">
              <TextInput value={hiringPerson} onChange={function (e) { setHiringPerson(e.target.value) }} placeholder={t('ph_hiring_person')} />
            </Field>
            <Field label={t('lbl_hire_department')} className="mb-0">
              <TextInput value={hireDepartment} onChange={function (e) { setHireDepartment(e.target.value) }} placeholder={t('ph_hire_department')} />
            </Field>
          </div>
          <DocUpload label={t('lbl_resume')} required={false}
            file={docFiles.resume}
            onChange={function (f) { setDocFile('resume', f) }} t={t} />
        </Section>

        <Section n="6" title={t('sec6_title')} subtitle={t('sec6_sub')}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label={t('lbl_prev_company')} required>
              <TextInput value={prevCompany} onChange={function (e) { setPrevCompany(e.target.value) }} placeholder={t('ph_company')} />
            </Field>
            <Field label={t('lbl_city')} required>
              <TextInput value={prevCity} onChange={function (e) { setPrevCity(e.target.value) }} placeholder={t('ph_city')} />
            </Field>
            <Field label={t('lbl_state')} required>
              <TextInput value={prevState} onChange={function (e) { setPrevState(e.target.value) }} placeholder={t('ph_state')} />
            </Field>
            <Field label={t('lbl_prev_salary')} required className="mb-0">
              <TextInput type="number" min="0" step="1" value={prevSalary} onChange={function (e) { setPrevSalary(e.target.value) }} placeholder="0" />
            </Field>
          </div>
        </Section>

        <Section n="7" title={t('sec7_title')} subtitle={t('sec7_sub')}>
          <div className="space-y-3">
            {DOC_TYPES.filter(function (dt) { return dt.key !== 'resume' }).map(function (dt) {
              return (
                <DocUpload key={dt.key} label={t(dt.labelKey)} required={dt.required}
                  file={docFiles[dt.key]}
                  onChange={function (f) { setDocFile(dt.key, f) }} t={t} />
              )
            })}
          </div>
        </Section>

        <Section n="8" title={t('sec8_title')} subtitle={t('sec8_sub')}>
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input type="checkbox" checked={declared} onChange={function (e) { setDeclared(e.target.checked) }}
              className="mt-1 w-4 h-4 accent-indigo-600 shrink-0" />
            <span className="text-sm text-gray-700 leading-relaxed">
              {t('decl_text')}
            </span>
          </label>
        </Section>

        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4 flex items-start gap-2">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{error}</span>
          </div>
        ) : null}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-3xl mx-auto">
          {saving && uploadProgress ? (
            <div className="text-xs text-gray-500 mb-2 text-center">{uploadProgress}</div>
          ) : null}
          <button onClick={handleSubmit} disabled={saving}
            className={'w-full py-3.5 rounded-xl font-semibold text-white shadow-md transition ' + (saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg active:scale-[0.99]')}>
            {saving ? t('submitting') : t('submit')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PublicEmployeeForm
