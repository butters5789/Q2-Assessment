exports.up = function(knex, Promise) {
  return knex.schema.createTable('library', function(table) {
    table.increments('id');
    table.integer('book_id').notNullable().references('id').inTable('books').onDelete('CASCADE');
    table.integer('author_id').notNullable().references('id').inTable('authors').onDelete('CASCADE');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('library');
};
