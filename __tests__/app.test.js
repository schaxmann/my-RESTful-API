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
              expect("slug" && "description" in topic).toBe(true)
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
});
