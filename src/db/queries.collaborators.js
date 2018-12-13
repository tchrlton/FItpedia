const Collaborator = require("./models").Collaborator;
const Wiki = require("./models").Wiki;
const User = require("./models").User;
const Authorizer = require("../policies/wiki");

module.exports = {

    createCollaborator(req, callback) {

        User.findAll({
            where: {
                username: req.body.collaborator
            }
        })
        .then((users)=>{
            if(!users[0]){
                return callback("User does not exist.");
            }
            Collaborator.findAll({
                where: {
                    userId: users[0].id,
                    wikiId: req.params.wikiId,
                }
            })
            .then((collaborators)=>{
                if(collaborators.length != 0){
                    return callback(`${req.body.collaborator} is already a collaborator on this wiki.`);
                }
                let newCollaborator = {
                    userId: users[0].id,
                    wikiId: req.params.wikiId
                };
                return Collaborator.create(newCollaborator)
                .then((collaborator) => {
                    callback(null, collaborator);
                })
                .catch((err) => {
                    callback(err, null);
                })
            })
            .catch((err)=>{
                callback(err, null);
            })
        })
        .catch((err)=>{
            callback(err, null);
        })
    },
    getCollaboratorforWiki(wikiId, callback){
        return Collaborator.findAll({
          where: {
            wikiId: wikiId
          }
        })
        .then((collaborators) => {
          callback(null, collaborators);
        })
        .catch((err) => {
          console.log(err);
          callback(err);
        });
    },
    getCollaboratorsforUser(userId, callback){
        return Collaborator.findAll({
          where: {
            userId: userId
          }
        })
        .then((collaborators) => {
          callback(null, collaborators);
        })
        .catch((err) => {
          console.log(err);
          callback(err);
        });
    },
    deleteCollaborator(req, callback) {
        let userId = req.body.collaborator;
        let wikiId = req.params.wikiId;

        const authorized = new Authorizer(req.user, wikiId, userId).destroy();

        if (authorized) {
            Collaborator.destroy({
                    where: {
                        userId: userId,
                        wikiId: wikiId
                    }
                })
                .then((deletedRecordsCount) => {
                    callback(null, deletedRecordsCount);
                })
                .catch((err) => {
                    callback(err);
                });
        } else {
            req.flash("notice", "You are not authorized to do that.");
            callback(401);
        }
    },

    checkUser(userId, wikiId, callback){
        return Collaborator.findAll({
          where: {
            userId: userId,
            wikiId: wikiId
          }
        })
        .then((collaborators) => {
          callback(null, collaborators);
        })
        .catch((err) => {
          console.log(err);
          callback(err);
        });
    },

}