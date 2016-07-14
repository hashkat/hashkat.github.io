// Creating angular app and inject ngAnimate and ui-router 
// =============================================================================
angular.module('formApp', ['ngAnimate', 'ui.router', 'ngFileSaver'])

// Configuring our routes 
// =============================================================================
.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider

    // route to show our basic form (/form)
        .state('form', {
        url: '/form',
        templateUrl: 'forms/form.html',
        controller: 'formController'
    })

    // nested states 
    // each of these sections will have their own view
    // url will be nested (/form/profile)
    .state('form.profile', {
        url: '/profile',
        templateUrl: 'forms/form-profile.html'
    })

    .state('form.ques-maxTime', {
        url: '/ques-maxTime',
        templateUrl: 'forms/ques-maxTime.html'
    })

    .state('form.ques-sizeOfNetwork', {
        url: '/ques-sizeOfNetwork',
        templateUrl: 'forms/ques-sizeOfNetwork.html'
    })

    .state('form.ques-regionOfAgents', {
        url: '/ques-regionOfAgents',
        templateUrl: 'forms/ques-regionOfAgents.html'
    })

    .state('form.ques-languageOfAgents', {
        url: '/ques-languageOfAgents',
        templateUrl: 'forms/ques-languageOfAgents.html'
    })

    .state('form.ques-agentTastes', {
        url: '/ques-agentTastes',
        templateUrl: 'forms/ques-agentTastes.html'
    })

    .state('form.ques-celebrityAgents', {
        url: '/ques-celebrityAgents',
        templateUrl: 'forms/ques-celebrityAgents.html'
    })

    .state('form.ques-companyAgents', {
        url: '/ques-companyAgents',
        templateUrl: 'forms/ques-companyAgents.html'
    })

    .state('form.ques-politicalAgents', {
        url: '/ques-politicalAgents',
        templateUrl: 'forms/ques-politicalAgents.html'
    })

    .state('form.ques-humorousAgents', {
        url: '/ques-humorousAgents',
        templateUrl: 'forms/ques-humorousAgents.html'
    })

    .state('form.ques-govtAgents', {
        url: '/ques-govtAgents',
        templateUrl: 'forms/ques-govtAgents.html'
    })

    .state('form.ques-botAgents', {
        url: '/ques-botAgents',
        templateUrl: 'forms/ques-botAgents.html'
    })

    .state('form.formSubmission', {
        url: '/formSubmission',
        templateUrl: 'forms/formSubmission.html'
    })



    .state('form.ques-rates', {
        url: '/ques-rates',
        templateUrl: 'forms/ques-rates.html'
    })

    // Catch all route
    // Send users to the form page 
    $urlRouterProvider.otherwise('/form/profile');
})

// Form Controller
// =============================================================================
.controller('formController', ['FileSaver', 'Blob', '$scope', function(FileSaver, Blob, $scope) {

    // Storing form data in this object
    $scope.formData =   $scope.formData ||
    {
        "name": null,
        "email": null,
        "maxTime": null,
        "sizeOfNetwork": null,
        "botAgents": null,
        "celebrityAgents": null,
        "companyAgents": null,
        "govtAgents": null,
        "humorousAgents": null,
        "sameAgentLanguage": null,
        "politicalAgents": null,
        "sameAgentRegion": null,
        "agentTastes": null
    };

    // Function to process the form
    $scope.processForm = function() {
        alert('Awesome!');
        var data = new Blob([angular.toJson($scope.formData)], { type: 'text/plain;charset=utf-8' });
        FileSaver.saveAs(data, 'formData.json');

    };

}]);