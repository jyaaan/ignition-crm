/// GRID OBJECT SANDBOX

// is there room for improvement in these properties?
var grid = {
  title: 'Leads',
  selectAll: true,
  columns: arrColumnHeaders,
  filterBy: null,
  inputLead: new lead(),
  leads: [
    new lead('alex', 'timmons', 'king leonidas', 'demo', 'aaa1'),
    new lead('chris', 'hobbs', 'fake doors', 'negotiations', 'aaa2'),
    new lead('john', 'yamashiro', 'eatify basics', 'icebox', 'aaa3')
  ]
}

// In production, this would be a setting to be retrieved
var arrColumnHeaders = ['firstName', 'lastName', 'brand', 'stage', 'id'];

// updated element creator for use before React
// can call function as h(tagName, attributes, children)
var h = createElement;
function createElement(tagName, attributes, children) {
  var $element = document.createElement(tagName);

  // this loop is very useful in setting multiple attributes at once
  for (var prop in attributes) {
    $element.setAttribute(prop, attributes[prop]);
  }

  // returns empty element if no children are specified. flexible!
  if (!children) return $element;

  //checks to see if each child is a node. if not, sets element text to child
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
// GLOBAL VARS
var checkedLeadIds = [];
var massLead = new lead();

function lead(fname, lname, bname, stage, id) {
  this.firstName = { field: fname, isEditable: true };
  this.lastName = { field: lname, isEditable: true };
  this.brand = { field: bname, isEditable: true };
  this.stage = { field: stage, isEditable: true };
  this.id = { field: id, isEditable: false };
};

var leads = [];

function tempInitializeLeads() {
  leads.push(new lead('alex', 'timmons', 'king leonidas', 'demo', 'aaa1'));
  leads.push(new lead('chris', 'hobbs', 'fake doors', 'negotiations', 'aaa2'));
  leads.push(new lead('john', 'yamashiro', 'eatify basics', 'icebox', 'aaa3'));
}

// UTILITY FUNCTIONS

// MAKE OBSOLETE
function createElementWithClass(type, className) {
  var $tempElem = document.createElement(type);

  $tempElem.classList.add(className);
  return $tempElem;
}

// MAKE OBSOLETE
function appendArrAsChild($node, arrElements) {
  for (var elem in arrElements) {
    $node.appendChild(arrElements[elem]);
  }
  return $node;
}

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
  createTable(leads);
  resetFilter();
}

// OBSOLETE
// function createFormProperties(arrTableData, type) {
//   var arrRowData = [];
//
//   for (var datum in arrTableData) {
//     var tempElem = document.createElement(type);
//     tempElem.textContent = datum;
//     arrRowData.push(tempElem);
//   }
//   return arrRowData;
// }

// OBSOLETE
// function populateFormData(arrTableData, type, leadId) {
//   var arrRowData = [];
//
//   for (var datum in arrTableData) {
//     var tempElem = document.createElement(type);
//     tempElem.setAttribute('lead-id', leadId)
//     tempElem.textContent = arrTableData[datum].field;
//     arrRowData.push(tempElem);
//   }
//   return arrRowData;
// }

// OBSOLETE
// function createCheckbox(type, leadId) {
//   var $type = document.createElement(type);
//   var $checkBox = document.createElement('input');
//   $checkBox.checked = false;
//   $checkBox.setAttribute('type', 'checkbox');
//   $checkBox.setAttribute('checkbox-id', leadId);
//   $checkBox.classList.add('table-checkbox');
//   $type.appendChild($checkBox);
//   return $type;
// }

