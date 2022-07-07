const db = require("../db/connection");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const app = require("../app");
const request = require("supertest");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("news api", () => {
  describe("/api/topics", () => {
    describe("GET", () => {
      test("200: returns an array of topic objects, each containing slug & description properties", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            const topicsArr = body.topics;
            expect(topicsArr.length).toBe(3);
            topicsArr.forEach((topic) =>
              expect("slug" in topic && "description" in topic).toBe(true)
            );
          });
      });
      test("404: handles bad paths", () => {
        return request(app)
          .get("/api/topix")
          .expect(404)
          .then(({ body }) => {
            const notFound = body.msg;
            expect(notFound).toBe("Requested content not found");
          });
      });
    });
  });
  describe("/api/articles", () => {
    describe("GET", () => {
      test("200: returns an array of articles, each containing author, title, article_id, body, topic, created_at, votes & comment_count properties in descending date order", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            const articlesArr = body.articles;
            expect(articlesArr.length).toBe(12);
            articlesArr.forEach((articleObj) =>
              expect(
                "author" in articleObj &&
                  "title" in articleObj &&
                  "article_id" in articleObj &&
                  "topic" in articleObj &&
                  "created_at" in articleObj &&
                  "votes" in articleObj &&
                  "comment_count" in articleObj
              ).toBe(true)
            );
            expect(articlesArr).toBeSortedBy("created_at", {
              descending: true,
            });
          });
      });
    });
  });
  describe("/api/articles/:article_id", () => {
    describe("GET", () => {
      test("200: returns an article object, containing author, title, article_id, body, topic, created_at & votes properties", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            const articleObj = body.article;
            expect(
              "author" in articleObj &&
                "title" in articleObj &&
                "article_id" in articleObj &&
                "body" in articleObj &&
                "topic" in articleObj &&
                "created_at" in articleObj &&
                "votes" in articleObj
            ).toBe(true);
            expect(articleObj.article_id).toBe(1);
          });
      });
      test("200: returns an article object, containing author, title, article_id, body, topic, created_at, votes & comment_count properties", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            const articleObj = body.article;
            expect(
              "author" in articleObj &&
                "title" in articleObj &&
                "article_id" in articleObj &&
                "body" in articleObj &&
                "topic" in articleObj &&
                "created_at" in articleObj &&
                "votes" in articleObj &&
                "comment_count" in articleObj
            ).toBe(true);
            expect(articleObj.article_id).toBe(1);
            expect(articleObj.comment_count).toBe(11);
          });
      });
      test("404: returns a 'Bad path. Article with given id not found' message if article with given ID is not found in database", () => {
        return request(app)
          .get("/api/articles/99999999")
          .expect(404)
          .then(({ body }) => {
            const badPath = body.msg;
            expect(badPath).toBe("Bad path. Article with given id not found");
          });
      });
      test("404: returns a 'Bad path. Article ID should be a number' message if article_id is not a number", () => {
        return request(app)
          .get("/api/articles/nevergonnagiveyouup")
          .expect(404)
          .then(({ body }) => {
            const badPath = body.msg;
            expect(badPath).toBe("Bad path. Article ID should be a number");
          });
      });
    });
    describe("PATCH", () => {
      test("200: returns an updated article object, containing author, title, article_id, body, topic, created_at & incremented votes properties", () => {
        const articleUpdateObj = { inc_votes: 25 };
        const voteIncrement = articleUpdateObj.inc_votes;
        const articleID = 2;
        return db
          .query(`SELECT votes FROM articles WHERE article_id = $1;`, [
            articleID,
          ])
          .then((article) => {
            const originalVotes = article.rows[0].votes;
            return originalVotes;
          })
          .then((originalVotes) => {
            return request(app)
              .patch(`/api/articles/${articleID}`)
              .send(articleUpdateObj)
              .expect(200)
              .then(({ body }) => {
                const articleObj = body.article;
                expect(
                  "author" in articleObj &&
                    "title" in articleObj &&
                    "article_id" in articleObj &&
                    "body" in articleObj &&
                    "topic" in articleObj &&
                    "created_at" in articleObj &&
                    "votes" in articleObj
                ).toBe(true);
                expect(articleObj.article_id).toBe(articleID);
                expect(articleObj.votes).toBe(originalVotes + voteIncrement);
              });
          });
      });
      test("400: returns a 'Bad request. Request must be an object including an inc_votes key with a number value' message if request doesn't contain an inc_votes property", () => {
        const invalidUpdate = { invalid: 3 };
        return request(app)
          .patch("/api/articles/1")
          .send(invalidUpdate)
          .expect(400)
          .then(({ body }) => {
            const UnprocessableEnt = body.msg;
            expect(UnprocessableEnt).toBe(
              "Bad request. Request must be an object including an inc_votes key with a number value"
            );
          });
      });
      test("400: returns a 'Bad request. Request must be an object including an inc_votes key with a number value' message if request contains an inc_votes value that isn't a number", () => {
        const invalidUpdate = { inc_votes: "sausage" };
        return request(app)
          .patch("/api/articles/1")
          .send(invalidUpdate)
          .expect(400)
          .then(({ body }) => {
            const UnprocessableEnt = body.msg;
            expect(UnprocessableEnt).toBe(
              "Bad request. Request must be an object including an inc_votes key with a number value"
            );
          });
      });
      test("404: returns a 'Bad path. Article with given id not found' message if article with given ID is not found in database", () => {
        const articleUpdateObj = { inc_votes: 25 };
        return request(app)
          .patch("/api/articles/99999999")
          .send(articleUpdateObj)
          .expect(404)
          .then(({ body }) => {
            const badPath = body.msg;
            expect(badPath).toBe("Bad path. Article with given id not found");
          });
      });
      test("404: returns a 'Bad path. Article ID should be a number' message if article_id is not a number", () => {
        const articleUpdateObj = { inc_votes: 25 };
        return request(app)
          .patch("/api/articles/nevergonnagiveyouup")
          .send(articleUpdateObj)
          .expect(404)
          .then(({ body }) => {
            const badPath = body.msg;
            expect(badPath).toBe("Bad path. Article ID should be a number");
          });
      });
    });
  });
  describe("/api/articles/:article_id/comments", () => {
    describe("GET", () => {
      test("200: returns array of comments for given article_id, each containing comment_id, votes, created_at, author and body properties", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            const commentsArr = body.comments;
            expect(commentsArr.length).toBe(11);
            commentsArr.forEach((commentObj) =>
              expect(
                "comment_id" in commentObj &&
                  "votes" in commentObj &&
                  "created_at" in commentObj &&
                  "author" in commentObj &&
                  "body" in commentObj
              ).toBe(true)
            );
          });
      });
      test("200: returns an empty array of comments for given article_id if article has no comments", () => {
        return request(app)
          .get("/api/articles/7/comments")
          .expect(200)
          .then(({ body }) => {
            const commentsArr = body.comments;
            expect(commentsArr.length).toBe(0);
          });
      });
      test("404: returns a 'Bad path. Article with given id not found' message if article with given ID is not found in database", () => {
        return request(app)
          .get("/api/articles/99999999/comments")
          .expect(404)
          .then(({ body }) => {
            const badPath = body.msg;
            expect(badPath).toBe("Bad path. Article with given id not found");
          });
      });
      test("404: returns a 'Bad path. Article ID should be a number' message if article_id is not a number", () => {
        return request(app)
          .get("/api/articles/nevergonnagiveyouup/comments")
          .expect(404)
          .then(({ body }) => {
            const badPath = body.msg;
            expect(badPath).toBe("Bad path. Article ID should be a number");
          });
      });
    });
  });
  describe("/api/users", () => {
    describe("GET", () => {
      test("200: returns an array of users objects, each containing username, name & avatar_url properties", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body }) => {
            const usersArr = body.users;
            expect(usersArr.length).toBe(4);
            usersArr.forEach((user) =>
              expect(
                "username" in user && "name" in user && "avatar_url" in user
              ).toBe(true)
            );
          });
      });
    });
  });
});
