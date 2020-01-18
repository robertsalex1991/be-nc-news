process.env.NODE_ENV = "test";

//check that the correct equal/ eql being used. check that all test descriptions line up to the actual test. check notes for specifics

const chai = require("chai");
const { expect } = chai;
const chaiSorted = require("chai-sorted");
const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");

chai.use(chaiSorted);

describe("/api", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  describe("/topics", () => {
    it("GET returns status 200 & topics object containing an array of the topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics[0]).to.eql({
            description: "The man, the Mitch, the legend",
            slug: "mitch"
          });
        });
    });
    it("POST returns status 201 & the object of the topic sent in the request", () => {
      return request(app)
        .post("/api/topics")
        .expect(201)
        .send({ slug: "UFC", description: "hey" })
        .then(({ body }) => {
          expect(body.topic.slug).to.eql("UFC");
          expect(body.topic.description).to.eql("hey");
        });
    });

    it("POST returns status 400 if there is no description or slug sent on the request body", () => {
      return request(app)
        .post("/api/topics")
        .expect(400)
        .send({})
        .then(response => {
          expect(response.body.msg).to.eql(
            "you missed an input category, please try again"
          );
        });
    });
    it("POST returns status 404 if the request is sent to a non existent endpoint", () => {
      return request(app)
        .post("/api/topics/99999")
        .expect(404)
        .send({ slug: "icellusedkars", description: "hey" })
        .then(response => {
          expect(response.body.msg).to.eql(
            "Error status 404, this page not found"
          );
        });
    });
    it("POST returns status 400 if the user is not in the user table", () => {
      return request(app)
        .post("/api/topics")
        .expect(405)
        .send({ slug: "mitch", description: "hey" })
        .then(response => {
          expect(response.body.msg).to.eql("this topic already exists");
        });
    });
  });
  describe("/floopydoop", () => {
    it("GET returns status 404 when this page cannot be found", () => {
      return request(app)
        .get("/api/floopydoop")
        .expect(404)
        .then(({ body }) => {
          expect(body).to.eql({
            msg: "Error status 404, this page not found"
          });
        });
    });
  });
  describe("/users", () => {
    it("GET returns status 200 & topics object containing an array of the topics", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users[0]).to.eql({
            username: "butter_bridge",
            name: "jonny",
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
          });
        });
    });
    it("POST returns status 201 & the object of the topic sent in the request", () => {
      return request(app)
        .post("/api/users")
        .expect(201)
        .send({
          username: "testuser3",
          avatar_url: "https://http.cat/201",
          name: "Duke Testus Userson III"
        })
        .then(({ body }) => {
          expect(body.user).to.eql({
            username: "testuser3",
            avatar_url: "https://http.cat/201",
            name: "Duke Testus Userson III"
          });
        });
    });
    it("POST returns status 400 if there is a missing parameter sent on the request body", () => {
      return request(app)
        .post("/api/users")
        .expect(400)
        .send({})
        .then(response => {
          expect(response.body.msg).to.eql(
            "you missed an input category, please try again"
          );
        });
    });
    it("POST returns status 405 if the request is sent to a non existent endpoint", () => {
      return request(app)
        .post("/api/users/99999")
        .expect(405)
        .send({
          username: "testuser3",
          avatar_url: "https://http.cat/201",
          name: "Duke Testus Userson III"
        })
        .then(response => {
          expect(response.body.msg).to.eql("Method not allowed");
        });
    });
  });
  describe("/users/:username", () => {
    it("GET returns status 200 & the object of the user specified by the username in the url", () => {
      return request(app)
        .get("/api/users/icellusedkars")
        .expect(200)
        .then(({ body }) => {
          expect(body.user).to.eql({
            username: "icellusedkars",
            name: "sam",
            avatar_url:
              "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4"
          });
        });
    });
  });
  describe("/users/notausername", () => {
    it("GET returns status 404 for page not found", () => {
      return request(app)
        .get("/api/users/notausername")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.eql(`no user found for notausername`);
        });
    });
  });
  describe("/articles", () => {
    it("GET returns status 200 & articles object containing an array of the articles", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles[0]).to.eql({
            article_id: 1,
            title: "Living in the shadow of a great man",
            body: "I find this existence challenging",
            votes: 100,
            topic: "mitch",
            author: "butter_bridge",
            created_at: "2018-11-15T12:21:54.000Z",
            comment_count: "13"
          });
        });
    });
    it("POST returns status 201 & the object of the article sent in the request", () => {
      return request(app)
        .post("/api/articles")
        .expect(201)
        .send({
          title: "kitten mittens",
          body: "hey",
          slug: "mitch",
          username: "icellusedkars"
        })
        .then(({ body }) => {
          expect(body.article.topic).to.eql("mitch");
          expect(body.article.body).to.eql("hey");
          expect(body.article.author).to.eql("icellusedkars");
          expect(body.article.title).to.eql("kitten mittens");
        });
    });
    it("POST returns status 400 if there is a missing input category sent on the request body", () => {
      return request(app)
        .post("/api/articles")
        .expect(400)
        .send({})
        .then(response => {
          expect(response.body.msg).to.eql(
            "you missed an input category, please try again"
          );
        });
    });
    it("POST returns status 400 if an extra input category is given", () => {
      return request(app)
        .post("/api/articles")
        .expect(400)
        .send({
          title: "kitten mittens",
          body: "hey",
          slug: "mitch",
          username: "icellusedkars",
          incorrectInput: 20
        })
        .then(({ body }) => {
          expect(body.msg).to.eql("the query parameter does not exist");
        });
    });
  });
  describe("/articles?queries", () => {
    it("GET returns status 200 & an array of all comments for the given article id sorted by the heading and order specified in the query", () => {
      return request(app)
        .get("/api/articles?sort_by=votes&order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.sortedBy("votes", { descending: false });
          expect(body.articles[0]).to.eql({
            article_id: 11,
            author: "icellusedkars",
            body:
              "Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?",
            comment_count: "0",
            created_at: "1978-11-25T12:21:54.000Z",
            title: "Am I a cat?",
            topic: "mitch",
            votes: 0
          });
        });
    });
    it("GET:200, the limit and page of article can be changed and returns that many items depending on page", () => {
      return request(app)
        .get("/api/articles/?limit=10&p=1")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).to.equal(10);
        });
    });
    it("GET returns status 200 & an array of all comments for the given article id sorted with only the column heading specified in the query", () => {
      return request(app)
        .get("/api/articles?sort_by=votes")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.sortedBy("votes", { descending: true });
          expect(body.articles[0]).to.eql({
            article_id: 1,
            author: "butter_bridge",
            body: "I find this existence challenging",
            comment_count: "13",
            created_at: "2018-11-15T12:21:54.000Z",
            title: "Living in the shadow of a great man",
            topic: "mitch",
            votes: 100
          });
        });
    });
    it("GET returns status 200 & an array of all comments for the given article id with only the order specified in the query", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.sortedBy("created_at", {
            descending: false
          });
          expect(body.articles[0]).to.eql({
            article_id: 12,
            title: "Moustache",
            body: "Have you seen the size of that thing?",
            votes: 0,
            topic: "mitch",
            author: "butter_bridge",
            created_at: "1974-11-26T12:21:54.000Z",
            comment_count: "0"
          });
        });
    });
    it("GET returns status 400 & an error message if the sort by query table header does not exist in the database", () => {
      return request(app)
        .get("/api/articles?sort_by=lalala")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.eql("the query parameter does not exist");
        });
    });
    it("GET returns status 200 & an array of all comments for the given author specified in the query", () => {
      return request(app)
        .get("/api/articles?author=icellusedkars")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.sortedBy("created_at", {
            descending: true
          });
          expect(body.articles[body.articles.length - 1]).to.eql({
            article_id: 11,
            title: "Am I a cat?",
            body:
              "Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?",
            votes: 0,
            topic: "mitch",
            author: "icellusedkars",
            created_at: "1978-11-25T12:21:54.000Z",
            comment_count: "0"
          });
          expect(body.articles).to.have.lengthOf(6);
        });
    });
    it("GET returns status 404 & an error message when searching for an author that doesn't exist in the database", () => {
      return request(app)
        .get("/api/articles?author=blablabla")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.eql("your search query cannot be found");
        });
    });
    it("GET returns status 404 & an error message when searching for a topic that doesn't exist in the database", () => {
      return request(app)
        .get("/api/articles?topic=blablabla")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.eql("your search query cannot be found");
        });
    });
    it("GET returns status 200 & an array of all comments for the given topic specified in the query", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.sortedBy("created_at", {
            descending: true
          });
          expect(body.articles[0]).to.eql({
            article_id: 1,
            title: "Living in the shadow of a great man",
            body: "I find this existence challenging",
            votes: 100,
            topic: "mitch",
            author: "butter_bridge",
            created_at: "2018-11-15T12:21:54.000Z",
            comment_count: "13"
          });
          expect(body.articles).to.have.lengthOf(10);
        });
    });
    it("GET returns status 200 & an array of all comments for the given topic and author specified in the query", () => {
      return request(app)
        .get("/api/articles?topic=mitch&author=icellusedkars")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).to.be.sortedBy("created_at", {
            descending: true
          });
          expect(body.articles[body.articles.length - 1]).to.eql({
            article_id: 11,
            title: "Am I a cat?",
            body:
              "Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?",
            votes: 0,
            topic: "mitch",
            author: "icellusedkars",
            created_at: "1978-11-25T12:21:54.000Z",
            comment_count: "0"
          });
          expect(body.articles).to.have.lengthOf(6);
        });
    });
    it("GET returns status 404 & an error message when articles on a specified topic that a specified author hasn't written about are searched for", () => {
      return request(app)
        .get("/api/articles?topic=blablabla&author=icellusedkars")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.eql("your search query cannot be found");
        });
    });
  });
  describe("/articles/:article_id", () => {
    it("GET returns status 200 & the object of the article specified by the article id in the url", () => {
      return request(app)
        .get("/api/articles/8")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).to.eql({
            article_id: 8,
            title: "Does Mitch predate civilisation?",
            body:
              "Archaeologists have uncovered a gigantic statue from the dawn of humanity, and it has an uncanny resemblance to Mitch. Surely I am not the only person who can see this?!",
            votes: 0,
            topic: "mitch",
            author: "icellusedkars",
            created_at: "1990-11-22T12:21:54.000Z"
          });
        });
    });

    it("GET returns status 404 for page not found", () => {
      return request(app)
        .get("/api/articles/30")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.eql(
            `no articles found for article id 30`
          );
        });
    });
    it("GET returns status 400 for invalid input", () => {
      return request(app)
        .get("/api/articles/lalalala")
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.eql(`invalid input syntax for integer`);
        });
    });
    it("Patch returns status 200 & increases the number of votes on the object of the user specified by the username in the url", () => {
      return request(app)
        .patch("/api/articles/8")
        .expect(200)
        .send({ inc_votes: 100 })
        .then(({ body }) => {
          expect(body.article.votes).to.eql(100);
        });
    });
    it("PATCH returns status 400 for invalid input", () => {
      return request(app)
        .patch("/api/articles/lalalala")
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.eql(`invalid input syntax for integer`);
        });
    });
    it("PATCH returns status 400 for invalid input", () => {
      return request(app)
        .patch("/api/articles/8")
        .expect(400)
        .send({ inc_votes: "lalala" })
        .then(response => {
          expect(response.body.msg).to.eql(`invalid input syntax for integer`);
        });
    });
    it("Patch returns status 200 & increases the votes on the object of the user specified by the username in the url, but also ignores any information related to any other object keys", () => {
      return request(app)
        .patch("/api/articles/8")
        .expect(200)
        .send({ inc_votes: 100, body: "I love coding" })
        .then(({ body }) => {
          expect(body.article).to.eql({
            article_id: 8,
            title: "Does Mitch predate civilisation?",
            body:
              "Archaeologists have uncovered a gigantic statue from the dawn of humanity, and it has an uncanny resemblance to Mitch. Surely I am not the only person who can see this?!",
            votes: 100,
            topic: "mitch",
            author: "icellusedkars",
            created_at: "1990-11-22T12:21:54.000Z"
          });
        });
    });
    it("PATCH returns status 200 with no change to the article objects votes if request body is empty", () => {
      return request(app)
        .patch("/api/articles/8")
        .expect(200)
        .send({})
        .then(response => {
          expect(response.body.article).to.eql({
            article_id: 8,
            title: "Does Mitch predate civilisation?",
            body:
              "Archaeologists have uncovered a gigantic statue from the dawn of humanity, and it has an uncanny resemblance to Mitch. Surely I am not the only person who can see this?!",
            votes: 0,
            topic: "mitch",
            author: "icellusedkars",
            created_at: "1990-11-22T12:21:54.000Z"
          });
        });
    });
    it("DELETE returns status 204", () => {
      return request(app)
        .delete("/api/articles/3")
        .expect(204);
    });
    it("DELETE returns status 400 for invalid input", () => {
      return request(app)
        .delete("/api/articles/8000")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.eql("this comment doesn't exist");
        });
    });
    it("DELETE returns status 400 for invalid input", () => {
      return request(app)
        .delete("/api/articles/lalala")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.eql("invalid input syntax for integer");
        });
    });
  });
  describe("/articles/:article_id/comments", () => {
    it("POST returns status 201 & the object of the article specified by the article id in the url", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .expect(201)
        .send({ username: "icellusedkars", body: "hey" })
        .then(({ body }) => {
          expect(body.comment.author).to.eql("icellusedkars");
          expect(body.comment.body).to.eql("hey");
        });
    });

    it("POST returns status 400 if there is no body or username sent on the request body", () => {
      return request(app)
        .post("/api/articles/8/comments")
        .expect(400)
        .send({ body: "hey" })
        .then(response => {
          expect(response.body.msg).to.eql(
            "you missed an input category, please try again"
          );
        });
    });
    it("POST returns status 404 if the article id doesn't exist", () => {
      return request(app)
        .post("/api/articles/99999/comments")
        .expect(404)
        .send({ username: "icellusedkars", body: "hey" })
        .then(response => {
          expect(response.body.msg).to.eql("this page cannot be found");
        });
    });
    it("POST returns status 400 if the user is not in the user table", () => {
      return request(app)
        .post("/api/articles/8/comments")
        .expect(404)
        .send({ username: "dave", body: "hey" })
        .then(response => {
          expect(response.body.msg).to.eql("no user found for dave");
        });
    });
    it("GET returns status 200 & an array of all comments for the given article id", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments[2]).to.eql({
            comment_id: 4,
            author: "icellusedkars",
            votes: -100,
            created_at: "2014-11-23T12:36:03.000Z",
            body: " I carry a log — yes. Is it funny to you? It is not to me."
          });
        });
    });
    it("GET returns status 404 if the comment does not exist but the article does", () => {
      return request(app)
        .get("/api/articles/3/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.eql([]);
        });
    });
    it("GET returns status 404 for page not found if article id is not there", () => {
      return request(app)
        .get("/api/articles/30/comments")
        .expect(404)
        .then(response => {
          expect(response.body.msg).to.eql(
            `no articles found for article id 30`
          );
        });
    });
    it("GET returns status 400 for invalid input", () => {
      return request(app)
        .get("/api/articles/lalalala/comments")
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.eql(`invalid input syntax for integer`);
        });
    });
    it("GET returns status 200 & an array of all comments for the given article id sorted by the heading and order specified in the query", () => {
      return request(app)
        .get("/api/articles/9/comments?sort_by=votes&order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.be.sortedBy("votes", { descending: false });
          expect(body.comments).to.eql([
            {
              comment_id: 1,
              author: "butter_bridge",
              votes: 16,
              created_at: "2017-11-22T12:36:03.000Z",
              body:
                "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
            },
            {
              comment_id: 17,
              author: "icellusedkars",
              votes: 20,
              created_at: "2001-11-26T12:36:03.000Z",
              body: "The owls are not what they seem."
            }
          ]);
        });
    });
    it("GET returns status 200 & an array of all comments for the given article id, sorted by the heading and in the default", () => {
      return request(app)
        .get("/api/articles/9/comments?sort_by=votes")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.be.sortedBy("votes", { descending: true });
          expect(body.comments).to.eql([
            {
              comment_id: 17,
              author: "icellusedkars",
              votes: 20,
              created_at: "2001-11-26T12:36:03.000Z",
              body: "The owls are not what they seem."
            },
            {
              comment_id: 1,
              author: "butter_bridge",
              votes: 16,
              created_at: "2017-11-22T12:36:03.000Z",
              body:
                "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
            }
          ]);
        });
    });
    it("GET returns status 200 & an array of all comments for the given article id, sorted by the heading and in the default", () => {
      return request(app)
        .get("/api/articles/9/comments?order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.be.sortedBy("created_at", {
            descending: false
          });
          expect(body.comments).to.eql([
            {
              comment_id: 17,
              author: "icellusedkars",
              votes: 20,
              created_at: "2001-11-26T12:36:03.000Z",
              body: "The owls are not what they seem."
            },
            {
              comment_id: 1,
              author: "butter_bridge",
              votes: 16,
              created_at: "2017-11-22T12:36:03.000Z",
              body:
                "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
            }
          ]);
        });
    });
    it("GET returns status 200 & an array of all comments for the given article id, sorted by the heading and in the default", () => {
      return request(app)
        .get("/api/articles/9/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.be.sortedBy("created_at", {
            descending: true
          });
          expect(body.comments).to.eql([
            {
              comment_id: 1,
              author: "butter_bridge",
              votes: 16,
              created_at: "2017-11-22T12:36:03.000Z",
              body:
                "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
            },
            {
              comment_id: 17,
              author: "icellusedkars",
              votes: 20,
              created_at: "2001-11-26T12:36:03.000Z",
              body: "The owls are not what they seem."
            }
          ]);
        });
    });
  });
  describe("/comments", () => {
    it("GET:200, the limit and page of article can be changed and returns that many items depending on page", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=10&p=1")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments.length).to.equal(10);
        });
    });
  });
  describe("/comments/:comment_id", () => {
    it("Patch returns status 200 & the object of the comment specified by the comment_id in the url", () => {
      return request(app)
        .patch("/api/comments/8")
        .expect(200)
        .send({ inc_votes: 100 })
        .then(({ body }) => {
          expect(body.comment.votes).to.eql(100);
        });
    });
    it("PATCH returns status 400 for invalid input", () => {
      return request(app)
        .patch("/api/comments/lalalala")
        .expect(400)
        .then(response => {
          expect(response.body.msg).to.eql(`invalid input syntax for integer`);
        });
    });
    it("PATCH returns status 400 for invalid input", () => {
      return request(app)
        .patch("/api/comments/8")
        .expect(400)
        .send({ inc_votes: "lalala" })
        .then(response => {
          expect(response.body.msg).to.eql(`invalid input syntax for integer`);
        });
    });
    it("PATCH returns status 200 & increases the votes of the object of the user specified by the username in the url, whilst ignoring any input related to any other object keys", () => {
      return request(app)
        .patch("/api/comments/8")
        .expect(200)
        .send({ inc_votes: 100, body: "I love coding" })
        .then(({ body }) => {
          expect(body.comment).to.eql({
            comment_id: 8,
            author: "icellusedkars",
            article_id: 1,
            votes: 100,
            created_at: "2010-11-24T12:36:03.000Z",
            body: "Delicious crackerbreads"
          });
        });
    });
    it("PATCH returns status 200 and an unchanged comment for invalid input in request body", () => {
      return request(app)
        .patch("/api/comments/8")
        .expect(200)
        .send({})
        .then(({ body }) => {
          expect(body.comment).to.eql({
            comment_id: 8,
            author: "icellusedkars",
            article_id: 1,
            votes: 0,
            created_at: "2010-11-24T12:36:03.000Z",
            body: "Delicious crackerbreads"
          });
        });
    });
    it("DELETE returns status 204", () => {
      return request(app)
        .delete("/api/comments/8")
        .expect(204);
    });
    it("DELETE returns status 400 for invalid input", () => {
      return request(app)
        .delete("/api/comments/8000")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.eql("this comment doesn't exist");
        });
    });
    it("DELETE returns status 400 for invalid input", () => {
      return request(app)
        .delete("/api/comments/lalala")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.eql("invalid input syntax for integer");
        });
    });
  });
});
