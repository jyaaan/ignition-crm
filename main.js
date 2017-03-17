// TEMP

// GLOBAL VARS


// UTILITY FUNCTIONS
var createElementWithClass = function(type, className) {
  var $tempElem = document.createElement(type);

  $tempElem.classList.add(className);
  return $tempElem;
}

var appendArrAsChild = function ($node, arrElements) {
  for (var elem in arrElements) {
    $node.appendChild(arrElements[elem]);
  }
  return $node;
}

var clearChildNodes = function($table) {
  while($table.firstChild) {
    $table.removeChild($table.firstChild);
  }
}

var swapVisibility = function($elemToHide, $elemToShow) {
  $elemToHide.classList.add('hidden');
  $elemToShow.classList.remove('hidden');
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
  console.log(leadId);
  if (leadId !== null) {
    var editLead = leads.find(function(lead) {
      return lead.id.field === leadId;
    });
    var $popupRow = createElementWithClass('div', 'row');
    createLeadForm(editLead, $popupRow, true);
    updatePopupForm($popupRow);
  } else {
    var checkboxId = event.target.getAttribute('checkbox-id');
    if (checkboxId == 'header') {
      document.querySelectorAll('.table-checkbox').forEach(function (box) {
        box.checked = event.target.checked;
      })
    } else {

    }
  }
})

var $leadSaveButton = document.querySelector('#lead-edit-save');
$leadSaveButton.addEventListener('click', function () {
  saveForm();
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
  createTableElements(filteredLeads, $leadTable);
})

var $resetFilterButton = document.querySelector('#filter-reset-button');
$resetFilterButton.addEventListener('click', function () {
  initializeLeadPage();
})

var $fileUpload = document.querySelector('#csv-upload');
$fileUpload.addEventListener('change', function (event) {
  console.log('upload triggered');
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
  // console.log(newLeads);
})

// LEAD TABLE FUNCTIONS
var initializeLeadPage = function() {
  clearChildNodes($leadTable);
  createTableElements(leads, $leadTable);
  resetFilter();
}

var createFormProperties = function (arrTableData, type) {
  var arrRowData = [];

  for (var datum in arrTableData) {
    var tempElem = document.createElement(type);
    tempElem.textContent = datum;
    arrRowData.push(tempElem);
  }
  return arrRowData;
}

var populateFormData = function (arrTableData, type, leadId) {
  var arrRowData = [];

  for (var datum in arrTableData) {
    var tempElem = document.createElement(type);
    tempElem.setAttribute('lead-id', leadId)
    tempElem.textContent = arrTableData[datum].field;
    arrRowData.push(tempElem);
  }
  return arrRowData;
}

var createCheckbox = function(type, leadId) {
  var $type = document.createElement(type);
  var $checkBox = document.createElement('input');
  $checkBox.setAttribute('value', '');
  $checkBox.setAttribute('type', 'checkbox');
  $checkBox.setAttribute('checkbox-id', leadId);
  $checkBox.classList.add('table-checkbox');
  $type.appendChild($checkBox);
  return $type;
}

var createTableElements = function(leads, $table) {
  var $header = document.createElement('tr');

  $header.appendChild(createCheckbox('th', 'header'));
  $header = appendArrAsChild($header, createFormProperties(leads[0], 'th'));

  $table.appendChild($header);

  for (var lead in leads) {
    var $row = document.createElement('tr');
    $row.appendChild(createCheckbox('td'));
    $row.setAttribute('lead-id', leads[lead].id.field);
    $row = appendArrAsChild($row, populateFormData(leads[lead], 'td', leads[lead].id.field));
    $table.appendChild($row);
  }
}

