import { MovieModel } from "../models/movieModel"

export class MovieController {

    static async getMovies(req, res) {
        const { genre } = req.query
        const movies = await MovieModel.getAll({ genre })
        res.json(movies)
    }

    static async getMovieById(req, res) {
        const { id } = req.params
        const movie = await MovieModel.getById({ id })

        if (movie) return res.json(movie)

        return res.status(404).json({ message: 'Movie not found' })
    }

    static async createMovie(req, res) {
        const result = ValidatedMovie(req.body)

        if (result.error) {
            return res.status(422).json({ error: JSON.parse(result.error.message) })
        }

        const newMovie = await MovieModel.create({ input: result.data })

        res.status(201).json(newMovie)
    }

    static async updateMovie(req, res) {
        const result = ValidatedPartialMovie(req.body)

        if (result.error) {
            return res.status(404).json({ error: JSON.parse(result.error.message) })
        }

        const { id } = req.params
        const updatedMovie = await MovieModel.update({ id, input: result.data })

        if (updatedMovie) {
            return res.json(updatedMovie)
        }

        return res.status(404).json({ message: 'Movie not found' })
    }

    static async deleteMovie(req, res) {
        const deleted = await MovieModel.delete({ id: req.params.id })

        if (deleted === false) return res.status(404).json({ message: 'Movie not found' }) 
        
        return res.json({ message: 'Movie Deleted' })
    }
}