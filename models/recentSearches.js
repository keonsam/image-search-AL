const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recentSearchSchema = new Schema(
  {
    searchQuery: String,
    when: Date
  }
);

const recentSearch = mongoose.model('recentSearch', recentSearchSchema);

module.exports = recentSearch;
