"use strict";

exports.toModel = (props) =>
{
    const person =
    {
        id: props.id,
        name: props.name,
        email: props.email,
        status: props.status,
    };
    return person;  
};