process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const items = require("../fakeDb");

let item = { name: "hot dogs", price: 3.99 };

beforeEach(() => {
  items.push(item);
});

afterEach(() => {
  items.length = 0;
});

describe("GET /items", () => {
  test("Get all items", async () => {
    const res = await request(app).get("/items");
    const { items } = res.body;
    expect(res.statusCode).toBe(200);
    expect(items).toHaveLength(1);
  });
});

describe("GET /items/:name", () => {
  test("Get item by name", async () => {
    const res = await request(app).get(`/items/${item.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.foundItem).toEqual(item);
  });
  test("Responds with 404 for invalid item", async () => {
    const res = await request(app).get("/items/hamburgers");
    expect(res.statusCode).toBe(404);
  });
});

describe("POST /items", () => {
  test("Add new item", async () => {
    const res = await request(app)
      .post("/items")
      .send({ name: "marshmellows", price: 2.5 });
    expect(res.statusCode).toBe(200);
    expect(res.body.added).toHaveProperty("name");
    expect(res.body.added).toHaveProperty("price");
    expect(res.body.added.name).toEqual("marshmellows");
    expect(res.body.added.price).toEqual(2.5);
  });
  test("Responds with 400 if params are not met", async () => {
    const res = await request(app).post("/items").send({});
    expect(res.statusCode).toBe(400);
  });
});

describe("PATCH /items/:name", () => {
  test("Update an item", async () => {
    const res = await request(app)
      .patch(`/items/${item.name}`)
      .send({ name: "gummy bears", price: 0 });
    expect(res.statusCode).toBe(200);
    expect(res.body.updated).toEqual({ name: "gummy bears", price: 0 });
  });
  test("Responds with 404 for updating invalid item", async () => {
    const res = await request(app).patch("/items/hamburgers");
    expect(res.statusCode).toBe(404);
  });
});

describe("DELETE /items/:name", () => {
  test("Delete and item", async () => {
    const res = await request(app).delete(`/items/${item.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Deleted" });
  });
  test("Responds with 404 for deleting invalid item", async () => {
    const res = await request(app).delete("/items/hamburgers");
    expect(res.statusCode).toBe(404);
  });
});
