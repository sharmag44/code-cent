"use strict";
const { baseServices } = require("../services");
const mapper = require("../mappers/person");
const updationScheme = require('../helpers/updateEntities');

exports.create = async(req, res) =>
{
    try
    {
        const model = req.body;
        const { name, email, state } = model;
        
        // Null check
        baseServices.IfEmpty(name, "Name");
        baseServices.IfEmpty(email, "Email");
        baseServices.IfEmpty(state, "State");

        // Check if email already exist
        let person = await db.person.findOne({where: {email: email}});
        if(person && person.status == "notRegistered") throw "Your account is deleted!! Contact Support!!";
        if(person && person.status == "registered") throw "You already have an account with us!!";
        // If person does not exist, create the account
        if(!person)
        {
            person = await db.person.create();
            person = updationScheme.update(model, person);
            person.status = "registered";
            await person.save();
        }
        res.data(mapper.toModel(person));
    }
    catch(error)
    {
        res.failure(error);
    }
};


exports.delete = async(req, res) =>
{
    try
    {
        const model = req.params;
        const { id } = model;
        baseServices.IfEmpty(id, "Person ID");
        
        let person = await db.person.findOne({where: {id: id}});
        if(!person) throw "Invalid Person ID!!";
        person.status = "unregistered";
        await person.save();
        res.success(mapper.toModel(person));        
    }
    catch(error)
    {
        res.failure(error);
    }
};