// OBSOLETE
// function createTableElements(leads, $table) {
//   var $header = document.createElement('tr');
//
//   $header.appendChild(createCheckbox('th', 'header'));
//   $header = appendArrAsChild($header, createFormProperties(leads[0], 'th'));
//
//   $table.appendChild($header);
//
//   for (var lead in leads) {
//     var $row = document.createElement('tr');
//     $row.appendChild(createCheckbox('td', leads[lead].id.field));
//     $row.setAttribute('lead-id', leads[lead].id.field);
//     $row = appendArrAsChild($row, populateFormData(leads[lead], 'td', leads[lead].id.field));
//     $table.appendChild($row);
//   }
// }

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
    var $propertyDiv = createElementWithClass('div', 'col-xs-2');

    var $propertyDiv = h('div', { class: 'col-xs-2'}, [
      h('span', { class: 'input-group' }, [prop]),
      h('input', { class: 'form-control lead-property-input', type: 'text',
        'lead-property': prop, disabled: !editLead[prop].isEditable.toString(),
        value: editLead[prop].field })
    ])
    console.log(prop + ':' + ' ' + (!editLead[prop].isEditable).toString());

    // $arrElems[0] = createElementWithClass('span', 'input-group');
    // $arrElems[0].textContent = prop;
    // $arrElems[1] = createElementWithClass('input', 'form-control');
    // $arrElems[1].setAttribute('type', 'text');
    // $arrElems[1].setAttribute('lead-property', prop);
    // $arrElems[1].setAttribute('aria-label', 'lead-' + prop);
    // $arrElems[1].classList.add('lead-property-input')
    // $arrElems[1].disabled = !editLead[prop].isEditable;
    //
    // if (isEdit) {
    //   $arrElems[1].value = editLead[prop].field;
    // }
    // $propertyDiv = appendArrAsChild($propertyDiv, $arrElems);
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
  var masterLead = new lead();

  switch ($leadEditPU.getAttribute('popup-type', 'mass')) {
    case 'mass':
      masterLead = massLead;
      break;
    case 'new':
      break;
    case 'edit':
      masterLead = getMasterLeadById(leads, inputLead.id.field);
  }
  if (checkIfChanged(inputLead, masterLead)) {
    if (confirm('Save your changes?')) {
      savePopupData(inputLead, masterLead);
      initializeLeadPage();
    }
  }
  $leadEditPU.style.display = 'none';
}

function savePopup() {
  var inputLead = getLeadInputArray();
  var $leadEditPU = document.querySelector('#lead-edit-popup');
  var masterLead = new lead();

  if ($leadEditPU.getAttribute('popup-type', 'mass')) {
    masterLead = massLead;
    } else {
    masterLead = getMasterLeadById(leads, inputLead.id.field);
  }

  savePopupData(inputLead, masterLead);
  initializeLeadPage();
  $leadEditPU.style.display = 'none';
}

function savePopupData(inputLead, masterLead) {
  var $leadEditPU = document.querySelector('#lead-edit-popup');
  if (checkIfNew(inputLead)) {
    inputLead = assignNewId(inputLead);
    addLead(inputLead);
  } else if (checkIfChanged(inputLead, masterLead)) {
    if ($leadEditPU.getAttribute('popup-type', 'mass') === 'mass') {
      updateMassLeads(checkedLeadIds, inputLead, leads, masterLead);
    } else {
      updateMasterLead(inputLead, leads);
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
  var newLead = new lead();
  var $popupRow = createElementWithClass('div', 'row');

  createLeadForm(newLead, $popupRow, false);
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
  leads.push(lead);
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
    var editLead = leads.find(function(lead) {
      return lead.id.field === leadId;
    });
    var $popupRow = createElementWithClass('div', 'row');
    createLeadForm(editLead, $popupRow, true);
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
    $filterInput.value, leads);

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
      Array.prototype.push.apply(leads, createLeadsFromCSV(data));
      initializeLeadPage();
    }
    reader.onerror = function () {
      alert('Unable to read' + ' ' + file.fileName);
    }
  }
})

var $massEditButton = document.querySelector('#mass-edit-button');
$massEditButton.addEventListener('click', function () {
  checkedLeadIds = [];
  document.querySelectorAll('.table-checkbox').forEach(function (box) {
    if (box.checked && box.getAttribute('checkbox-id') !== 'header'){
      checkedLeadIds.push(box.getAttribute('checkbox-id'));
    }
  })
  var editLeads = getLeadArrayByIds(leads, checkedLeadIds);
  massLead = createMassEditLead(editLeads);
  var $popupRow = createElementWithClass('div', 'row');
  createLeadForm(massLead, $popupRow, true);
  updatePopupForm($popupRow, 'mass');
})

// On run
tempInitializeLeads();
