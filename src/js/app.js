App = {
    web3Provider: null,
    contracts: {},

    init: function () {
        // Load bands
        $.getJSON('../bands.json', function (data) {
            var bandsRow = $('#bandsRow');
            var bandsTemplate = $('#bandsTemplate');

            for (i = 0; i < data.length; i++) {
                bandsTemplate.find('.panel-title').text(data[i].name);
                bandsTemplate.find('img').attr('src', data[i].picture);
                bandsTemplate.find('.band-year').text(data[i].year);
                bandsTemplate.find('.band-bio_url').text(data[i].bio_url);
                bandsTemplate.find('.btn-vote').attr('data-id', data[i].id);

                bandsRow.append(bandsTemplate.html());
            }
        });

        return App.initWeb3();
    },

    initWeb3: function () {
        // Is there an injected web3 instance?
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
        } else {
            // If no injected web3 instance is detected, fall back to Ganache
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
        web3 = new Web3(App.web3Provider);

        return App.initContract();
    },

    initContract: function () {
        $.getJSON('Voting.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract
            var VotingArtifact = data;
            App.contracts.Voting = TruffleContract(VotingArtifact);

            // Set the provider for our contract
            App.contracts.Voting.setProvider(App.web3Provider);
            //Initialise candidate list 

            var BandList = ["The Beatles", "U2", "Queen"];

            App.contracts.Voting.getCandidateNames(BandList);
    
            // Use our contract to retrieve and mark vote counts
            return App.showVotes();
        });

        return App.bindEvents();
    },

    bindEvents: function () {
        $(document).on('click', '.btn-vote', App.handleVote);
    },


    handleVote: function (event) {
        event.preventDefault();

        var bandName = $(event.target).data('name');

        var voteInstance;

        web3.eth.getAccounts(function (error, accounts) {
            if (error) {
                console.log(error);
            }

            var account = accounts[0];

            App.contracts.Voting.deployed().then(function (instance) {
                voteInstance = instance;

                // Execute adopt as a transaction by sending account
                return voteInstance.voteForCandidate(bandName);
            }).then(function (result) {
                return App.showVotes();
            }).catch(function (err) {
                console.log(err.message);
            });
        });
    }

}


$(function () {
    $(window).load(function () {
        App.init();
    });
});