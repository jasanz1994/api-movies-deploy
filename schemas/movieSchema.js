import z from 'zod'

const schemaMovie = z.object({
    title: z.string({
        invalid_type_error: 'Title must be a string',
        required_error: 'Title is required'
    }),
    year: z.number().int().min(1990).max(2025),
    director: z.string(),
    duration: z.number().int().positive(),
    poster: z.string().url(),
    rate: z.number().min(0).max(10).default(6),
    genre: z.array(
        z.enum(['Action', 'Drama', 'Crime', 'Adventure', 'Sci-Fi',
            'Romance', 'Animation', 'Biography', 'Fantasy'
        ]))
})

export function  ValidatedMovie(object){
    return schemaMovie.safeParse(object)
}

export function ValidatedPartialMovie(object){
    return schemaMovie.partial().safeParse(object)
}

