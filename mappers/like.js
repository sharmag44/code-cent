"use strict";

const _ = require("underscore");
const personMapper = require('./person');
const songMapper = require('./song')

exports.toModel = (props) =>
{
    const like =
    {
        email: props.user_email, 
        song: props.song_name,
        singer: props.singer,

    };
    if(props.person)
    {
        like.person = personMapper.toModel(props.person);
    }
    return like;
};

exports.toFindModel = (props) =>
{
    return _.map(props, exports.toModel);
};