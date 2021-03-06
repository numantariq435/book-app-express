const { Genre } = require('../../models')
const { mongoIdRegex } = require('../../shared/common/regex')
const { handleError } = require('../../shared/common/helper');
const { USER_TYPES } = require('../../shared/common/constant');

/**
 * @description return all genres
 * @param {*} req 
 * @param {*} res 
 * @returns genres
 */
exports.getAllGenres = async (req, res) => {
  try {
    let { limit, offset } = req.query;
    if(!limit || !offset) {
      limti = '10';
      offset = '0'
    }

    const genreList = await Genre.find({ isDeleted: false }).skip(parseInt(offset)).limit(parseInt(limit));

    const totalGenres = await Genre.count({ isDeleted: false });

    return res.status(200).send({ list: genreList, total: totalGenres });
  } catch (err) {
    return handleError(res, err);
  }
}

/**
 * @description return genre by ID
 * @param {*} req 
 * @param {*} res 
 * @returns genre
 */
exports.getGenreById = async (req, res) => {
  try {
    const { id } = req.params;
    if(!mongoIdRegex.test(id)) return res.status(404).send({ message: 'Genre not Found!' });

    const genre = await Genre.findOne({_id: id, isDeleted: false});
    if(!genre) return res.status(404).send({ message: "Genre not found!" });

    return res.status(200).send(genre);
  } catch (err) {
    return handleError(res, err);
  }
}

/**
 * @description add genre
 * @param {*} req 
 * @param {*} res 
 * @returns new created genre
 */
exports.addGenre = async (req, res) => {
  try {
    const { name } = req.body;
    if(!name && name.length == 0) return res.status(400).send({ message: 'Name must be a string with length greather than 0'});

    const genre = new Genre({name});
    await genre.save();

    genre.isDeleted = undefined;

    return res.status(201).send(genre);
  } catch (err) {
    return handleError(res, err);
  }
}

/**
 * @description update genre
 * @param {*} req 
 * @param {*} res 
 * @returns updated genre
 */
exports.updateGenre = async (req, res) => {
  try {
    const { id } = req.params;
    if(!mongoIdRegex.test(id)) return res.status(404).send({ message: 'Genre not Found!' });

    const { name } = req.body;
    if(!name && name.length == 0) return res.status(400).send({ message: 'Name must be a string with length greather than 0'});

    const genre = await Genre.findOneAndUpdate({_id: id, isDeleted: false}, {name, updatedAt: new Date()}, {new: true});

    return res.status(200).send(genre);
  } catch (err) {
    return handleError(res, err);
  }
}

/**
 * @description to delete a genre
 * @param {*} req 
 * @param {*} res 
 * @returns deleted genre
 */
exports.deleteGenre = async (req, res) => {
  try {
    const { id } = req.params;
    if(!mongoIdRegex.test(id)) return res.status(404).send({ message: 'Genre not Found!' });

    const genre = await Genre.findByIdAndUpdate(id, {isDeleted: true}, {new: true});
    
    return res.status(200).send({ message: `Genre with name ${genre.name} is deleted successfully!` });
  } catch (err) {
    return handleError(res, err);
  }
}