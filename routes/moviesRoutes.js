import { Router } from "express"

import { MovieController } from "../components/movieComponent.js"

export const moviesRouter = Router()

moviesRouter.get('/', MovieController.getMovies())

moviesRouter.get('/:id', MovieController.getMovieById())

moviesRouter.post('/', MovieController.createMovie())

moviesRouter.patch('/:id', MovieController.updateMovie())

moviesRouter.delete('/:id', MovieController.deleteMovie())