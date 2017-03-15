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

var $puLeadFirstName = document.querySelector('#lead-first-name');
var $puLeadLastName = document.querySelector('#lead-last-name');
var $puLeadBrandName = document.querySelector('#lead-brand-name');
var $puLeadId = document.querySelector('#lead-id');
var $puLeadStage = document.querySelector('#lead-stage');

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
    tempElem.textContent = arrTableData[datum];
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
    $row.setAttribute('lead-id', leads[lead].id);
    $row = appendArrAsChild($row, createElemValArrayLeadId(leads[lead], 'td', leads[lead].id));
    $table.appendChild($row);
  }
}

var appendArrAsChild = function ($node, arrElements) {
  for (var elem in arrElements) {
    console.log(arrElements[elem]);
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
  $leadTable = createTableElements(leads, $leadTable);
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
    editLead = leads.find(function(lead) {
      return lead.id === leadId;
    });
    // define an array outside of this function to hold dom elements
    // generate dom elements whenever this function is called using for each
    // save references to these elements for use when saving and closing
    // modal edit window.
    $puLeadFirstName.value = editLead.firstName;
    $puLeadLastName.value = editLead.lastName;
    $puLeadBrandName.value = editLead.brand;
    $puLeadStage.value = editLead.stage;
    $puLeadId.value = editLead.id;
    $leadEditPU.style.display = 'inline-block';
  }
})

$leadSaveButton.addEventListener('click', function (event) {
  // need to dynamically crate dom objects in leadTable event
  // create array which maps dom elements to lead object properties so that
  // iterating through will be more efficient and scalable to as many
  // properties as needed.
})

// POPUP FUNCTIONS
$closePU.onclick = function () {
  $leadEditPU.style.display = 'none';
}

// Lead Object and Data
function lead(fname, lname, bname, stage, id) {
  this.firstName = fname;
  this.lastName = lname;
  this.brand = bname;
  this.stage = stage;
  this.id = id;
};

var leads = [];
var editLead = new lead();

function tempInitializeLeads() {
  leads.push(new lead('alex', 'timmons', 'king leonidas', 'demo', 'aaa1'));
  leads.push(new lead('chris', 'hobbs', 'fake doors', 'negotiations', 'aaa2'));
  leads.push(new lead('john', 'yamashiro', 'eatify basics', 'icebox', 'aaa3'));
}

// On run
tempInitializeLeads();
