import mysql from 'mysql2/promise'

// Create the connection to database
const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: 'J4s4nz@5474',
    database: 'moviesdb',
});

export class MovieModel {

    static getAll = async ({ genre }) => {
        if (genre) {
            const [movie] = await connection.query(
                `SELECT title,year,director,duration,poster,rate 
                FROM movie m 
                JOIN movie_genres mg ON m.id = mg.movieID 
                JOIN genre g ON mg.genreID = g.id 
                WHERE LOWER(g.genre) = LOWER(?)`, [genre]
            )
            return movie
        }
        const [movie] = await connection.query(
            'SELECT BIN_TO_UUID(id) id,title,year,director,duration,poster,rate FROM movie'
        )
        return movie
    }

    static async getById({ id }) {

        const [movie] = await connection.query(
            `SELECT title,year,director,duration,poster,rate,BIN_TO_UUID(id) id 
            FROM movie 
            WHERE id = UUID_TO_BIN(?);`,
            [id]
        )

        return movie
    }

    static async create({ input }) {
        const { title, year, director, duration, poster, genre, rate } = input

        const [uuidResult] = await connection.query('SELECT UUID() uuid;')
        const [{ uuid }] = uuidResult

        try {
            await connection.query(
                `INSERT INTO movie (id, title, year, director, duration, poster, rate) 
                VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?, ?);`,
                [title, year, director, duration, poster, rate]
            )
        } catch (error) {
            throw new Error('Error creating movie')
        }

        genre.forEach(async (gen) => {
            const [id] = await connection.query(
                `SELECT id 
                FROM genre g 
                WHERE LOWER(g.genre) = LOWER(?);`,
                [gen]
            )
            await connection.query(
                `INSERT INTO movie_genres (movieID, genreID)
                VALUES (UUID_TO_BIN("${uuid}"), ?);`,
                [id[0].id]
            )
        })

        const [movie] = await connection.query(
            `SELECT title,year,director,duration,poster,rate,BIN_TO_UUID(id) id 
                FROM movie 
                WHERE id = UUID_TO_BIN(?);`,
            [uuid]
        )
        return movie
    }

    static async update({ id, input }) {
                
    }

    static async delete({ id }) {
        if (!id) {
            return false;
        }

        const [movieID] = await connection.query(
            'SELECT BIN_TO_UUID(id) id FROM movie WHERE id = UUID_TO_BIN(?);',
            [id]
        )
        if (movieID.length > 0) {
            try {
                await connection.query(
                    `DELETE FROM movie_genres WHERE movieID = UUID_TO_BIN(?);`,
                    [id]
                )
                await connection.query(
                    `DELETE FROM movie WHERE id = UUID_TO_BIN(?);`,
                    [id]
                )
                return true
            } catch (error) {
                throw new Error('Error deleting movie')
            }
        }
        return false;
    }
}