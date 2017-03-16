// TEMP VARIABLES


// ELEMENT VARS
var $leadButton = document.querySelector('#lead-button');
var $homeButton = document.querySelector('#home-button');
var $leadTable = document.querySelector('#lead-table');
var $leadSaveButton = document.querySelector('#lead-edit-save');

var $leadEditPU = document.querySelector('#lead-edit-popup');
var $closePU = document.querySelector('.close');

var $landingPageDashboard = document.querySelector('#landing-page-dashboard');
var $landingPageDetails = document.querySelector('#landing-page-details');
var $leadDashboard = document.querySelector('#lead-page-dashboard');
var $leadDetails = document.querySelector('#lead-details');

// FUNCTIONS
var createElementPropertyArrayFromArray = function (arrTableData, type) {
  var arrRowData = [];
  for (var datum in arrTableData) {
    var tempElem = document.createElement(type);
    tempElem.textContent = datum;
    arrRowData.push(tempElem);
  }
  return arrRowData;
}

var createElemValArrayLeadId = function (arrTableData, type, leadId) {
  var arrRowData = [];
  for (var datum in arrTableData) {
    var tempElem = document.createElement(type);
    tempElem.setAttribute('lead-id', leadId)
    tempElem.textContent = arrTableData[datum].field;
    arrRowData.push(tempElem);
  }
  return arrRowData;
}

var createTableElements = function(leads, $table) {
  var $header = document.createElement('tr');
  $header = appendArrAsChild($header, createElementPropertyArrayFromArray(leads[0], 'th'));
  $table.appendChild($header);
  for (var lead in leads) {
    var $row = document.createElement('tr');
    $row.setAttribute('lead-id', leads[lead].id.field);
    $row = appendArrAsChild($row, createElemValArrayLeadId(leads[lead], 'td', leads[lead].id.field));
    $table.appendChild($row);
  }
}

var appendArrAsChild = function ($node, arrElements) {
  for (var elem in arrElements) {
    $node.appendChild(arrElements[elem]);
  }
  return $node;
}

// DOM FUNCTIONS
var swapVisibility = function($elemToHide, $elemToShow) {
  $elemToHide.classList.add('hidden');
  $elemToShow.classList.remove('hidden');
}

var clearChildNodes = function($table) {
  while($table.firstChild) {
    $table.removeChild($table.firstChild);
  }
}

var initializeLeadPage = function() {
  clearChildNodes($leadTable);
  createTableElements(leads, $leadTable);
}

var createElementWithClass = function(type, className) {
  var $tempElem = document.createElement(type);
  $tempElem.classList.add(className);
  return $tempElem;
}

// UI INTERACTION
$leadButton.addEventListener('click',function () {
  swapVisibility($landingPageDetails, $leadDetails);
  swapVisibility($landingPageDashboard, $leadDashboard);
  initializeLeadPage();
})

$homeButton.addEventListener('click', function () {
  swapVisibility($leadDetails, $landingPageDetails);
  swapVisibility($leadDashboard, $landingPageDashboard);
})

$leadTable.addEventListener('click', function (event) {
  var leadId = event.target.getAttribute('lead-id');
  if (typeof leadId !== undefined) {
    var editLead = leads.find(function(lead) {
      return lead.id.field === leadId;
    });
    var $popupRow = createElementWithClass('div', 'row');
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
      $arrElems[1].value = editLead[prop].field;
      $arrElems[1].disabled = !editLead[prop].isEditable;
      $propertyDiv = appendArrAsChild($propertyDiv, $arrElems);
      $popupRow.appendChild($propertyDiv);
    }
    var $leadPopupDetail = document.querySelector('.lead-edit-details');
    clearChildNodes($leadPopupDetail);
    $leadPopupDetail.appendChild($popupRow);
    $leadEditPU.style.display = 'inline-block';
  }
})

$leadSaveButton.addEventListener('click', function (event) {
  var inputLead = getLeadInputArray();
  if (checkIfChanged(inputLead)) {
    updateMasterLead(inputLead);
    initializeLeadPage();
  }
  $leadEditPU.style.display = 'none';
})

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

// POPUP FUNCTIONS
$closePU.onclick = function () {
  var inputLead = getLeadInputArray();
  if (checkIfChanged(inputLead)) {
    var answer = confirm('Save your changes?');
    if (answer) {
      updateMasterLead(inputLead);
      initializeLeadPage();
    }
  }
  $leadEditPU.style.display = 'none';
}

function initializeLeadPopup($element) {
  clearChildNodes($element);
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
