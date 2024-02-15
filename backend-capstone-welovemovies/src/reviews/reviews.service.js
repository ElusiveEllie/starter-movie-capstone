const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

// Mapping critics for nested data
const addCritic = mapProperties({
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
});

// Read specified review
function read(review_id) {
  return knex("reviews").select("*").where({ review_id }).first();
}

// Update review
function update(updatedReview) {
  return knex("reviews")
    .select("*")
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview);
}

// Read updated review with critic information nested
function readAfterUpdate(review_id) {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("*")
    .where({ review_id: review_id })
    .then((result) => result.map((data) => addCritic(data)));
}

// Delete review
function destroy(review_id) {
  return knex("reviews").where({ review_id }).del();
}

module.exports = {
  read,
  update,
  readAfterUpdate,
  delete: destroy,
};
