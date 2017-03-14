// TEMP VARIABLES

// ELEMENT VARS
var $leadButton = document.querySelector('#lead-button');
var $homeButton = document.querySelector('#home-button');
var $leadTable = document.querySelector('#lead-table');

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
};

var createElementValueArrayFromArray = function (arrTableData, type) {
  var arrRowData = [];
  for (var datum in arrTableData) {
    var tempElem = document.createElement(type);
    tempElem.textContent = arrTableData[datum];
    arrRowData.push(tempElem);
  }
  return arrRowData;
};

var createTableElements = function(leads, $table) {
  var $header = document.createElement('th');
  $header = appendArrAsChild($header, createElementPropertyArrayFromArray(leads[0], 'td'));
  $table.appendChild($header);
  for (var lead in leads) {
    var $row = document.createElement('tr');
    $row = appendArrAsChild($row, createElementValueArrayFromArray(leads[lead], 'td'));
    $table.appendChild($row);
  };
};

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
};

var clearChildNodes = function($table) {
  while($table.firstChild) {
    $table.removeChild($table.firstChild);
  }
};

var initializeLeadPage = function() {

};

// UI INTERACTION
$leadButton.addEventListener('click',function() {
  swapVisibility($landingPageDetails, $leadDetails);
  swapVisibility($landingPageDashboard, $leadDashboard);
  initializeLeadPage();
});

$homeButton.addEventListener('click', function() {
  swapVisibility($leadDetails, $landingPageDetails);
  swapVisibility($leadDashboard, $landingPageDashboard);
});

// Lead Object and Data
function lead(fname, lname, bname, stage) {
  this.firstName = fname;
  this.lastName = lname;
  this.brand = bname;
  this.stage = stage;
};

var leads = [];

function tempInitializeLeads() {
  leads.push(new lead('alex', 'timmons', 'king leonidas', 'demo'));
  leads.push(new lead('chris', 'hobbs', 'flyking', 'negotiations'));
};

// CHART SCRIPT & DATA
$(document).ready(function() {
  var title = {
    text: "Monthly Cohort Performance"
  };
  var subtitle = {
  text: "Eatify"
  };
  var xAxis = {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  };
  var yAxis = {
    title: {
      text: "Engagement"
    },
    plotLines: [{
      value: 0,
      width: 1,
      color: '#808080'
    }]
  };
  var tooltip = {
  valueSuffix: '\xB0C'
  }
  var legend = {
  layout: 'vertical',
  align: 'right',
  verticalAlign: 'middle',
  borderWidth: 0
  };
  var series =  [
  {
     name: "2016Nov",
     data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2,
        26.5, 23.3, 18.3, 13.9, 9.6]
  },
  {
     name: '2016Dec',
     data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8,
        24.1, 20.1, 14.1, 8.6, 2.5]
  },
  {
     name: '2017Jan',
     data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6,
        17.9, 14.3, 9.0, 3.9, 1.0]
  },
  {
     name: "2017Feb",
     data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0,
        16.6, 14.2, 10.3, 6.6, 4.8]
  }
  ];
  var json = {};
  json.title = title;
  json.subtitle = subtitle;
  json.xAxis = xAxis;
  json.yAxis = yAxis;
  json.tooltip = tooltip;
  json.legend = legend;
  json.series = series;
  $('.cohort-chart').highcharts(json);
  });
  $(document).ready(function() {
  var title = {
  text: "Customer Acquisition Cost"
  };
  var subtitle = {
  text: "Eatify"
  };
  var xAxis = {
  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  };
  var yAxis = {
  title: {
     text: "Cost ($)"
  },
  plotLines: [{
     value: 0,
     width: 1,
     color: '#808080'
  }]
  };
  var tooltip = {
  valueSuffix: '\xB0C'
  }
  var legend = {
  layout: 'vertical',
  align: 'right',
  verticalAlign: 'middle',
  borderWidth: 0
  };
  var series =  [
  {
     name: "2016Nov",
     data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2,
        26.5, 23.3, 18.3, 13.9, 9.6]
  },
  {
     name: '2016Dec',
     data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8,
        24.1, 20.1, 14.1, 8.6, 2.5]
  },
  {
     name: '2017Jan',
     data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6,
        17.9, 14.3, 9.0, 3.9, 1.0]
  },
  {
     name: "2017Feb",
     data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0,
        16.6, 14.2, 10.3, 6.6, 4.8]
  }
  ];
  var json = {};
  json.title = title;
  json.subtitle = subtitle;
  json.xAxis = xAxis;
  json.yAxis = yAxis;
  json.tooltip = tooltip;
  json.legend = legend;
  json.series = series;
  $('.cac-chart').highcharts(json);
  });
  $(document).ready(function() {
  var title = {
  text: "Monthly Recurring Revenue"
  };
  var subtitle = {
  text: "Eatify"
  };
  var xAxis = {
  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  };
  var yAxis = {
  title: {
     text: "10K Dollars ($)"
  },
  plotLines: [{
     value: 0,
     width: 1,
     color: '#808080'
  }]
  };
  var tooltip = {
  valueSuffix: '\xB0C'
  }
  var legend = {
  layout: 'vertical',
  align: 'right',
  verticalAlign: 'middle',
  borderWidth: 0
  };
  var series =  [
  {
     name: "2016Nov",
     data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2,
        26.5, 23.3, 18.3, 13.9, 9.6]
  },
  {
     name: '2016Dec',
     data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8,
        24.1, 20.1, 14.1, 8.6, 2.5]
  },
  {
     name: '2017Jan',
     data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6,
        17.9, 14.3, 9.0, 3.9, 1.0]
  },
  {
     name: "2017Feb",
     data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0,
        16.6, 14.2, 10.3, 6.6, 4.8]
  }
  ];
  var json = {};
  json.title = title;
  json.subtitle = subtitle;
  json.xAxis = xAxis;
  json.yAxis = yAxis;
  json.tooltip = tooltip;
  json.legend = legend;
  json.series = series;
  $('.mrr-chart').highcharts(json);
  });

// On run
tempInitializeLeads();
