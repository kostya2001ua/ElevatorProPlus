var models = require('../models');

async function showClientsListPage(req, res, next) {
    var clients = await models.Client.findAll();
    res.render('clients/list', {
        clients: clients
    })
}

async function showCreateClientPage(req, res, next) {
    res.render('clients/new');
}

async function createClient(req, res, next) {
    var companyName = req.body.company_name;
    var address = req.body.address;
    var contacts = req.body.contacts;
    var client = await models.Client.create({
        company_name: companyName,
        address: address,
        contacts: contacts
    });
    res.redirect('/clients/' + client.id);
}

async function showClientPage(req, res, next) {
    var id = req.params.id;
    var client = await models.Client.findByPk(id);
    if(!client) {
        return next();
    }
    res.render('clients/client', {
        client: client
    });
}

async function editClient(req, res, next) {
    try {
        var client = await models.Client.findByPk(req.body.id);
        if (!client) {
            throw new Error('Client not found');
        }
        client.set({
            company_name: req.body.company_name,
            contacts: req.body.contacts,
            address: req.body.address
        });
        await client.save();
        res.json({
            success: true,
            message: 'Client updated successfuly'
        });

    } catch(err) {
        res.json({
            success: false,
            message: err.message
        });
    }
}

module.exports = {
    showClientsListPage,
    showCreateClientPage,
    createClient,
    showClientPage: showClientPage,
    editClient: editClient
}