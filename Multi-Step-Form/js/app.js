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
        var hashkatInfileYamlContents = formDataToHashkatInfile($scope.formData);
        var data = new Blob([hashkatInfileYamlContents], { type: 'text/plain;charset=utf-8' });
        FileSaver.saveAs(data, 'INFILE.yaml');
    };

}]);

// Converts the form data from user querying into the INFILE.yaml format used by hashkat. 
// 'Reasonable' values are provided here where the form data configuration is underspecified.
// =============================================================================
function formDataToHashkatInfile(formData) {
    // Extract all components from the form data object.
    var maxTime           = formData.maxTime;
    // Convert 'maxTime' to a valid time
    if (maxTime === "Unlimited time") {
        maxTime = "unlimited"; 
    } else {
        // Minutes is implied; remove it from the time string.
        maxTime = maxTime.replace(' minutes', '');
    }
    var sizeOfNetwork     = formData.sizeOfNetwork;
    var botAgents         = (formData.botAgents === "Yes");
    var celebrityAgents   = (formData.celebrityAgents === "Yes");
    var companyAgents     = (formData.companyAgents === "Yes");
    var govtAgents        = (formData.govtAgents === "Yes");
    var humorousAgents    = (formData.humorousAgents === "Yes");
    var sameAgentLanguage = (formData.sameAgentLanguage === "Yes");
    var politicalAgents   = (formData.politicalAgents === "Yes");
    var sameAgentRegion   = (formData.sameAgentRegion === "Yes");
    var agentTastes       = (formData.agentTastes === "Yes");

    // Conditionally include a section:
    function enableIf(condition, component) {
        if (condition) {
            return component;
        } else {
            return '';
        }
    }

    // Template components:
    var analysisTemplate = "\nanalysis:\n" + 
        "  initial_agents:\n" + 
        "    0\n" + 
        "  max_agents:\n" + 
        "    " + sizeOfNetwork + "\n" + 
        "  max_time: \n" + 
        "    unlimited\n" + 
        "  max_real_time: \n" + 
        "    " + maxTime + "\n" + 
        "  use_followback: \n" + 
        "    true\n" + 
        "  use_follow_via_retweets:\n" + 
        "    false\n" + 
        "  follow_model: \n" + 
        "    random\n" + 
        "  use_hashtag_probability:\n" + 
        "    0.2\n" + 
        "rates:\n" + 
        "  add: {function: constant, value: 0.2}\n" + 
        "ideologies:\n" + 
        "  - name: Red\n" + 
        "  - name: Blue\n" + 
        "  - name: Green\n" + 
        "  - name: Orange\n";
    var preferenceClassWeights = "{StandardPref: 100}";
    if (agentTastes === 'Yes') {
        preferenceClassWeights = "{StandardPref: 100, LikesPolitical: 100, LikesHumour: 100}";
    }
    var regionsTemplate = null;
    if (sameAgentLanguage === 'Yes' && sameAgentRegion === 'Yes') {
        regionsTemplate = 
            "regions:\n" + 
            "  - name: World\n" + 
            "    add_weight: 100\n" + 
            "    preference_class_weights: " + preferenceClassWeights + " \n" + 
            "    ideology_weights: {Red: 100, Blue: 100, Green: 100, Orange: 100}\n" + 
            "    language_weights: {English: 100, French+English: 0, French: 0, Spanish: 0}\n";
    }
    else if (sameAgentLanguage === 'No' && sameAgentRegion === 'Yes') {
        regionsTemplate = 
            "regions:\n" + 
            "  - name: World\n" + 
            "    add_weight: 100\n" + 
            "    preference_class_weights: " + preferenceClassWeights + " \n" + 
            "    ideology_weights: {Red: 100, Blue: 100, Green: 100, Orange: 100}\n" + 
            "    language_weights: {English: 100, French+English: 100, French: 100, Spanish: 0}\n";
    }
    else if (sameAgentLanguage === 'Yes' && sameAgentRegion === 'No') {
        regionsTemplate =
            "regions:\n" + 
            "  - name: England\n" + 
            "    add_weight: 100\n" + 
            "\n" + 
            "    preference_class_weights: " + preferenceClassWeights + " \n" + 
            "    ideology_weights: {Red: 100, Blue: 100, Green: 100, Orange: 100}\n" + 
            "    language_weights: {English: 100, French+English: 0, French: 0, Spanish: 0}\n" + 
            "  - name: USA\n" + 
            "    add_weight: 100\n" + 
            "\n" + 
            "    preference_class_weights: " + preferenceClassWeights + " \n" + 
            "    ideology_weights: {Red: 100, Blue: 100, Green: 100, Orange: 100}\n" + 
            "    language_weights: {English: 100, French+English: 0, French: 0, Spanish: 0}\n";
    }
    else {
        regionsTemplate = 
            "regions:\n" + 
            "  - name: Canada\n" + 
            "    add_weight: 100\n" + 
            "\n" + 
            "    preference_class_weights: " + preferenceClassWeights + " \n" + 
            "    ideology_weights: {Red: 100, Blue: 100, Green: 100, Orange: 100}\n" + 
            "    language_weights: {English: 100, French+English: 100, French: 100, Spanish: 0}\n" + 
            "  - name: USA\n" + 
            "    add_weight: 100\n" + 
            "\n" + 
            "    preference_class_weights: " + preferenceClassWeights + " \n" + 
            "    ideology_weights: {Red: 100, Blue: 100, Green: 100, Orange: 100}\n" + 
            "    language_weights: {English: 100, French+English: 0, French: 0, Spanish: 0}\n";
    }
    var preferenceClassTemplate = "\npreference_classes:\n" + 
        " - name: StandardPref\n" + 
        "   tweet_transmission: \n" + 
        "      plain: # Also applies to musical tweets\n" + 
        "        Standard: 0.01\n" + 
        "        Celebrity: 0.05\n" + 
        "        else: 0.01\n" + 
        "      different_ideology: \n" + 
        "        Standard: 0.001\n" + 
        "        Celebrity: 0.01\n" + 
        "        else: 0.00\n" + 
        "      same_ideology:\n" + 
        "        Standard: 0.02\n" + 
        "        Celebrity: 0.06\n" + 
        "        else: 0.01\n" + 
        "      humorous:\n" + 
        "        Standard: 0.08\n" + 
        "        Celebrity: 0.06\n" + 
        "        else: 0.02\n" + 
          enableIf(!agentTastes,
            " - name: LikesPolitical\n" + 
            "   tweet_transmission: \n" + 
            "      plain: # Also applies to musical tweets\n" + 
            "        Standard: 0.01\n" + 
            "        Celebrity: 0.05\n" + 
            "        else: 0.01\n" + 
            "      different_ideology: \n" + 
            "        Standard: 0.001\n" + 
            "        Celebrity: 0.01\n" + 
            "        else: 0.00\n" + 
            "      same_ideology:\n" + 
            "        Standard: 0.04\n" + 
            "        Celebrity: 0.12\n" + 
            "        else: 0.02\n" + 
            "      humorous:\n" + 
            "        Standard: 0.08\n" + 
            "        Celebrity: 0.06\n" + 
            "        else: 0.02\n" + 
            " - name: LikesHumour\n" + 
            "   tweet_transmission: \n" + 
            "      plain: # Also applies to musical tweets\n" + 
            "        Standard: 0.01\n" + 
            "        Celebrity: 0.05\n" + 
            "        else: 0.01\n" + 
            "      different_ideology: \n" + 
            "        Standard: 0.001\n" + 
            "        Celebrity: 0.01\n" + 
            "        else: 0.00\n" + 
            "      same_ideology:\n" + 
            "        Standard: 0.02\n" + 
            "        Celebrity: 0.06\n" + 
            "        else: 0.01\n" + 
            "      humorous:\n" + 
            "        Standard: 0.16\n" + 
            "        Celebrity: 0.12\n" + 
            "        else: 0.04\n");
    var agentsTemplate = 
        "agents:\n" + 
        "  # All auto-generated YAML networks have standard users\n" + 
        "  - name: Standard\n" + 
        "    weights:\n" + 
        "      # Weight with which this agent is created\n" + 
        "      add: 100.0\n" + 
        "      # Weight with which this agent is followed in agent follow\n" + 
        "      follow: 15\n" + 
        "      tweet_type:\n" + 
        "        ideological: 0.0\n" + 
        "        plain: 1.0\n" + 
        "        musical: 1.0\n" + 
        "        humorous: 0.0\n" + 
        "    # Probability that following this agent results in a follow-back\n" + 
        "    followback_probability: .44\n" + 
        "    hashtag_follow_options:\n" + 
        "      care_about_region: true # does the agent care about where the agent they will follow is from?\n" + 
        "      care_about_ideology: false # does the agent care about the ideology of the agent they will follow?\n" + 
        "    rates: \n" + 
        "        # Rate for follows from this agent:\n" + 
        "        follow: {function: constant, value: 0.001}\n" + 
        "        # Rate for tweets from this agent:\n" + 
        "        tweet: {function: constant, value: 0.001}\n" + 
        "    susceptibility: 0\n" +
          enableIf(humorousAgents, "\n" + 
            "  - name: Humorous\n" + 
            "    weights:\n" + 
            "      # Weight with which this agent is created\n" + 
            "      add: 100.0\n" + 
            "      # Weight with which this agent is followed in agent follow\n" + 
            "      follow: 15\n" + 
            "      tweet_type:\n" + 
            "        ideological: 0.0\n" + 
            "        plain: 0.0\n" + 
            "        musical: 0.0\n" + 
            "        humorous: 1.0\n" + 
            "    # Probability that following this agent results in a follow-back\n" + 
            "    followback_probability: .44\n" + 
            "    hashtag_follow_options:\n" + 
            "      care_about_region: true # does the agent care about where the agent they will follow is from?\n" + 
            "      care_about_ideology: false # does the agent care about the ideology of the agent they will follow?\n" + 
            "    rates: \n" + 
            "        # Rate for follows from this agent:\n" + 
            "        follow: {function: constant, value: 0.001}\n" + 
            "        # Rate for tweets from this agent:\n" + 
            "        tweet: {function: constant, value: 0.001}\n") + 
            "    susceptibility: 0\n" +
          enableIf(politicalAgents, "\n" + 
            "  - name: Political\n" + 
            "    weights:\n" + 
            "      # Weight with which this agent is created\n" + 
            "      add: 100.0\n" + 
            "      # Weight with which this agent is followed in agent follow\n" + 
            "      follow: 60\n" + 
            "      tweet_type:\n" + 
            "        ideological: 1.0\n" + 
            "        plain: 0.0\n" + 
            "        musical: 0.0\n" + 
            "        humorous: 0.0\n" + 
            "    # Probability that following this agent results in a follow-back\n" + 
            "    followback_probability: .44\n" + 
            "    hashtag_follow_options:\n" + 
            "      care_about_region: true # does the agent care about where the agent they will follow is from?\n" + 
            "      care_about_ideology: false # does the agent care about the ideology of the agent they will follow?\n" + 
            "    rates:\n" + 
            "        # Rate for follows from this agent:\n" + 
            "        follow: {function: constant, value: 0.00001}\n" + 
            "        # Rate for tweets from this agent:\n" + 
            "        tweet: {function: constant, value: 0.001}\n") + 
            "    susceptibility: 0\n" +
          enableIf(celebrityAgents, "\n" + 
            "  - name: Celebrity\n" + 
            "    weights:\n" + 
            "      # Weight with which this agent is created\n" + 
            "      add: 100.0\n" + 
            "      # Weight with which this agent is followed in agent follow\n" + 
            "      follow: 60\n" + 
            "      tweet_type:\n" + 
            "        ideological: 1.0\n" + 
            "        plain: 1.0\n" + 
            "        musical: 1.0\n" + 
            "        humorous: 1.0\n" + 
            "    # Probability that following this agent results in a follow-back\n" + 
            "    followback_probability: .44\n" + 
            "    hashtag_follow_options:\n" + 
            "      care_about_region: true # does the agent care about where the agent they will follow is from?\n" + 
            "      care_about_ideology: false # does the agent care about the ideology of the agent they will follow?\n" + 
            "    rates:\n" + 
            "        # Rate for follows from this agent:\n" + 
            "        follow: {function: constant, value: 0.00001}\n" + 
            "        # Rate for tweets from this agent:\n" + 
            "        tweet: {function: constant, value: 0.001}\n") + 
            "    susceptibility: 0\n" +
          enableIf(botAgents, "\n" + 
            "  - name: Bot\n" + 
            "    weights:\n" + 
            "      # Weight with which this agent is created\n" + 
            "      add: 100.0\n" + 
            "      # Weight with which this agent is followed in agent follow\n" + 
            "      follow: 5\n" + 
            "      tweet_type:\n" + 
            "        ideological: 1.0\n" + 
            "        plain: 1.0\n" + 
            "        musical: 1.0\n" + 
            "        humorous: 1.0\n" + 
            "    # Probability that following this agent results in a follow-back\n" + 
            "    followback_probability: .44\n" + 
            "    hashtag_follow_options:\n" + 
            "      care_about_region: true # does the agent care about where the agent they will follow is from?\n" + 
            "      care_about_ideology: false # does the agent care about the ideology of the agent they will follow?\n" + 
            "    rates:\n" + 
            "        # Rate for follows from this agent:\n" + 
            "        follow: {function: constant, value: 0.001}\n" + 
            "        # Rate for tweets from this agent:\n" + 
            "        tweet: {function: constant, value: 0.00001}\n") + 
            "    susceptibility: 0\n" +
          enableIf(companyAgents, " \n" + 
            "  - name: Organization\n" + 
            "    weights:\n" + 
            "      # Weight with which this agent is created\n" + 
            "      add: 100.0\n" + 
            "      # Weight with which this agent is followed in agent follow\n" + 
            "      follow: 20\n" + 
            "      tweet_type:\n" + 
            "        ideological: 1.0\n" + 
            "        plain: 1.0\n" + 
            "        musical: 1.0\n" + 
            "        humorous: 1.0\n" + 
            "    # Probability that following this agent results in a follow-back\n" + 
            "    followback_probability: .44\n" + 
            "    hashtag_follow_options:\n" + 
            "      care_about_region: true # does the agent care about where the agent they will follow is from?\n" + 
            "      care_about_ideology: false # does the agent care about the ideology of the agent they will follow?\n" + 
            "    rates:\n" + 
            "        # Rate for follows from this agent:\n" + 
            "        follow: {function: constant, value: 0.001}\n" + 
            "        # Rate for tweets from this agent:\n" + 
            "        tweet: {function: constant, value: 0.0001}\n" +
            "    susceptibility: 0\n");
    return analysisTemplate + regionsTemplate + preferenceClassTemplate + agentsTemplate;
}
