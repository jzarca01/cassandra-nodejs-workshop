const {types} = require('cassandra-driver');
const {mapToCharacterDB} = require('./character.db.model');
const {CassandraClient} = require('../database/cassandra-client.database');

module.exports = {
  getAllCharactersDB() {
    const query = 'SELECT * FROM workshop.characters';
    return CassandraClient.execute(query)
    .then(results => {
      return results.rows.map(row => mapToCharacterDB(row['id'], row['name'], row['house'], row['allegiance']));
    });
  },

  getCharacterById(id) {
    const params = [types.Uuid.fromString(id)];
    const query = 'SELECT * FROM workshop.characters WHERE id=?';
    return CassandraClient.execute(query, params)
    .then(result => result.first())
    .then(row => mapToCharacterDB(row['id'], row['name'], row['house'], row['allegiance']));
  },

  insertCharacter(characterToAdd) {
    const uuid = types.TimeUuid.now();
    const params = [uuid, characterToAdd.name, characterToAdd.house, characterToAdd.allegiance];
    const query = `INSERT INTO workshop.characters(id,name,house,allegiance) VALUES (?,?,?,?)`;
    return CassandraClient.execute(query, params).then(() => uuid.toString());
  },

  updateCharacter(id, characterToUpdate) {
    const params = [characterToUpdate.name, characterToUpdate.house, characterToUpdate.allegiance, types.Uuid.fromString(id)]
    const query = `UPDATE workshop.characters SET name=?, house=?, allegiance=? WHERE id=?`;
    return CassandraClient.execute(query, params).then(resQuery => !!resQuery); 
  },

  deleteCharacter(characterIdToDelete) {
    const params = [characterIdToDelete];
    const query = `DELETE FROM workshop.characters WHERE id=?`;
    return CassandraClient.execute(query,params).then(resQuery => !!resQuery);
  }
};