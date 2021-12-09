'use strict';
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});

module.exports = (app) => {
  const issueSchema = new mongoose.Schema({
    project_name: {type: String, required: true, trim: true},
    issue_title: {type: String, required: true, trim: true},
    issue_text: {type: String, required: true, trim: true},
    created_by: {type: String, required: true, trim: true},
    assigned_to: {type: String, default: "", trim: true},
    status_text: {type: String, default: "", trim: true},
    open: {type: Boolean, default: true},
    created_on: {type: Date, default: Date.now},
    updated_on: {type: Date, default: Date.now}
  });

  const Issue = mongoose.model("Issue", issueSchema);

  app.route('/api/issues/:project')
    .get((req, res) => {
      const query = {
        "project_name": req.params.project,
      }
      Object.entries(req.query).forEach(arr => query[arr[0]]=arr[1]);
      Issue.find(query, (err, docs) => {
        if(err) {
          return err;
        } else {
          res.json(docs);
        };
      });
    })

    .post((req, res) => {
      if(!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
        console.log("Create: Missing fields.")
        res.json({error: 'required field(s) missing'});
      }
      const problem = new Issue({
        project_name: req.params.project,
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to || "",
        status_text: req.body.status_text || "",
        open: true,
        created_on: new Date(),
        updated_on: new Date()
      });
      problem.save((err, data) => {
        if(err) {
          return err;
        } else {
          console.log("Create: Successful.");
          res.json(data);
        };
      });
    })

    .put((req, res) => {
      if(!req.body._id) {
        console.log("Update: Missing id.");
        res.json({error: 'missing _id'});
      } else if(!req.body.issue_title && !req.body.issue_text && !req.body.created_by && !req.body.assigned_to && !req.body.status_text && !req.body.open) {
        console.log("Update: Missing fields.");
        res.json({error: 'no update field(s) sent', '_id': req.body._id});
      } else {
        Issue.findOne({"_id": req.body._id}, (err, docs) => {
          if(!docs) {
            console.log("Update: Invalid id.");;
            res.json({error: 'could not update', '_id': req.body._id});
          } else {
            docs.issue_title = req.body.issue_title || docs.issue_title;
            docs.issue_text = req.body.issue_text || docs.issue_text;
            docs.created_by = req.body.created_by || docs.created_by;
            docs.assigned_to = req.body.assigned_to || docs.assigned_to;
            docs.status_text = req.body.status_text || docs.status_text;
            docs.open = req.body.open || docs.open;
            docs.updated_on = new Date();
            docs.save((err, data) => {
              if(err) {
                console.log("Update: Failed.");
                res.json({error: 'could not update', '_id': req.body._id});
              } else {
                console.log("Update: Successful.");
                res.json({result: 'successfully updated', '_id': req.body._id});
              };
            });
          };
        });
      }
    })

    .delete((req, res) => {
      if(!req.body._id) {
        console.log("Delete: Missing id.");
        res.json({error: 'missing _id'});
      } else {
        Issue.findOneAndDelete({"_id": req.body._id}, (err, docs) => {
          if(!docs) {
            console.log("Delete: Invalid id.");
            res.json({error: 'could not delete', '_id': req.body._id});
          } else {
            console.log("Delete: Successful.");
            res.json({result: 'successfully deleted', '_id': req.body._id});
          };
        });
      }
    });
};
