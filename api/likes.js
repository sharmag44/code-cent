const { baseServices } = require("../services");
const mapper = require("../mappers/like");
const updationScheme = require('../helpers/updateEntities');

exports.like = async (req, res) =>
{
    try
    {
        const model = req.body;
        const { user_email, song_name, singer } = model;

        baseServices.IfEmpty(user_email, "User Email");
        baseServices.IfEmpty(song_name, "Song Name");
        baseServices.IfEmpty(singer, "Singer Name");

        let person = await db.person.findOne({where: {email: user_email, status: "registered"}});
        let song = await db.song.findOne({where: { name: song_name, singer: singer }});

        if(!person) throw "User does not exist!! Please create account first!!";
        if(!song) throw "Song does not exist!! Please choose the correct one!!";

        let alreadyLiked = await db.like.findOne({where: {user_email: user_email, song_name: song_name }});
        if(alreadyLiked) throw "You have already liked this song!!";

        let like = await db.like.create();
        like = updationScheme.update(model, like);
        like.personId = person.id;
        like.songId = song.id;
        await like.save();

        res.success(mapper.toModel(like));
    }
    catch(error)
    {
        res.failure(error);
    }
}

exports.showList = async(req, res) =>
{
    try
    {
        let query = await db.like.findAll({
            where:{},
            include:[db.person,db.song]
        });
        res.success(mapper.toFindModel(query));
    }
    catch(error)
    {
        res.failure(error);
    } 
}