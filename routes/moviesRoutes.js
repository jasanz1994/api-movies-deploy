import { Router } from "express"

import { MovieController } from "../components/movieComponent.js"

export const createMovieRouter = ({ movieModel }) => {

    const moviesRouter = Router()

    const movieController = new MovieController({ movieModel })

    moviesRouter.get('/', movieController.getMovies)

    moviesRouter.get('/:id', movieController.getMovieById)

    moviesRouter.post('/', movieController.createMovie)

    moviesRouter.patch('/:id', movieController.updateMovie)

    moviesRouter.delete('/:id', movieController.deleteMovie)

    return moviesRouter
}