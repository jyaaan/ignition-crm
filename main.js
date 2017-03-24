// SORTING STUFF

function sortLeads(leads, prop) {

  function compareLower(a, b) {
    var propA = a[prop].value.toLowerCase();
    var propB = b[prop].value.toLowerCase();

    // Check to see if these variables are necessary.
    if (propA < propB) {
      return -1;
    }
    if (propA > propB {
      return 1;
    }
      return 0;
  }
}

// GLOBAL VARS

var grid = {
  title: 'Leads',
  selectAll: true,
  columns: ['firstName', 'lastName', 'brand', 'stage', 'id'],
  filterBy: null,
  uneditedLead: new lead(),
  checkedLeadIds: [],
  leads: [
    new lead('alex', 'timmons', 'king leonidas', 'demo', 'aaa1'),
    new lead('chris', 'hobbs', 'fake doors', 'negotiations', 'aaa2'),
    new lead('john', 'yamashiro', 'eatify basics', 'icebox', 'aaa3')
  ]
}

function lead(fname = '', lname = '', bname = '', stage = '', id = '') {
  this.firstName = { field: fname, isEditable: true };
  this.lastName = { field: lname, isEditable: true };
  this.brand = { field: bname, isEditable: true };
  this.stage = { field: stage, isEditable: true };
  this.id = { field: id, isEditable: false };
};

// UTILITY FUNCTIONS

function clearChildNodes($elem) {
  while($elem.firstChild) {
    $elem.removeChild($elem.firstChild);
  }
}

function swapVisibility($elemToHide, $elemToShow) {
  $elemToHide.classList.add('hidden');
  $elemToShow.classList.remove('hidden');
}

function areArrayValuesIdentical(el, index, arr) {
  if (index === 0) {
    return true;
  } else {
    return (el === arr[index - 1]);
  }
}

function getLeadArrayByIds(masterLeads, arrId) {
  var matchLeads = [];
  arrId.forEach(function (id) {
    matchLeads.push(getMasterLeadById(masterLeads, id));
  })
  return matchLeads;
}

// TABLE FUNCTIONS

var h = createElement;
function createElement(tagName, attributes, children) {
  var $element = document.createElement(tagName);

  for (var prop in attributes) {
    if (!(prop == 'disabled' && attributes[prop] == false)) {
      $element.setAttribute(prop, attributes[prop]);
    }
  }
  if (!children) return $element;
  children.forEach(function (child) {
    if (child instanceof Node) {
      $element.appendChild(child);
    } else {
      $element.appendChild(document.createTextNode(child));
    }
  })
  return $element;
}

function renderLead(lead) {
  var $lead =
    h('tr', { 'lead-id': lead.id.field }, [
      h('input', { type: 'checkbox', 'checkbox-id': lead.id.field, class: 'table-checkbox'}),
      h('td', { 'lead-id': lead.id.field }, [lead.id.field]),
      h('td', { 'lead-id': lead.id.field }, [lead.firstName.field]),
      h('td', { 'lead-id': lead.id.field }, [lead.lastName.field]),
      h('td', { 'lead-id': lead.id.field }, [lead.brand.field]),
      h('td', { 'lead-id': lead.id.field }, [lead.stage.field])
    ]);
  return $lead;
}

function renderHeader() {
  var $header =
    h('tr', {}, [
      h('input', { type: 'checkbox', 'checkbox-id': 'header', class: 'table-checkbox'}),
      h('th', {}, ['id']),
      h('th', {}, ['firstName']),
      h('th', {}, ['lastName']),
      h('th', {}, ['brand']),
      h('th', {}, ['stage'])
    ])
  return $header;
}

function createTable(leads) {
  $table = document.querySelector('#lead-table');
  $table.appendChild(renderHeader());
  leads.forEach( function (lead) {
    $table.appendChild(renderLead(lead));
  })
}

function anyAreChecked() {
  var isChecked = false;
  document.querySelectorAll('.table-checkbox').forEach(function (box) {
    if (box.checked) {
      isChecked = true;
    }
  })
  return isChecked;
}

function initializeLeadPage() {
  clearChildNodes($leadTable);
  createTable(grid.leads);
  resetFilter();
}

function resetFilter() {
  var $dropdownButton = document.querySelector('#dropdown-button');
  var $filterInput = document.querySelector('#filter-input');
  $applyFilterButton.disabled = true;
  $filterInput.value = '';
  $filterInput.disabled = true;
  $dropdownButton.textContent = 'Filter By';
}

// POPUP FUNCTIONS

function createLeadForm(editLead, $formRow, isEdit = true) {
  for (var prop in editLead) {
    var $arrElems = [];
    var inputValue = isEdit ? editLead[prop].field : '';
    var $propertyDiv = h('div', { class: 'col-xs-2'}, [
      h('span', { class: 'input-group' }, [prop]),
      h('input', { class: 'form-control lead-property-input', type: 'text',
        'lead-property': prop, disabled: !editLead[prop].isEditable,
        value: inputValue})
    ])
    $formRow.appendChild($propertyDiv);
  }
}

// types can be new, edit, mass
function updatePopupForm($form, type) {
  var $leadPopupDetail = document.querySelector('.lead-edit-details');
  var $leadEditPU = document.querySelector('#lead-edit-popup');

  $leadEditPU.setAttribute('popup-type', type);
  clearChildNodes($leadPopupDetail);
  $leadPopupDetail.appendChild($form);
  $leadEditPU.style.display = 'inline-block';
}

function closePopup() {
  var inputLead = getLeadInputArray();
  var $leadEditPU = document.querySelector('#lead-edit-popup');

  if (checkIfChanged(inputLead, grid.uneditedLead)) {
    if (confirm('Save your changes?')) {
      savePopupData(inputLead, grid.uneditedLead);
      initializeLeadPage();
    }
  }
  $leadEditPU.style.display = 'none';
}

function savePopup() {
  var inputLead = getLeadInputArray();
  var $leadEditPU = document.querySelector('#lead-edit-popup');

  savePopupData(inputLead, grid.uneditedLead);
  initializeLeadPage();
  $leadEditPU.style.display = 'none';
}

function savePopupData(inputLead, masterLead) {
  var $leadEditPU = document.querySelector('#lead-edit-popup');
  if (checkIfChanged(inputLead, masterLead)) {
    if (checkIfNew(inputLead)) {
      inputLead = assignNewId(inputLead);
      addLead(inputLead);
    } else {
      if ($leadEditPU.getAttribute('popup-type', 'mass') === 'mass') {
        updateMassLeads(grid.checkedLeadIds, inputLead, grid.leads, masterLead);
      } else {
        updateMasterLead(inputLead, grid.leads);
      }
    }

  }
}

// MASS EDIT FUNCTIONS

function createMassEditLead(editLeads) {
  var tempLead = new lead();
  for (var prop in editLeads[0]) {
    var arrPropValues = [];
    editLeads.forEach(function (lead) {
      arrPropValues.push(lead[prop].field);
    })
    if(arrPropValues.every(areArrayValuesIdentical)) {
      tempLead[prop].field = arrPropValues[0];
    } else {
      tempLead[prop].field = prop;
    }
  }
  return tempLead;
}

function updateMassLeads(leadIds, inputLead, masterLeads, massEditLead) {
  for (var prop in inputLead) {
    if (isPropertyChanged(inputLead, massEditLead, prop)) {
      leadIds.forEach(function (id) {
        var editLeadPosition = getMasterLeadIndexById(masterLeads, id);
        masterLeads[editLeadPosition][prop].field = inputLead[prop].field;
      })
    }
  }
}

// LEAD DATA FUNCTIONS

function createLeadsFromCSV(csvData) {
  var importLeads = [];
  var propertyNames = csvData[0];

  for (var i = 1; i < csvData.length; i++) {
    var tempLead = new lead();
    for (var j = 0; j < csvData[i].length; j++) {
      tempLead[csvData[0][j]].field = csvData[i][j];
    }
    tempLead = assignNewId(tempLead);
    importLeads.push(tempLead);
  }
  return importLeads;
}

function isPropertyChanged(inputLead, massEditLead, prop) {
  return (inputLead[prop].field !== massEditLead[prop].field);
}

function createLead() {
  grid.uneditedLead = new lead();
  var $popupRow = h('div', { class: 'row' });
  createLeadForm(grid.uneditedLead, $popupRow, false);
  updatePopupForm($popupRow, 'new');
}

function getLeadInputArray() {
  var $arrLeadInputs = document.querySelectorAll('.lead-property-input');
  var inputLead = new lead();

  $arrLeadInputs.forEach(function (input) {
    inputLead[input.getAttribute('lead-property')].field = input.value;
  })
  return inputLead;
}

function updateMasterLead(inputLead, masterLeads) {
  masterLeads[getMasterLeadIndexById(masterLeads, inputLead.id.field)] = inputLead;
}

function checkIfChanged(inputLead, masterLead) {
  for (var prop in masterLead) {
    if (masterLead[prop].field !== inputLead[prop].field) {
      return true;
    }
  }
  return false;
}

function checkIfNew(inputLead) {
  if (inputLead.id.field === '') {
    return true;
  }
  return false;
}

function assignNewId(lead) {
  lead.id.field = Math.random().toString(32).substr(2, 9);
  return lead;
}

function addLead(lead) {
  grid.leads.push(lead);
}

function getMasterLeadById(masterLeads, leadId) {
  return masterLeads.find(function (lead) {
    return lead.id.field === leadId;
  })
}

function getMasterLeadIndexById(masterLeads, leadId) {
  return masterLeads.findIndex(function (lead) {
    return lead.id.field === leadId;
  })
}

function getFilteredLeads(filterProperty, filterValue, masterLeads) {
  var filteredLeads = [];

  masterLeads.forEach(function (lead) {
    if (lead[filterProperty].field == filterValue) {
      filteredLeads.push(lead);
    }
  })
  return filteredLeads;
}

// EVENT LISTENERS AND VARIABLES
var $landingPageDashboard = document.querySelector('#landing-page-dashboard');
var $landingPageDetails = document.querySelector('#landing-page-details');
var $leadDashboard = document.querySelector('#lead-page-dashboard');
var $leadDetails = document.querySelector('#lead-details');

var $leadButton = document.querySelector('#lead-button');
$leadButton.addEventListener('click',function () {
  swapVisibility($landingPageDetails, $leadDetails);
  swapVisibility($landingPageDashboard, $leadDashboard);
  initializeLeadPage();
})

var $homeButton = document.querySelector('#home-button');
$homeButton.addEventListener('click', function () {
  swapVisibility($leadDetails, $landingPageDetails);
  swapVisibility($leadDashboard, $landingPageDashboard);
})

var $leadTable = document.querySelector('#lead-table');
$leadTable.addEventListener('click', function (event) {
  var leadId = event.target.getAttribute('lead-id');
  if (leadId !== null) {
    grid.uneditedLead = grid.leads.find(function(lead) {
      return lead.id.field === leadId;
    });
    var $popupRow = h('div', { class: 'row' });
    createLeadForm(grid.uneditedLead, $popupRow, true);
    updatePopupForm($popupRow, 'edit');
  } else {
    if (event.target.getAttribute('checkbox-id') == 'header') {
      document.querySelectorAll('.table-checkbox').forEach(function (box) {
        box.checked = event.target.checked;
      })
    }
    document.querySelector('#mass-edit-button').disabled = !anyAreChecked();
  }
})

var $leadSaveButton = document.querySelector('#lead-edit-save');
$leadSaveButton.addEventListener('click', function () {
  savePopup();
})

var $leadCreateButton = document.querySelector('#lead-create-button');
$leadCreateButton.addEventListener('click', function () {
  createLead();
})

var $closePU = document.querySelector('.close');
$closePU.addEventListener('click', function() {
  closePopup();
})

var $dropdownMenu = document.querySelector('#filter-properties');
$dropdownMenu.addEventListener('click', function(event) {
  var $dropdownButton = document.querySelector('#dropdown-button');
  var $filterInput = document.querySelector('#filter-input');

  $dropdownButton.textContent = event.target.textContent;
  $dropdownButton.setAttribute('filter-ready', 'true');
  $filterInput.disabled = false;
  $filterInput.setAttribute('placeholder', 'Enter value');
  $applyFilterButton.disabled = false;
})

var $applyFilterButton = document.querySelector('#apply-filter-button');
$applyFilterButton.addEventListener('click', function() {
  var $dropdownButton = document.querySelector('#dropdown-button');
  var $filterInput = document.querySelector('#filter-input');
  var filteredLeads = getFilteredLeads($dropdownButton.textContent,
    $filterInput.value, grid.leads);

  clearChildNodes($leadTable);
  createTable(filteredLeads);
})

var $resetFilterButton = document.querySelector('#filter-reset-button');
$resetFilterButton.addEventListener('click', function () {
  initializeLeadPage();
})

var $fileUpload = document.querySelector('#csv-upload');
$fileUpload.addEventListener('change', function (event) {
  var data = null;
  var file = event.target.files[0];
  var reader = new FileReader();
  var newLeads = [];

  reader.readAsText(file);
  reader.onload = function (loadEvent) {
    var csvData = loadEvent.target.result;

    data = $.csv.toArrays(csvData);
    if (data && data.length > 0) {
      alert('Imported' + ' ' + data.length + ' ' + 'rows.');
      Array.prototype.push.apply(grid.leads, createLeadsFromCSV(data));
      initializeLeadPage();
    }
    reader.onerror = function () {
      alert('Unable to read' + ' ' + file.fileName);
    }
  }
})

var $massEditButton = document.querySelector('#mass-edit-button');
$massEditButton.addEventListener('click', function () {
  grid.checkedLeadIds = [];
  document.querySelectorAll('.table-checkbox').forEach(function (box) {
    if (box.checked && box.getAttribute('checkbox-id') !== 'header'){
      grid.checkedLeadIds.push(box.getAttribute('checkbox-id'));
    }
  })
  var editLeads = getLeadArrayByIds(grid.leads, grid.checkedLeadIds);
  grid.uneditedLead = createMassEditLead(editLeads);
  var $popupRow = h('div', { class: 'row' });
  createLeadForm(grid.uneditedLead, $popupRow, true);
  updatePopupForm($popupRow, 'mass');
})