var createLeadForm = function(editLead, $formRow, isEdit = true) {
  for (var prop in editLead) {
    var $arrElems = [];
    var $propertyDiv = createElementWithClass('div', 'col-xs-2');

    $arrElems[0] = createElementWithClass('span', 'input-group');
    $arrElems[0].textContent = prop;
    $arrElems[1] = createElementWithClass('input', 'form-control');
    $arrElems[1].setAttribute('type', 'text');
    $arrElems[1].setAttribute('lead-property', prop);
    $arrElems[1].setAttribute('aria-label', 'lead-' + prop);
    $arrElems[1].classList.add('lead-property-input')
    $arrElems[1].disabled = !editLead[prop].isEditable;

    if (isEdit) {
      $arrElems[1].value = editLead[prop].field;
    }
    $propertyDiv = appendArrAsChild($propertyDiv, $arrElems);
    $formRow.appendChild($propertyDiv);
  }
}

var resetFilter = function() {
  var $dropdownButton = document.querySelector('#dropdown-button');
  var $filterInput = document.querySelector('#filter-input');
  $applyFilterButton.disabled = true;
  $filterInput.value = '';
  $filterInput.disabled = true;
  $dropdownButton.textContent = 'Filter By';
}
// LEAD DATA FUNCTIONS
var saveForm = function() {
  var inputLead = getLeadInputArray();
  var $leadEditPU = document.querySelector('#lead-edit-popup');

  if (checkIfNew(inputLead)) {
    inputLead = assignNewId(inputLead);
    addLead(inputLead);
    initializeLeadPage();
  } else if (checkIfChanged(inputLead)) {
    updateMasterLead(inputLead);
    initializeLeadPage();
  }
  $leadEditPU.style.display = 'none';
}

var createLead = function() {
  var newLead = new lead();
  var $popupRow = createElementWithClass('div', 'row');

  createLeadForm(newLead, $popupRow, false);
  updatePopupForm($popupRow);
}

var getLeadInputArray = function() {
  var $arrLeadInputs = document.querySelectorAll('.lead-property-input');
  var inputLead = new lead();

  $arrLeadInputs.forEach(function (input) {
    inputLead[input.getAttribute('lead-property')].field = input.value;
  })
  return inputLead;
}

var updateMasterLead = function(inputLead) {
  leads[getMasterLeadIndexById(inputLead)] = inputLead;
}

var checkIfChanged = function(inputLead) {
  var masterLead = getMasterLeadById(inputLead);

  for (var prop in masterLead) {
    if (masterLead[prop].field !== inputLead[prop].field) {
      return true;
    }
  }
  return false;
}

var checkIfNew = function(inputLead) {
  if (inputLead.id.field === '') {
    return true;
  }
  return false;
}

var assignNewId = function(lead) {
  lead.id.field = Math.random().toString(32).substr(2, 9);
  return lead;
}

var addLead = function(lead) {
  leads.push(lead);
}

var getMasterLeadById = function (inputLead) {
  return leads.find(function (lead) {
    return lead.id.field === inputLead.id.field;
  })
}

var getMasterLeadIndexById = function (inputLead) {
  return leads.findIndex(function (lead) {
    return lead.id.field === inputLead.id.field;
  })
}

var getFilteredLeads = function(filterProperty, filterValue, masterLeads) {
  var filteredLeads = [];

  masterLeads.forEach(function (lead) {
    if (lead[filterProperty].field == filterValue) {
      filteredLeads.push(lead);
    }
  })
  return filteredLeads;
}

// Header row contains property names for each
var createLeadsFromCSV = function(csvData) {
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

// POPUP FUNCTIONS
var updatePopupForm = function($form) {
  var $leadPopupDetail = document.querySelector('.lead-edit-details');
  var $leadEditPU = document.querySelector('#lead-edit-popup');

  clearChildNodes($leadPopupDetail);
  $leadPopupDetail.appendChild($form);
  $leadEditPU.style.display = 'inline-block';
}

var closePopup = function() {
  var inputLead = getLeadInputArray();
  var $leadEditPU = document.querySelector('#lead-edit-popup');

  if (checkIfChanged(inputLead)) {
    var answer = confirm('Save your changes?');
    if (answer) {
      updateMasterLead(inputLead);
      initializeLeadPage();
    }
  }
  $leadEditPU.style.display = 'none';
}
// Lead Object and Data
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

// On run
tempInitializeLeads();
