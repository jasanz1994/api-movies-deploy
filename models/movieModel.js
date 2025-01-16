import movies from '../movies.json' with {type: 'json'}
import { randomUUID } from 'node:crypto'

export class MovieModel {
    static async getAll({ genre }) {
        if (genre) {
            return movies.filter(
                movie => movie.genre.some(g => g.toLowerCase() == genre.toLowerCase())
            )
        }
        return movies
    }

    static async getById({ id }) {
        const movie = movies.find(m => m.id == id)
        if (movie) return movie
    }

    static async create({ input }) {
        const newMovie = {
            id: randomUUID(),
            ...input
        }
        movies.push(newMovie)
        return newMovie
    }

    static async update({ id, input }) {
        const movieIndex = movies.findIndex(movie => movie.id == id)

        if (movieIndex == -1) return false

        const movieUpdated = {
            ...movies[movieIndex],
            ...input
        }

        movies[movieIndex] = movieUpdated
        return movieUpdated
    }

    static async delete({ id }) {
        const movieIndex = movies.findIndex(movie => movie.id == id)
        if (movieIndex === -1) return false

        movies.splice(movieIndex, 1)
        return true
    }
}