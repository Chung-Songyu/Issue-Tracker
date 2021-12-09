const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

suite("Functional Tests", () => {
  suite("POST", () => {
    // #1
    test("Create an issue with every field", (done) => {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "delete",
          issue_text: "test1_2",
          created_by: "test1_3",
          assigned_to: "test1_4",
          status_text: "test1_5",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.project_name, "test");
          assert.equal(res.body.issue_title, "delete");
          assert.equal(res.body.issue_text, "test1_2");
          assert.equal(res.body.created_by, "test1_3");
          assert.equal(res.body.assigned_to, "test1_4");
          assert.equal(res.body.status_text, "test1_5");
          assert.equal(res.body.open, true);
          assert.equal(typeof res.body.created_on, "string");
          assert.equal(typeof res.body.updated_on, "string");
          assert.equal(typeof res.body._id, "string");
          done();
        });
    });
    // #2
    test("Create an issue with only required fields", (done) => {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "delete",
          issue_text: "test2_2",
          created_by: "test2_3",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.project_name, "test");
          assert.equal(res.body.issue_title, "delete");
          assert.equal(res.body.issue_text, "test2_2");
          assert.equal(res.body.created_by, "test2_3");
          assert.equal(res.body.assigned_to, "");
          assert.equal(res.body.status_text, "");
          assert.equal(res.body.open, true);
          assert.equal(typeof res.body.created_on, "string");
          assert.equal(typeof res.body.updated_on, "string");
          assert.equal(typeof res.body._id, "string");
          done();
        });
    });
    // #3
    test("Create an issue with missing required fields", (done) => {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "test3_1",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.error, "required field(s) missing");
          done();
        });
    });
  });

  suite("GET", () => {
    // #4
    test("View issues on a project", (done) => {
      chai
        .request(server)
        .get("/api/issues/test")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body[1].project_name, "test");
          assert.equal(res.body[1].issue_title, "delete");
          assert.equal(res.body[1].issue_text, "test1_2");
          assert.equal(res.body[1].created_by, "test1_3");
          assert.equal(res.body[1].assigned_to, "test1_4");
          assert.equal(res.body[1].status_text, "test1_5");
          assert.equal(res.body[1].open, true);
          assert.equal(typeof res.body[1].created_on, "string");
          assert.equal(typeof res.body[1].updated_on, "string");
          assert.equal(typeof res.body[1]._id, "string");

          assert.equal(res.body[2].project_name, "test");
          assert.equal(res.body[2].issue_title, "delete");
          assert.equal(res.body[2].issue_text, "test2_2");
          assert.equal(res.body[2].created_by, "test2_3");
          assert.equal(res.body[2].assigned_to, "");
          assert.equal(res.body[2].status_text, "");
          assert.equal(res.body[2].open, true);
          assert.equal(typeof res.body[2].created_on, "string");
          assert.equal(typeof res.body[2].updated_on, "string");
          assert.equal(typeof res.body[2]._id, "string");
          done();
        });
    });
    // #5
    test("View issues on a project with one filter", (done) => {
      chai
        .request(server)
        .get("/api/issues/test?issue_title=delete")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.length, 2);
          assert.equal(res.body[0].issue_title, "delete");
          assert.equal(res.body[1].issue_title, "delete");
          done();
        });
    });
    // #6
    test("View issues on a project with multiple filters", (done) => {
      chai
        .request(server)
        .get("/api/issues/test?issue_title=delete&issue_text=test1_2")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body[0].project_name, "test");
          assert.equal(res.body[0].issue_title, "delete");
          assert.equal(res.body[0].issue_text, "test1_2");
          assert.equal(res.body[0].created_by, "test1_3");
          assert.equal(res.body[0].assigned_to, "test1_4");
          assert.equal(res.body[0].status_text, "test1_5");
          assert.equal(res.body[0].open, true);
          assert.equal(typeof res.body[0].created_on, "string");
          assert.equal(typeof res.body[0].updated_on, "string");
          assert.equal(typeof res.body[0]._id, "string");
          done();
        });
    });
  });

  suite("PUT", () => {
    // #7
    test("Update one field on an issue", (done) => {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: "612c87a537223e03c0c08076",
          assigned_to: "test0_a"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully updated");
          assert.equal(res.body._id, "612c87a537223e03c0c08076");
          done();
        });
    });
    // #8
    test("Update multiple fields on an issue", (done) => {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: "612c87a537223e03c0c08076",
          status_text: "test0_b",
          issue_title: "test0_c",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully updated");
          assert.equal(res.body._id, "612c87a537223e03c0c08076");
          done();
        });
    });
    // #9
    test("Update an issue with missing _id", (done) => {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          issue_text: "test0_d"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "missing _id");
          done();
        });
    });
    // #10
    test("Update an issue with no fields to update", (done) => {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: "612c87a537223e03c0c08076"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "no update field(s) sent");
          done();
        });
    });
    // #11
    test("Update an issue with an invalid _id", (done) => {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
          _id: "aaa",
          created_by: "test0_e"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "could not update");
          done();
        });
    });
  });

  suite("DELETE", () => {
    // #12
    test("Delete an issue", (done) => {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "delete",
          issue_text: "test_delete",
          created_by: "test_delete"
        })
        .end((err, res) => {
          const newId = res.body._id;
          chai
            .request(server)
            .delete("/api/issues/test")
            .send({
              _id: newId
            })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.body.result, "successfully deleted");
              assert.equal(res.body._id, newId);
            });
          done();
        });
    });
    // #13
    test("Delete an issue with an invalid _id", (done) => {
      chai
        .request(server)
        .delete("/api/issues/test")
        .send({
          _id: "bbb"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "could not delete");
          assert.equal(typeof res.body._id, "string");
          done();
        });
    });
    // #14
    test("Delete an issue with missing _id", (done) => {
      chai
        .request(server)
        .delete("/api/issues/test")
        .send({
          _id: ""
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "missing _id");
          done();
        });
    });
  });
});
